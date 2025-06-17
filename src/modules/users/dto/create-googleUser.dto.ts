import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsIanaTimezone } from '../../../decorators/is-iana-timezone.validator';

export class CreateGoogleUserDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsIanaTimezone({ message: 'Debe proporcionar una zona horaria IANA válida, e.g. America/Mexico_City' })
    timezone: string;
}