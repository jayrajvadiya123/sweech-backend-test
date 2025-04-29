import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
  Patch,
  Body,
  Req,
  NotFoundException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Request } from "express";
import * as bcrypt from "bcrypt";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({
    name: "email",
    required: true,
    description: "The email of the user to search for",
    example: "john@example.com",
  })
  async findUserByEmail(@Query("email") email: string) {
    try {
      if (!email) {
        throw new BadRequestException("Email is required");
      }

      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      return user;
    } catch (error: any) {
      throw new BadRequestException(
        error.message || "Failed to fetch user records"
      );
    }
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const user = req.user as { id: string };
    const updatedFields: any = {};

    if (updateUserDto.username) {
      updatedFields.username = updateUserDto.username;
    }

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updatedFields.password = hashedPassword;
    }

    // Call the service to update the user
    try {
      await this.userService.updateUser(user.id, updatedFields);
    } catch (error: any) {
      throw new BadRequestException(error.message || "Failed to update user");
    }
  }
}
