import { Exclude, Expose, Type } from 'class-transformer';
import { PublicFavoriteUserDto } from './public-favorite-user.dto';
import { PublicPost } from './public-post.dto';

export class PublicFavoriteDto {
  @Expose({ groups: ['active', 'inactive'] })
  @Type(() => PublicFavoriteUserDto)
  user: PublicFavoriteUserDto;

  @Expose({ groups: ['active'] })
  postMessage: string = 'publicación no disponible';

  @Expose({ groups: ['active'] })
  @Type(() => PublicPost)
  post?: PublicPost;
}
