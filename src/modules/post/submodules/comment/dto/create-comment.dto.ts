import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 500) // Para pruebas, después de puede modificar
  content: string;
}
