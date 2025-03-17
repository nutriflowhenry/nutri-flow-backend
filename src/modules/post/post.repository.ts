import { Injectable, Search } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QueryBuilder,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/post/create-post.dto';
import { User } from '../users/entities/user.entity';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { PostStatus } from './enums/post-status.enum';
import { GetPostDto } from './dto/post/get-post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(author: User, postData: CreatePostDto): Promise<Post> {
    return await this.postRepository.save({ ...postData, author });
  }

  async findOneById(postId: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id: postId },
    });
  }

  async findOneActive(postId: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id: postId, status: PostStatus.APPROVED },
    });
  }

  async findAllActive(
    status: PostStatus,
    getPostData: GetPostDto,
  ): Promise<[Post[], number]> {
    const { limit, page, searchOnTitle, tags } = getPostData;
    const skip: number = (page - 1) * limit;
    console.log(limit);
    console.log(page);
    console.log('####');
    console.log(skip);
    const postQueryBuilder: SelectQueryBuilder<Post> =
      this.postRepository.createQueryBuilder('post');
    postQueryBuilder.where('post.status = :status', { status });
    if (tags?.length > 0) {
      postQueryBuilder.andWhere('post.tags IN (:...tags)', { tags });
    }
    if (searchOnTitle) {
      postQueryBuilder.andWhere('post.title LIKE :search', {
        search: `%${searchOnTitle}%`,
      });
    }
    return postQueryBuilder
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'ASC')
      .skip(skip)
      .limit(limit)
      .getManyAndCount();
  }

  async findByAuthorAndId(
    postId: string,
    authorId: string,
  ): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id: postId, author: { id: authorId } },
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

  async approve(id: string): Promise<Post> {
    await this.postRepository.update(id, { status: PostStatus.APPROVED });
    return this.findOneActive(id);
  }
}
