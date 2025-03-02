import { OmitType } from '@nestjs/swagger';
import { CreateLocalUserDto } from './create-local-user.dto';
import { IsString } from 'class-validator';

export class CreateAuth0UserDto extends OmitType(CreateLocalUserDto, ['password', 'passwordConfirmation'] as const) {
   @IsString()
   auth0Id: string;
}