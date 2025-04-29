import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { ApiTags, ApiBearerAuth, ApiQuery, ApiBody } from "@nestjs/swagger";

@ApiTags("Posts")
@ApiBearerAuth()
@Controller("posts")
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiBody({
    description: "The post data to be created",
    type: CreatePostDto,
  })
  async create(@Req() req: Request, @Body() dto: CreatePostDto) {
    try {
      const user = req.user as { id: string };
      return await this.postService.create(user.id, dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || "Failed to create post");
    }
  }

  @Get()
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
    description: "Page number for pagination",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    example: 10,
    description: "Number of items per page",
  })
  async findAll(
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ) {
    try {
      return await this.postService.findAll({ page, limit });
    } catch (error: any) {
      throw new BadRequestException(error.message || "Failed to fetch posts");
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      return await this.postService.findOne(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || "Failed to fetch post");
    }
  }
}
