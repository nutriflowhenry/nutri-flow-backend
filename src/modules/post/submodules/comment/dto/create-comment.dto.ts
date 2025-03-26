import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Excelente receta',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 500) // Para pruebas, después de puede modificar
  content: string;
}
