import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PublicFavoriteUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
