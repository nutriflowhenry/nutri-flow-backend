import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserReviewDto {
  @ApiProperty({
    description: 'Contenido de la review realizada por un usario',
    example: 'Excelente aplicación',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;
}
