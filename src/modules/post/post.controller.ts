import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Query,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/post/create-post.dto';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { GetPostDto } from './dto/post/get-post.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { title } from 'process';
import { Tag } from './enums/tag.enum';
import { PostStatus } from './enums/post-status.enum';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crea una nueva publicación en el Blog',
    description:
      'Requiere autenticación\n' +
      '\nSe tiene que enviar en el cuerpo de la solicitud un título y el contenido de la publicación, opcionalmente se pueden enviar etiquetas (tags) \n' +
      '\nEn caso de exito retorna un mensaje y los datos de la publicación creada',
  })
  @ApiBody({
    type: CreatePostDto,
    examples: {
      RegistroBásico: {
        value: {
          title: 'Carne asada al carbón',
          content: 'Ingredientes...',
        },
      },
      RegistroConTags: {
        value: {
          title: 'Carne asada al carbón',
          content: 'Ingredientes...',
          tags: [Tag.HIGHINPROTEIN],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Se creó con exito el nuevo post',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario no existe',
  })
  @UseGuards(AuthGuard)
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.postService.createPost(req.user.sub, createPostDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve todos los Post',
    description:
      'Requiere autenticación\n' +
      'Sólo puede ser usado por un usuario administrador\n' +
      '\nSe puede enviar por parametros de consulta los datos de paginación, limit y page, así como datos de clasificación, status y tags\n' +
      '\nEn caso de exito retorna un mensaje y los datos de los post indicados',
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
  @ApiQuery({
    type: String,
    name: 'status',
    default: PostStatus.APPROVED,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se obtuvieron con exito los Post indicados',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario no existe',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('all')
  async getAll(@Query() getPostData: GetPostDto) {
    return this.postService.getAll(getPostData);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve todos los Post activos',
    description:
      'Requiere autenticación\n' +
      'Permite obtener los Post que deben ser visibles a los usuarios\n' +
      '\nSe puede enviar por parametros de consulta los datos de paginación, limit y page, así como datos de clasificación, status y tags, además de searchOnTitle para buscar texto en el título\n' +
      '\nEn caso de exito retorna un mensaje y los datos de los post activos indicados',
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
  @ApiQuery({
    type: String,
    name: 'status',
    default: PostStatus.APPROVED,
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'tags',
    default: Tag.QUICK,
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'searchOnTitle',
    required: false,
    example: 'Carnitas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se obtuvieron con exito los Post indicados',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario no existe',
  })
  @UseGuards(AuthGuard)
  @Get('allActive')
  async getAllActive(@Query() getPostData: GetPostDto) {
    return this.postService.getAllActive(getPostData);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualiza una publicación del foro',
    description:
      'Requiere autenticación\n' +
      '\nEl usuario autenticado sólo puede actualizar las publicaciones que le pertenecen\n' +
      '\nSe tiene que enviar por el cuerpo de la petición los datos que se desean modificar\n' +
      '\nEn caso de exito retorna un mensaje y los datos de la publicación modificados',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdatePostDto,
    examples: {
      actualizaciónTítulo: {
        value: {
          title: 'Nuevo título',
        },
      },
      actualizaciónContenido: {
        value: {
          content: 'Nuevo contenido...',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se actualizó la publicación exitosamente',
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
  @Patch('update/:id')
  async update(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.postService.update(postId, req.user.sub, updatePostDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Activa una publicación del foro previamente baneada',
    description:
      'Requiere autenticación\n' +
      'Unicamente puede ser usado por un usuario administrador\n' +
      '\nSe tiene que enviar por el parámetro de la ruta el id de la publicación que se desea activar\n' +
      '\nEn caso de exito retorna un mensaje de exito indicando que la operación se realizó correctamente',
  })
  @ApiParam({
    name: 'postId',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'La publicación se activo correctamente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'La publicación no existe',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'La publicación ya está activa',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('activate/:postId')
  async activate(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.postService.activate(postId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Banea una publicación del foro',
    description:
      'Requiere autenticación\n' +
      'Unicamente puede ser usado por un usuario administrador\n' +
      '\nSe tiene que enviar por el parámetro de la ruta el id de la publicación a banear\n' +
      '\nEn caso de exito retorna un mensaje de exito indicando que la operación se realizó correctamente',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'La publicación se baneo correctamente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'La publicación no existe',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('ban/:id')
  async ban(@Param('id', ParseUUIDPipe) postId: string) {
    return this.postService.ban(postId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Desactiva una publicación del foro',
    description:
      'Requiere autenticación\n' +
      'Permite desactivar un post perteneciente al usuario logueado \n' +
      '\nSe tiene que enviar por el parámetro de la ruta el id de la publicación a desactivar\n' +
      '\nEn caso de exito retorna un mensaje de exito indicando que la operación se realizó correctamente',
  })
  @ApiParam({
    name: 'postId',
    type: String,
    description: 'ID único de la publicación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'La publicación se desactivo correctamente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'La publicación no existe o ya está desactivada',
  })
  @UseGuards(AuthGuard)
  @Patch('deactivate/:postId')
  async deactivate(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.postService.deactivate(postId, req.user.sub);
  }

  @Put(':postId/image')
  @UseGuards(AuthGuard)
  async updateImage(
    @Req() req: { user: { sub: string } },
    @Param('postId') postId: string,
    @Body('fileType') fileType: string,
  ): Promise<object> {
    await this.postService.updatePostImage(postId, req.user.sub, fileType);
    return { message: 'Post image updated successfully' };
  }
}
