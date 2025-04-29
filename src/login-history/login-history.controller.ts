import {
  Controller,
  Get,
  Req,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { LoginHistoryService } from "./login-history.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Login History")
@ApiBearerAuth()
@Controller("login-history")
@UseGuards(JwtAuthGuard)
export class LoginHistoryController {
  constructor(private readonly service: LoginHistoryService) {}

  @Get("records")
  async getUserRecords(@Req() req: Request) {
    try {
      const user = req.user as { id: string };
      return await this.service.getLoginRecords(user.id);
    } catch (error: any) {
      throw new BadRequestException(
        error.message || "Failed to fetch login records"
      );
    }
  }

  @Get("rankings")
  async getWeeklyRankings() {
    try {
      return await this.service.getWeeklyRankings();
    } catch (error: any) {
      throw new BadRequestException(
        error.message || "Failed to fetch weekly rankings"
      );
    }
  }
}
