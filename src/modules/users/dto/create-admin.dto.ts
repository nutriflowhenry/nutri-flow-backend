import { CreateLocalUserDto } from './create-local-user.dto';
import { OmitType } from '@nestjs/swagger';

export class CreateAdminDto extends OmitType(CreateLocalUserDto,
   ['passwordConfirmation']) {
}