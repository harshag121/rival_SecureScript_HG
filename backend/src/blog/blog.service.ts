import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { LogsBuffer } from '../admin/logs.buffer';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('blog') private readonly blogQueue: Queue,
    private readonly logs: LogsBuffer,
  ) {}

  async create(userId: string, dto: CreateBlogDto) {
    const slug = await this.generateUniqueSlug(dto.title);

    const blog = await this.prisma.blog.create({
      data: {
        userId,
        title: dto.title,
        slug,
        content: dto.content,
        summary: dto.summary,
        isPublished: dto.isPublished ?? false,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    // Enqueue background job for summary generation if published
    if (blog.isPublished && !blog.summary) {
      await this.blogQueue.add('generate-summary', { blogId: blog.id }).catch(() => {
        // Redis might not be available; log but don't fail
      });
    }

    this.logs.success(`[BLOG] Created: "${blog.title}" (${blog.isPublished ? 'published' : 'draft'})`, { blogId: blog.id, userId });
    return blog;
  }

  async findAllByUser(userId: string) {
    return this.prisma.blog.findMany({
      where: { userId },
      include: {
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId) throw new ForbiddenException('Access denied');

    return blog;
  }

  async update(id: string, userId: string, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId) throw new ForbiddenException('Access denied');

    let slug = blog.slug;
    if (dto.title && dto.title !== blog.title) {
      slug = await this.generateUniqueSlug(dto.title, id);
    }

    const updated = await this.prisma.blog.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.title ? { slug } : {}),
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    // Enqueue summary job when blog becomes published
    if (updated.isPublished && !updated.summary) {
      await this.blogQueue.add('generate-summary', { blogId: updated.id }).catch(() => {});
    }

    this.logs.info(`[BLOG] Updated: "${updated.title}" → ${updated.isPublished ? 'published' : 'draft'}`, { blogId: id });
    return updated;
  }

  async remove(id: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.blog.delete({ where: { id } });
    this.logs.warn(`[BLOG] Deleted: "${blog.title}"`, { blogId: id, userId });
    return { message: 'Blog deleted successfully' };
  }

  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = (slugify as any)(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.blog.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
