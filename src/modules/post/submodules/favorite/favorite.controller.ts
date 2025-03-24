import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { GetFavoritePosttDto } from './dto/get-favorite-post.dto';
import { GroupSerializerInterceptor } from './interceptor/groups-serializer.interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('post')
@UseInterceptors(GroupSerializerInterceptor)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Guarda un Post como favorito para un usuario',
    description:
      'Requiere autenticación\n' +
      '\nSe tiene que enviar por parametro el id del Post el cual se desea guardar como favorito\n' +
      '\nEn caso de exito retorna un mensaje y los datos del favorito creado',
  })
  @ApiParam({
    name: 'postId',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Se guardó con exito el Post indicado como favorito para el usuario autenticado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario o el Post no existen',
  })
  @UseGuards(AuthGuard)
  @Post(':postId/favorite')
  create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.favoriteService.create(postId, req.user.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve todos los favoritos de un usuario',
    description:
      'Requiere autenticación\n' +
      '\nSe puede enviar por parametros de consulta los datos de paginación, limit y page, si no se envían se toman sus valores por defecto 10 y 1 respectivamente\n' +
      '\nEn caso de exito retorna un mensaje y los favoritos de acuerdo a los datos de paginación',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    default: 10,
    required: false,
  })
  @ApiQuery({
    type: Number,
    name: 'page',
    default: 1,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se obtuvieron con exito los favoritos del usuario indicado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario indicado no existe',
  })
  @UseGuards(AuthGuard)
  @Get('favorites/me')
  findAllByUser(
    @Query() paginationData: GetFavoritePosttDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.favoriteService.findAllByUser(paginationData, req.user.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Desactiva el favorito indicado',
    description:
      'Requiere autenticación\n' +
      'El usuario sólo puede desactivar los favoritos que le pertenecen\n' +
      '\nSe tiene que enviar por el parámetro de la ruta el id del favorito a desactivar\n' +
      '\nEn caso de exito retorna un mensaje de exito indicando que la operación se realizó correctamente',
  })
  @ApiParam({
    name: 'favoriteId',
    type: String,
    description: 'ID único del favorito',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El favorito indicado se desactivo con exito',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El favorito indicado no existe',
  })
  @UseGuards(AuthGuard)
  @Patch('favorite/:favoriteId')
  softDelete(
    @Param('favoriteId', ParseUUIDPipe) favoriteId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.favoriteService.softDelete(favoriteId, req.user.sub);
  }
}
