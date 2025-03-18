import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Req,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-commnet.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { GetCommentDto } from './dto/get-comment.dto';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createComment(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createCommentData: CreateCommentDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.commentService.create(postId, req.user.sub, createCommentData);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAllbyPost(
    @Param('postId') postId: string,
    @Query() paginationData: GetCommentDto,
  ) {
    return this.commentService.findAllByPost(postId, paginationData);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentService.findOne(+id);
  // }

  @UseGuards(AuthGuard)
  @Patch(':commentId')
  async update(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentData: UpdateCommentDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.commentService.update(
      postId,
      commentId,
      req.user.sub,
      updateCommentData,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':commentId')
  async remove(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.commentService.remove(postId, commentId, req.user.sub);
  }
}
