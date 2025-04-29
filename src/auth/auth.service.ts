import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { LoginHistoryService } from "src/login-history/login-history.service";
import { Request } from "express";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private loginHistoryService: LoginHistoryService
  ) {}

  async signup(email: string, password: string, username: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        createdAt: new Date().toISOString(),
      },
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      registrationTime: user.createdAt,
    };
  }

  async login(email: string, password: string, request: Request) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.config.get<string>("JWT_SECRET"),
      expiresIn: "20m",
    });
    const ip =
      request.headers["x-forwarded-for"]?.toString().split(",")[0] || "";

    await this.loginHistoryService.recordLogin(user.id, ip);

    return { accessToken: token };
  }
}
