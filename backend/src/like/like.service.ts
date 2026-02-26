import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likeBlog(userId: string, blogId: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId, isPublished: true },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    try {
      await this.prisma.like.create({ data: { userId, blogId } });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Already liked this blog');
      }
      throw error;
    }

    const likeCount = await this.prisma.like.count({ where: { blogId } });
    return { liked: true, likeCount };
  }

  async unlikeBlog(userId: string, blogId: string) {
    const like = await this.prisma.like.findUnique({
      where: { userId_blogId: { userId, blogId } },
    });

    if (!like) throw new NotFoundException('Like not found');

    await this.prisma.like.delete({
      where: { userId_blogId: { userId, blogId } },
    });

    const likeCount = await this.prisma.like.count({ where: { blogId } });
    return { liked: false, likeCount };
  }

  async getLikeStatus(userId: string, blogId: string) {
    const like = await this.prisma.like.findUnique({
      where: { userId_blogId: { userId, blogId } },
    });

    const likeCount = await this.prisma.like.count({ where: { blogId } });

    return { liked: !!like, likeCount };
  }
}
