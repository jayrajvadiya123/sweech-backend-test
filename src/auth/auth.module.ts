import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtStrategy } from "./guards/jwt.strategy";
import { LoginHistoryService } from "src/login-history/login-history.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "20m" },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService, LoginHistoryService],
  exports: [AuthService],
})
export class AuthModule {}
