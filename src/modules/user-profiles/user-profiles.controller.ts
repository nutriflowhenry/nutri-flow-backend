import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Gender } from './enums/gender.enum';
import { ActivityLevel } from './enums/activity-level.enum';
import { Goal } from './enums/goal.enum';

@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Crea un perfil con datos nutricionales para un usuario autenticado',
    description:
      'Requiere autenticación\n' +
      '\nEste perfil contiene datos que se usan para calcular una ingesta sugerida de agua y calorías\n' +
      '\nPara crear un perfil se debe enviar en el cuerpo de la solicitud el cumpleaños, genero, peso, altura, nivel de actividad y objetivo con respecto al peso\n' +
      '\nEn caso de exito retorna un mensaje y los datos del perfil creado',
  })
  @ApiBody({
    type: CreateUserProfileDto,
    examples: {
      PerfilMasculino: {
        value: {
          birthdate: '1995-11-09',
          gender: Gender.MALE,
          weight: 71.2,
          height: 1.71,
          activityLevel: ActivityLevel.MODERATE,
          weightGoal: Goal.GAIN_MUSCLE,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Se creó exitosamente un perfil para el usuario indicado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario indicado no existe',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El usuario ya tiene un perfil creado',
  })
  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createUserProfileDto: CreateUserProfileDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.userProfilesService.create(createUserProfileDto, req.user.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve el perfil de un usuario',
    description:
      'Requiere autenticación\n' +
      '\nDevuelve el perfil asociado al usuario autenticado\n' +
      '\nEn caso de exito retorna un mensaje y los datos del perfil',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se obtuvo con exito el perfil del usuario autenticado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'El usuario no existe o no tiene un perfil de usuario asociado',
  })
  @Get()
  @UseGuards(AuthGuard)
  findOneByUser(@Req() req: { user: { sub: string } }) {
    return this.userProfilesService.findOneByUserId(req.user.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualiza un perfil de usuario',
    description:
      'Requiere autenticación\n' +
      '\nEl usuario autenticado sólo puede actualizar el perfil de usuario que le pertenece\n' +
      '\nSe tiene que enviar por el cuerpo de la petición los datos que se desean modificar\n' +
      '\nEn caso de exito retorna un mensaje y los datos del perfil modificados',
  })
  @ApiBody({
    type: UpdateUserProfileDto,
    examples: {
      actualizaciónPeso: {
        value: {
          weight: 60.23,
        },
      },
      actualizaciónAltura: {
        value: {
          height: 1.82,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se actualizó el perfil del usuario exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario no existe o no tiene un perfil asociado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'No se logró realizar la actualización, datos inexistentes o sin cambios',
  })
  @Patch()
  @UseGuards(AuthGuard)
  update(
    @Req() req: { user: { sub: string } },
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfilesService.update(req.user.sub, updateUserProfileDto);
  }
}
