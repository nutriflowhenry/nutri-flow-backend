import {
  Controller,
  Get,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Put,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PublicUserDto } from './dto/public-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserReviewDto } from './submodules/user-review/dto/create-user-review.dto';
import { GetUserReviewsDto } from './submodules/user-review/dto/get-user-review.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    @Req() request: Request & { user: { sub: string } },
  ): Promise<PublicUserDto> {
    const requesterId = request.user.sub;
    return this.usersService.findOne(requesterId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve todas las reviews realizadas por los usuarios',
    description:
      'Requiere autenticación\n' +
      '\nSólo puede ser usado por un administrador\n' +
      '\nEn caso de exito retorna un mensaje y los datos de todas las reviews',
  })
  @ApiQuery({
    type: Number,
    name: 'page',
    default: 1,
    required: false,
  })
  @ApiQuery({
    type: Number,
    name: 'limit',
    default: 10,
    required: false,
  })
  @Get('reviews')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAllreviews(@Query() paginationData: GetUserReviewsDto) {
    return this.usersService.findAllreviews(paginationData);
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
    @Req() request: Request & { user: { sub: string } },
    @Body() updateData: UpdateUserDto,
  ): Promise<PublicUserDto> {
    const requesterId = request.user.sub;
    return this.usersService.update(requesterId, updateData);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  deactivateAccount(
    @Req() request: Request & { user: { sub: string } },
  ): Promise<void> {
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

  @Patch(':id/unban')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  unban(@Param('id') id: string): Promise<void> {
    return this.usersService.unbanUser(id);
  }

  @Put(':userId/profile-picture')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateProfilePicture(
    @Param('userId') userId: string,
    @Body('fileType') fileType: string,
  ): Promise<object> {
    await this.usersService.updateProfilePicture(userId, fileType);
    return { message: 'Profile picture updated successfully' };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crea el registro de una review',
    description:
      'Requiere autenticación\n' +
      '\nSólo se puede crear una review por usuario autenticado\n' +
      '\nSe tiene que enviar por el cuerpo de la petición el contenido de la review\n' +
      '\nEn caso de exito retorna un mensaje y los datos de la review creada',
  })
  @ApiBody({
    type: CreateUserReviewDto,
    examples: {
      ejemplo: {
        value: {
          content: 'Excelente aplicación',
        },
      },
    },
  })
  @Post('review')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async createReview(
    @Req() request: Request & { user: { sub: string } },
    @Body() reviewData: CreateUserReviewDto,
  ) {
    const userId = request.user.sub;
    return this.usersService.createReview(userId, reviewData);
  }
}
