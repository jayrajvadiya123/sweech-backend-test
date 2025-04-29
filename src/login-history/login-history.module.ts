import { Module } from "@nestjs/common";
import { LoginHistoryService } from "./login-history.service";
import { LoginHistoryController } from "./login-history.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [LoginHistoryController],
  providers: [LoginHistoryService, PrismaService],
})
export class LoginHistoryModule {}
