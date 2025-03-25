import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Req,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-commnet.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { GetCommentDto } from './dto/get-comment.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/roles.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('post/:postId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crea un nuevo comentario para el Post indicado',
    description:
      'Requiere autenticación\n' +
      '\nSe tiene que enviar en el cuerpo de la solicitud el contenido del comentario\n' +
      '\nSe tiene que enviar por parametro el id del Post al cual se desea añadir el comentario\n' +
      '\nEn caso de exito retorna un mensaje y los datos del comentario creado',
  })
  @ApiParam({
    name: 'postId',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: CreateCommentDto,
    examples: {
      Comentario: {
        value: {
          content: 'Muy buena receta, gracias por compartir',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Se creó con exito el comentario',
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
  @Post()
  async createComment(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createCommentData: CreateCommentDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.commentService.create(postId, req.user.sub, createCommentData);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve todos los comentarios de un Post',
    description:
      'Requiere autenticación\n' +
      '\nSe puede enviar por parametros de consulta los datos de paginación, limit y page, si no se envían se toman sus valores por defecto 10 y 1 respectivamente\n' +
      '\nEn caso de exito retorna un mensaje y los comentarios paginados',
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
    description: 'Se obtuvieron con exito los comentarios del Post indicado',
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
  @Get()
  async findAllbyPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() paginationData: GetCommentDto,
  ) {
    return this.commentService.findAllByPost(postId, paginationData);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualiza un comentario',
    description:
      'Requiere autenticación\n' +
      '\nEl usuario autenticado sólo puede actualizar los comentarios que le pertenecen\n' +
      '\nSe tiene que enviar por parametro el id del Post al cual pertenece el comentario\n' +
      '\nSe tiene que enviar por parametro el id del comentario que se desea modificar\n' +
      '\nSe tiene que enviar por el cuerpo de la petición los datos que se desean modificar\n' +
      '\nEn caso de exito retorna un mensaje y los datos del comentario modificado',
  })
  @ApiParam({
    name: 'postId',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'commentId',
    type: String,
    description: 'ID único del comentario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateCommentDto,
    examples: {
      actualizaciónContenido: {
        value: {
          content: 'Nuevo comentario',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se actualizó el comentario exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'El usuario o la publicación no existen o no se tienen los permisos necesarios',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'No se logró realizar la actualización, datos inexistentes o sin cambios',
  })
  @UseGuards(AuthGuard)
  @Patch(':commentId')
  async update(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() updateCommentData: UpdateCommentDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.commentService.update(
      postId,
      commentId,
      req.user.sub,
      updateCommentData,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Permite a un usuario eliminar alguno de sus comentarios',
    description:
      'Requiere autenticación\n' +
      '\nEl usuario sólo puede borrar sus propios comentarios\n' +
      '\nSe tiene que enviar por parametro el id del Post al cual pertenece el comentario\n' +
      '\nSe tiene que enviar por parametro el id del comentario que se desea eliminar\n' +
      '\nEn caso de exito retorna un mensaje indicando el exito al eliminar el comentario',
  })
  @ApiParam({
    name: 'postId',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'commentId',
    type: String,
    description: 'ID único del comentario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se eliminó correctamente el comentario',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario, el Post o el comentario no existen',
  })
  @UseGuards(AuthGuard)
  @Delete('my/:commentId')
  async remove(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.commentService.remove(postId, commentId, req.user.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Permite a un usuario administrador eliminar un comentario',
    description:
      'Requiere autenticación\n' +
      '\nSólo puede ser usado por un usuario con rol de admnistrador\n' +
      '\nSe tiene que enviar por parametro el id del Post al cual pertenece el comentario\n' +
      '\nSe tiene que enviar por parametro el id del comentario que se desea eliminar\n' +
      '\nEn caso de exito retorna un mensaje indicando el exito al eliminar el comentario',
  })
  @ApiParam({
    name: 'postId',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'commentId',
    type: String,
    description: 'ID único del comentario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se eliminó correctamente el comentario',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario, el Post o el comentario no existen',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':commentId')
  async removeByAdmin(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.commentService.removeByAdmin(postId, commentId);
  }
}
