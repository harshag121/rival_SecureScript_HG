import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/comment.dto';
import { PaginationDto } from '../public/dto/pagination.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(userId: string, blogId: string, dto: CreateCommentDto) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId, isPublished: true },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    return this.prisma.comment.create({
      data: { userId, blogId, content: dto.content },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getComments(blogId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId, isPublished: true },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    const [comments, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where: { blogId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.comment.count({ where: { blogId } }),
    ]);

    return {
      data: comments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }
}
