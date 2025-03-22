import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Tag } from '../../enums/tag.enum';
import { Transform, Type } from 'class-transformer';
import { PostStatus } from '../../enums/post-status.enum';

export class GetPostDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page = 1;
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit = 10;
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
  @IsOptional()
  @IsArray()
  @IsEnum(Tag, { each: true })
  @Transform(({ value }) => value.split(','))
  tags?: Tag[];
  @IsOptional()
  @IsString()
  @Length(5, 100)
  searchOnTitle?: string;
}
