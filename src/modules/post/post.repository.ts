import { Injectable, Search } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Not,
  QueryBuilder,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
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

  async findOneApproved(postId: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id: postId, status: PostStatus.APPROVED },
    });
  }

  async findAll(getPostData: GetPostDto): Promise<[Post[], number]> {
    const { limit, page, searchOnTitle, tags, status } = getPostData;
    const skip: number = (page - 1) * limit;
    const postQueryBuilder: SelectQueryBuilder<Post> =
      this.postRepository.createQueryBuilder('post');
    if (status) {
      postQueryBuilder.where('post.status = :status', { status });
    }
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
      .take(limit)
      .getManyAndCount();
  }

  async findByAuthorAndId(
    postId: string,
    authorId: string,
  ): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: {
        id: postId,
        author: { id: authorId },
        status: Not(PostStatus.INACTIVE),
      },
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
    return this.findOneApproved(id);
  }

  async findOneNotInactive(id: string): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id, status: Not(PostStatus.INACTIVE) },
    });
  }

  async ban(id: string): Promise<UpdateResult> {
    return this.postRepository.update(id, { status: PostStatus.INACTIVE });
  }
}
