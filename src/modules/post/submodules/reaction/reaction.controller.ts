import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Req,
  Patch,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller('post')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @UseGuards(AuthGuard)
  @Post(':postId/reaction')
  create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.reactionService.create(postId, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('reaction/me')
  findAllByUser(@Req() req: { user: { sub: string } }) {
    return this.reactionService.findAllByUser(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('reaction/:reactionId/me/delete')
  softDelete(
    @Req() req: { user: { sub: string } },
    @Param('reactionId') reactionId: string,
  ) {
    return this.reactionService.sofDelete(reactionId, req.user.sub);
  }
}
