import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Controller('blogs')
@UseGuards(JwtAuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(
    @GetUser('id') userId: string,
    @Body() dto: CreateBlogDto,
  ) {
    return this.blogService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.blogService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.blogService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return this.blogService.remove(id, userId);
  }
}
