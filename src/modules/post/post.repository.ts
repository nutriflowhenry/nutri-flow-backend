import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/post/create-post.dto';
import { User } from '../users/entities/user.entity';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { PostStatus } from './enums/post-status.enum';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(author: User, postData: CreatePostDto): Promise<Post> {
    return await this.postRepository.save({ ...postData, author });
  }

  async get(postId: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });
  }

  async update(
    existingPost: Post,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    this.postRepository.merge(existingPost, updatePostDto);
    existingPost.status = PostStatus.PENDING;
    return this.postRepository.save(existingPost);
  }
}
