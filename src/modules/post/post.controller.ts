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
  ApiResponse,
} from '@nestjs/swagger';
import { title } from 'process';
import { Tag } from './enums/tag.enum';

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
          content: `Ingredientes
          1.5 kg de carne de res para asar (puede ser falda, arrachera o filete de res)
          4 dientes de ajo picados
          ...
          Instrucciones
          Preparar la marinada:
          En un tazón grande, mezcla el jugo de naranja, jugo de limón, aceite de oliva, salsa de soja, ajo picado, comino, orégano, sal y pimienta. Revuelve bien para integrar todos los sabores.
          ...
          `,
        },
      },
      RegistroConTags: {
        value: {
          title: 'Carne asada al carbón',
          content: `Ingredientes
          1.5 kg de carne de res para asar (puede ser falda, arrachera o filete de res)
          4 dientes de ajo picados
          ...
          Instrucciones
          Preparar la marinada:
          En un tazón grande, mezcla el jugo de naranja, jugo de limón, aceite de oliva, salsa de soja, ajo picado, comino, orégano, sal y pimienta. Revuelve bien para integrar todos los sabores.
          ...
          `,
          tags: [Tag.HIGHINPROTEIN],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Se creó con exito el registro de consumo de comida',
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('all')
  async getAll(@Query() getPostData: GetPostDto) {
    return this.postService.getAll(getPostData);
  }

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
