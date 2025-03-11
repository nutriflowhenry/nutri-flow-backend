import { PartialType } from '@nestjs/mapped-types';
import { CreateLocalUserDto } from './create-local-user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateLocalUserDto) {
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    profilePicture?: string;
}
