import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-commnet.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { Post } from '../entities/post.entity';

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
    postId: string,
    commentId: string,
    userId: string,
  ): Promise<Comment | null> {
    return this.postCommentRepository.findOne({
      where: { id: commentId, author: { id: userId }, post: { id: postId } },
    });
  }

  findAllByPost(
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

  async delete(commentId: string) {
    console.log(commentId);
    await this.postCommentRepository.delete(commentId);
  }
}
