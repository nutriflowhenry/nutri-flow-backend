import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PublicPostAuthorDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  profilePicture: string;
}
