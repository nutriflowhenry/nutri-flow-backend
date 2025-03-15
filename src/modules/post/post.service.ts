import {
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
    return {
      message: 'Post creado exitosamente con status pendiente',
      newPost,
    };
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(postId: string, userId: string, updatePostDto: UpdatePostDto) {
    const existingPost: Post | null = await this.postRepository.get(postId);
    if (!existingPost) {
      throw new NotFoundException(`El post con id ${postId} no existe`);
    }
    const isUserAuthor: boolean = existingPost.author.id === userId;
    if (!isUserAuthor) {
      throw new ForbiddenException('No eres el autor de este post');
    }
    await this.postRepository.update(existingPost, updatePostDto);
    const updatedPost: Post = await this.postRepository.get(postId);
    return {
      message: `El post con id ${updatedPost.id} se actualizó correctamente`,
      updatePostDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
