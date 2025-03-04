import { Type } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthdate: Date;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsDecimal()
  @Min(0.01)
  @Max(250)
  weight: number;

  @IsNotEmpty()
  @IsDecimal()
  @Min(0.01)
  @Max(3)
  height: number;
}
