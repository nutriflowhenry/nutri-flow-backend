import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostReaction } from './entities/post-reaction.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { PostReactionType } from '../../enums/post-reaction.enum';

@Injectable()
export class PostReactionRepository {
  constructor(
    @InjectRepository(PostReaction)
    private readonly postReactionRepository: Repository<PostReaction>,
  ) {}

  async create(post: Post, user: User): Promise<PostReaction> {
    const reaction: PostReaction = this.postReactionRepository.create({
      type: PostReactionType.LIKE,
      post,
      user,
    });
    return this.postReactionRepository.save(reaction);
  }

  async findById(id: string): Promise<PostReaction> {
    return this.postReactionRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByPostAndUser(
    postId: string,
    userId: string,
  ): Promise<PostReaction | null> {
    return this.postReactionRepository.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });
  }

  async findAllByUser(userId: string): Promise<PostReaction[] | []> {
    return this.postReactionRepository.find({
      where: {
        user: { id: userId },
        isActive: true,
      },
      relations: {
        post: {
          author: true,
        },
        user: true,
      },
    });
  }

  async softDelete(id: string): Promise<UpdateResult> {
    const updateResult = await this.postReactionRepository.update(id, {
      isActive: false,
    });
    return updateResult;
  }

  async active(id: string): Promise<UpdateResult> {
    const updateResult = await this.postReactionRepository.update(id, {
      isActive: true,
    });
    return updateResult;
  }
}
