import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Tag } from '../../enums/tag.enum';
import { CreatePostImageDto } from '../post-image/create-post-image.dto';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 120)
  title: string;

  @IsString()
  @IsNotEmpty()
  // @Length(500, 5000)
  @Length(10, 200) // Para pruebas
  content: string;

  @IsArray()
  @IsEnum(Tag, { each: true })
  tags: Tag[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostImageDto)
  images?: CreatePostImageDto[];
}
