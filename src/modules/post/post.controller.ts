import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Query,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/post/create-post.dto';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { GetPostDto } from './dto/post/get-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.postService.createPost(req.user.sub, createPostDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('all')
  async getAll(@Query() getPostData: GetPostDto) {
    return this.postService.getAll(getPostData);
  }

  @UseGuards(AuthGuard)
  @Get('allActive')
  async getAllActive(@Query() getPostData: GetPostDto) {
    return this.postService.getAllActive(getPostData);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async update(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.postService.update(postId, req.user.sub, updatePostDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('approve/:id')
  async approve(@Param('id', ParseUUIDPipe) postId: string) {
    return this.postService.approve(postId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('ban/:id')
  async ban(@Param('id', ParseUUIDPipe) postId: string) {
    return this.postService.ban(postId);
  }

  @Put(':postId/image')
  @UseGuards(AuthGuard)
  async updateImage(
    @Req() req: { user: { sub: string } },
    @Param('postId') postId: string,
    @Body('fileType') fileType: string,
  ): Promise<object> {
    await this.postService.updatePostImage(postId, req.user.sub, fileType);
    return { message: 'Post image updated successfully' };
  }
}
