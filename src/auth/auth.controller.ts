import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() body: SignupDto) {
    try {
      return this.authService.signup(body.email, body.password, body.username);
    } catch (error: any) {
      throw new BadRequestException(error.message || "Signup failed");
    }
  }

  @Post("login")
  async login(@Req() req: Request, @Body() body: LoginDto) {
    try {
      const token = await this.authService.login(
        body.email,
        body.password,
        req
      );
      if (!token) throw new UnauthorizedException("Invalid credentials");
      return token;
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error.message || "Login failed");
    }
  }
}
