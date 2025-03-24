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
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Titulo del post',
    example: 'Carne asada con nopales',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 120)
  title: string;

  @ApiProperty({
    description: 'Contenido del Post',
    example: 'Ingredientes...',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  // @Length(500, 5000)
  @Length(10, 200) // Para pruebas
  content: string;

  @ApiProperty({
    description: `Etiquetas relacionadas con el contenido del Post`,
    example: [Tag.DAIRYFREE],
    required: false,
    enum: Tag,
    enumName: 'Etiquetas',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Tag, { each: true })
  tags?: Tag[];

  @IsOptional()
  @IsString()
  image?: string;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreatePostImageDto)
  // images?: CreatePostImageDto[];
}
