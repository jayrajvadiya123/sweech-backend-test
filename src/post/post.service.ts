import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { PaginationDto } from "./dto/pagination.dto";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId: userId,
      },
      include: { user: true },
    });

    return {
      id: post.id,
      title: post.title,
      username: post.user.username,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async findAll(pagination: PaginationDto) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      this.prisma.post.count(),
    ]);

    return {
      total,
      posts: posts.map((post: any) => ({
        id: post.id,
        title: post.title,
        username: post.user.username,
        createdAt: post.createdAt.toISOString(),
      })),
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!post) throw new NotFoundException("Post not found");

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      username: post.user.username,
      createdAt: post.createdAt.toISOString(),
    };
  }
}
