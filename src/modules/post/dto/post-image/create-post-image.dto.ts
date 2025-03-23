import { IsNotEmpty, IsPositive, IsUrl, Length } from 'class-validator';

export class CreatePostImageDto {
  @IsNotEmpty()
  //   @IsUrl({})
  url: string;

  @IsNotEmpty()
  @IsPositive()
  order: number;
}
