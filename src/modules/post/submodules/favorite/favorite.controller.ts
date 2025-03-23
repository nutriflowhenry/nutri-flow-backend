import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { GetFavoritePosttDto } from './dto/get-favorite-post.dto';
import { GroupSerializerInterceptor } from './interceptor/groups-serializer.interceptor';

@Controller('post')
@UseInterceptors(GroupSerializerInterceptor)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(AuthGuard)
  @Post(':postId/favorite')
  create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.favoriteService.create(postId, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('favorites/me')
  findAllByUser(
    @Query() paginationData: GetFavoritePosttDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.favoriteService.findAllByUser(paginationData, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('favorite/:favoriteId')
  softDelete(
    @Param('favoriteId', ParseUUIDPipe) favoriteId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.favoriteService.softDelete(favoriteId, req.user.sub);
  }
}
