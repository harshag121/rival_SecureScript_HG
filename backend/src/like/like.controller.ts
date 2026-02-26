import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { LikeService } from './like.service';

@Controller('blogs/:blogId/like')
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  like(
    @GetUser('id') userId: string,
    @Param('blogId') blogId: string,
  ) {
    return this.likeService.likeBlog(userId, blogId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  unlike(
    @GetUser('id') userId: string,
    @Param('blogId') blogId: string,
  ) {
    return this.likeService.unlikeBlog(userId, blogId);
  }

  @Get('status')
  getStatus(
    @GetUser('id') userId: string,
    @Param('blogId') blogId: string,
  ) {
    return this.likeService.getLikeStatus(userId, blogId);
  }
}
