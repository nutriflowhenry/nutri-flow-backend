import { Exclude, Expose, Type } from 'class-transformer';
import { PublicPostAuthorDto } from './public-favorite-author.dto';

@Exclude()
export class PublicPost {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => PublicPostAuthorDto)
  author: PublicPostAuthorDto;
}
