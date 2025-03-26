import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Req,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('post')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crea una reacción para el Post indicado',
    description:
      'Requiere autenticación\n' +
      '\nSe tiene que enviar por parametro el id del Post al cual se desea añadir la reacción\n' +
      '\nEn caso de exito retorna un mensaje y los datos de la reacción creada',
  })
  @ApiParam({
    name: 'postId',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Se creo y añadio con exito la reacción al Post indicado',
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
  @Post(':postId/reaction')
  create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.reactionService.create(postId, req.user.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve todos las reacciones de un usuario',
    description:
      'Requiere autenticación\n' +
      '\nUn usuario sólo puede obtener sus propias reacciones\n' +
      '\nEn caso de exito retorna un mensaje y todas las reacciones del usuario autenticado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se obtuvieron con exito las reacciones del usuario indicado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario o el Post indicados no existen',
  })
  @UseGuards(AuthGuard)
  @Get('reaction/me')
  findAllByUser(@Req() req: { user: { sub: string } }) {
    return this.reactionService.findAllByUser(req.user.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Permite a un usuario desactivar una de sus reacciones',
    description:
      'Requiere autenticación\n' +
      'Cada usuario sólo puede desactivar sus propias reacciones\n' +
      '\nSe tiene que enviar por el parámetro de la ruta el id de la reacción a desactivar\n' +
      '\nEn caso de exito retorna un mensaje de exito indicando que la operación se realizó correctamente',
  })
  @ApiParam({
    name: 'reactionId',
    type: String,
    description: 'ID único de la reacción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'La reacción se desactivo correctamente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'La publicación o el usuario no existen',
  })
  @UseGuards(AuthGuard)
  @Patch('reaction/:reactionId/me/delete')
  softDelete(
    @Req() req: { user: { sub: string } },
    @Param('reactionId') reactionId: string,
  ) {
    return this.reactionService.sofDelete(reactionId, req.user.sub);
  }
}
