import { Exclude, Type } from 'class-transformer';
import { PublicPost } from '../../favorite/dto/public-post.dto';
import { PublicFavoriteUserDto } from '../../favorite/dto/public-favorite-user.dto';

export class PublicPostReaction {
  @Type(() => PublicFavoriteUserDto)
  user: PublicFavoriteUserDto;

  @Type(() => PublicPost)
  post: PublicPost;

  @Exclude()
  isActive: boolean;
}
