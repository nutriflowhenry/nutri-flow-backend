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
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/roles.enum';

@Controller('post/:postId/comment')
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
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() paginationData: GetCommentDto,
  ) {
    return this.commentService.findAllByPost(postId, paginationData);
  }

  @UseGuards(AuthGuard)
  @Patch(':commentId')
  async update(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
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
  @Delete('my/:commentId')
  async remove(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.commentService.remove(postId, commentId, req.user.sub);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':commentId')
  async removeByAdmin(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.commentService.removeByAdmin(postId, commentId);
  }
}
