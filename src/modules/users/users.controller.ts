import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   HttpCode,
   HttpStatus,
   UseGuards,
   ParseUUIDPipe, Req, Put
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
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


   @Get()
   @HttpCode(HttpStatus.OK)
   @Roles(Role.ADMIN, Role.USER)
   @UseGuards(AuthGuard, RolesGuard)
   findAll(): Promise<PublicUserDto[]> {
      return this.usersService.findAll();
   }


   @Get(':id')
   @HttpCode(HttpStatus.OK)
   @UseGuards(AuthGuard)
   findOne(
      @Req() request: Request & { user: any }): Promise<PublicUserDto> {
      const requesterId = request.user.sub;
      return this.usersService.findOne(requesterId);
   }


   @Put(':id')
   @HttpCode(HttpStatus.OK)
   @UseGuards(AuthGuard)
   update(
      @Req() request: Request & { user: any },
      @Body() updateData: UpdateUserDto): Promise<User> {
      const requesterId = request.user.sub;
      return this.usersService.update(requesterId, updateData);
   }


   @Delete(':id')
   @HttpCode(HttpStatus.NO_CONTENT)
   @UseGuards(AuthGuard)
   remove(
      @Req() request: Request & { user: any }): Promise<void> {
      const requesterId = request.user.sub;
      return this.usersService.remove(requesterId);
   }
}
