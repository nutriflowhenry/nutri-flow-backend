import {
   Controller,
   Get,
   Body,
   Delete,
   HttpCode,
   HttpStatus,
   UseGuards,
   Req, Put, Param, Patch
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PublicUserDto } from './dto/public-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {
   }

   // @Post()
   // create(@Body() createUserDto: CreateLocalUserDto) {
   //    return this.usersService.create(createUserDto);
   // }


   @Get('all')
   @HttpCode(HttpStatus.OK)
   @Roles(Role.ADMIN)
   @UseGuards(AuthGuard, RolesGuard)
   findAll(): Promise<PublicUserDto[]> {
      return this.usersService.findAll();
   }


   @Get('me')
   @HttpCode(HttpStatus.OK)
   @UseGuards(AuthGuard)
   findMe(
      @Req() request: Request & { user: any }): Promise<PublicUserDto> {
      const requesterId = request.user.sub;
      return this.usersService.findOne(requesterId);
   }


   @Get(':id')
   @HttpCode(HttpStatus.OK)
   @UseGuards(AuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   findOne(@Param('id') id: string): Promise<PublicUserDto> {
      return this.usersService.findOne(id);
   }


   @Put('me')
   @HttpCode(HttpStatus.OK)
   @UseGuards(AuthGuard)
   update(
      @Req() request: Request & { user: any },
      @Body() updateData: UpdateUserDto): Promise<PublicUserDto> {
      const requesterId = request.user.sub;
      return this.usersService.update(requesterId, updateData);
   }


   @Delete('me')
   @HttpCode(HttpStatus.NO_CONTENT)
   @UseGuards(AuthGuard)
   deactivateAccount(
      @Req() request: Request & { user: any }): Promise<void> {
      const requesterId = request.user.sub;
      return this.usersService.deactivateAccount(requesterId);
   }


   @Patch(':id/ban')
   @HttpCode(HttpStatus.NO_CONTENT)
   @UseGuards(AuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   banUser(@Param('id') id: string): Promise<void> {
      return this.usersService.banUser(id);
   }
}
