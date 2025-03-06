import {
  Controller,
  // Get,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
// import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

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
    return this.userProfilesService.findOneByUser(req.user.sub);
  }

  // @Get()
  // findAll() {

  //   return this.userProfilesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userProfilesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserProfileDto: UpdateUserProfileDto) {
  //   return this.userProfilesService.update(+id, updateUserProfileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userProfilesService.remove(+id);
  // }
}
