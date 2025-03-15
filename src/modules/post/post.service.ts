import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/post/create-post.dto';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PostRepository } from './post.repository';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UsersService,
    private readonly postRepository: PostRepository,
  ) {}
  async createPost(userId: string, createPostDto: CreatePostDto) {
    const user: User = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const newPost: Post = await this.postRepository.create(user, createPostDto);
    const { author, ...sanitizedPost } = newPost;
    return {
      message: 'Post creado exitosamente con status pendiente',
      sanitizedPost,
    };
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(postId: string, userId: string, updatePostData: UpdatePostDto) {
    const updateData: string[] = Object.keys(updatePostData);
    if (updateData.length === 0) {
      throw new BadRequestException(
        'No se proporcionaron datos para realizar una actualización',
      );
    }
    const existingPost: Post | null = await this.postRepository.get(postId);
    if (!existingPost) {
      throw new NotFoundException(`El post con id ${postId} no existe`);
    }
    const isUserAuthor: boolean = existingPost.author.id === userId;
    if (!isUserAuthor) {
      throw new ForbiddenException(
        'Usuario no autorizado para modificar este post',
      );
    }
    const updatedPost: Post = await this.postRepository.update(
      existingPost,
      updatePostData,
    );
    return {
      message: `El post con id ${updatedPost.id} se actualizó correctamente`,
      updatedPost,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
