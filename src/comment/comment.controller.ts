import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
  Get,
  Delete,
  ParseIntPipe,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Request } from "express";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

@ApiTags("Comments")
@ApiBearerAuth()
@Controller("comments")
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(":postId")
  async create(
    @Param("postId") postId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request
  ) {
    try {
      const user = req.user as { id: string };
      return this.commentService.create(user.id, postId, dto);
    } catch (error: any) {
      throw new BadRequestException(
        error.message || "Failed to create comment"
      );
    }
  }

  @Get(":postId")
  @Get()
  @ApiQuery({
    name: "cursor",
    required: false,
    type: String,
    example: 1,
    description: "Cursor for pagination",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    example: 10,
    description: "Number of items per page",
  })
  async findAll(
    @Param("postId") postId: string,
    @Query("cursor") cursor: string,
    @Query("limit", ParseIntPipe) limit: number = 10
  ) {
    try {
      return await this.commentService.findAll(postId, limit, cursor);
    } catch (error: any) {
      throw new BadRequestException(
        error.message || "Failed to fetch comments"
      );
    }
  }

  @Delete(":commentId")
  async delete(@Param("commentId") commentId: string, @Req() req: Request) {
    try {
      const user = req.user as { id: string };
      return await this.commentService.delete(commentId, user.id);
    } catch (error: any) {
      if (error instanceof ForbiddenException) throw error;
      throw new BadRequestException(
        error.message || "Failed to delete comment"
      );
    }
  }
}
