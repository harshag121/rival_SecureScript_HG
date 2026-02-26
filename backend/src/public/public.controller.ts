import { Controller, Get, Param, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PublicService } from './public.service';
import { PaginationDto } from './dto/pagination.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('feed')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  getFeed(@Query() pagination: PaginationDto) {
    return this.publicService.getFeed(pagination);
  }

  @Get('blogs/:slug')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  getBlogBySlug(@Param('slug') slug: string) {
    return this.publicService.getBlogBySlug(slug);
  }
}
