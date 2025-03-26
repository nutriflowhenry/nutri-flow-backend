import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-commnet.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { Post } from '../../entities/post.entity';
import { PostStatus } from '../../enums/post-status.enum';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly postCommentRepository: Repository<Comment>,
  ) {}

  async create(
    post: Post,
    author: User,
    createCommentData: CreateCommentDto,
  ): Promise<Comment> {
    return this.postCommentRepository.save({
      ...createCommentData,
      post,
      author,
    });
  }

  async findVerified(
    commentId: string,
    userId: string,
  ): Promise<Comment | null> {
    return this.postCommentRepository.findOne({
      where: {
        id: commentId,
        isActive: true,
        author: { id: userId },
      },
    });
  }

  async findByIdAndPost(
    postId: string,
    commentId: string,
  ): Promise<Comment | null> {
    return this.postCommentRepository.findOne({
      where: {
        id: commentId,
        post: { id: postId },
      },
    });
  }

  async findAllByPost(
    postId: string,
    page: number,
    limit: number,
  ): Promise<[Comment[], number]> {
    const skip: number = (page - 1) * limit;
    return this.postCommentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .select('comment')
      .where('post.id = :id', { id: postId })
      .andWhere('comment.isActive = :isActive', { isActive: true })
      .andWhere('post.status = :status', { status: PostStatus.APPROVED })
      .orderBy('comment.createdAt', 'DESC')
      .addOrderBy('comment.id', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
  }

  async update(
    foundComment: Comment,
    updateCommentData: UpdateCommentDto,
  ): Promise<Comment> {
    this.postCommentRepository.merge(foundComment, updateCommentData);
    return this.postCommentRepository.save(foundComment);
  }

  async inactive(id: string): Promise<UpdateResult> {
    const updateResult: UpdateResult = await this.postCommentRepository.update(
      id,
      { isActive: false },
    );
    return updateResult;
  }

  async delete(commentId: string) {
    await this.postCommentRepository.delete(commentId);
  }
}
