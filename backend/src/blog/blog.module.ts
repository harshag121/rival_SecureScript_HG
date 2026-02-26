import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogProcessor } from './blog.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'blog',
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogProcessor],
  exports: [BlogService],
})
export class BlogModule {}
