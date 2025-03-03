import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PublicUserDto } from './dto/public-user.dto';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {
   }

   @Post()
   create(@Body() createUserDto: CreateLocalUserDto) {
      return this.usersService.create(createUserDto);
   }

   @Get()
   @HttpCode(HttpStatus.OK)
   @Roles(Role.ADMIN, Role.USER)
   @UseGuards(AuthGuard, RolesGuard)
   findAll(): Promise<PublicUserDto[]> {
      return this.usersService.findAll();
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.usersService.findOne(+id);
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(+id, updateUserDto);
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.usersService.remove(+id);
   }
}
