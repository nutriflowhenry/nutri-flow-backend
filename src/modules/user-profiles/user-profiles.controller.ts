import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Patch,
} from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createUserProfileDto: CreateUserProfileDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.userProfilesService.create(createUserProfileDto, req.user.sub);
  }

  @Get()
  @UseGuards(AuthGuard)
  findOneByUser(@Req() req: { user: { sub: string } }) {
    return this.userProfilesService.findOneByUserId(req.user.sub);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(
    @Req() req: { user: { sub: string } },
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfilesService.update(req.user.sub, updateUserProfileDto);
  }
}
