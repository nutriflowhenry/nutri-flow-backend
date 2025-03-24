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
    name: 'Tags',
    default: Tag.QUICK,
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'SearchOnTitle',
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

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async update(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.postService.update(postId, req.user.sub, updatePostDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('approve/:id')
  async approve(@Param('id', ParseUUIDPipe) postId: string) {
    return this.postService.approve(postId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('ban/:id')
  async ban(@Param('id', ParseUUIDPipe) postId: string) {
    return this.postService.ban(postId);
  }
}
