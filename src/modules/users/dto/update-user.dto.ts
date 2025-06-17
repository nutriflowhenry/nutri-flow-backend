import { PartialType } from '@nestjs/mapped-types';
import { CreateLocalUserDto } from './create-local-user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIanaTimezone } from 'src/decorators/is-iana-timezone.validator';

export class UpdateUserDto extends PartialType(CreateLocalUserDto) {
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: 'true', description: 'Indica si la cuenta está activa' })
    isActive?: boolean;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'profile-pictures/userId.jpg',
        description: 'Ruta que es empleada como clave para almacenamiento de archivos en S3'
    })
    profilePicture?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsString() 
    @Transform(({ value }) => value?.trim())
    @IsIanaTimezone({ message: 'Debe proporcionar una zona horaria IANA válida, e.g. America/Mexico_City' })
    timezone?: string;

    @IsOptional()
    @IsBoolean()
    notifications?: boolean;
}
