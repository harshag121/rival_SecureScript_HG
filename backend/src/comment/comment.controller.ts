import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/comment.dto';
import { PaginationDto } from '../public/dto/pagination.dto';

@Controller('blogs/:blogId/comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createComment(
    @GetUser('id') userId: string,
    @Param('blogId') blogId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.createComment(userId, blogId, dto);
  }

  @Public()
  @Get()
  getComments(
    @Param('blogId') blogId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.commentService.getComments(blogId, pagination);
  }
}
