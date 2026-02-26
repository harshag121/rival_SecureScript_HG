import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Processor('blog')
export class BlogProcessor {
  private readonly logger = new Logger(BlogProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('generate-summary')
  async handleGenerateSummary(job: Job<{ blogId: string }>) {
    this.logger.log(`Processing summary generation for blog: ${job.data.blogId}`);

    try {
      const blog = await this.prisma.blog.findUnique({
        where: { id: job.data.blogId },
        select: { id: true, content: true, summary: true },
      });

      if (!blog || blog.summary) {
        this.logger.log(`Blog ${job.data.blogId} already has summary or not found`);
        return;
      }

      // Generate a simple summary (first 200 chars + ...)
      const summary = blog.content.slice(0, 200).trim() + '...';

      await this.prisma.blog.update({
        where: { id: job.data.blogId },
        data: { summary },
      });

      this.logger.log(`Summary generated for blog: ${job.data.blogId}`);
    } catch (error) {
      this.logger.error(`Failed to generate summary for blog ${job.data.blogId}`, error);
      throw error;
    }
  }
}
