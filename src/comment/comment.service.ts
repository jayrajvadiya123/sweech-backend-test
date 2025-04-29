import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, postId: string, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        postId,
        userId,
      },
      include: { user: true },
    });

    return {
      id: comment.id,
      content: comment.content,
      username: comment.user.username,
      createdAt: comment.createdAt.toISOString(),
    };
  }

  async findAll(postId: string, limit = 10, cursor: string) {
    const comments = await this.prisma.comment.findMany({
      where: { postId },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    const nextCursor =
      comments.length === limit ? comments[comments.length - 1].id : null;

    return {
      comments: comments.map((c: any) => ({
        id: c.id,
        content: c.content,
        username: c.user.username,
        createdAt: c.createdAt.toISOString(),
      })),
      nextCursor,
    };
  }

  async delete(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true, post: { include: { user: true } } },
    });

    if (!comment) throw new NotFoundException("Comment not found");

    const isOwner = comment.userId === userId || comment.post.userId === userId;

    if (!isOwner) throw new ForbiddenException("Not allowed to delete comment");

    await this.prisma.comment.delete({ where: { id: commentId } });

    return { message: "Comment deleted successfully" };
  }
}
