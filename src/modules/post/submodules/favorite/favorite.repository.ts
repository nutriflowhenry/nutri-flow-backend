import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostFavorite } from './entities/post-favorite.entity';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { PostStatus } from '../../enums/post-status.enum';
import { GetFavoritePosttDto } from './dto/get-favorite-post.dto';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectRepository(PostFavorite)
    private readonly postFavoriteRepository: Repository<PostFavorite>,
  ) {}

  async create(post: Post, user: User): Promise<PostFavorite> {
    return this.postFavoriteRepository.save({ post, user });
  }

  async findOneByUserAndPost(
    postId: string,
    userId: string,
  ): Promise<PostFavorite | null> {
    return this.postFavoriteRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
  }

  async findValidatedToDeleteUpdate(
    favoriteId: string,
    userId: string,
  ): Promise<PostFavorite | null> {
    return this.postFavoriteRepository.findOne({
      where: {
        id: favoriteId,
        isActive: true,
        user: { id: userId },
      },
    });
  }

  async findAllByUser(userId: string, paginationData: GetFavoritePosttDto) {
    const { limit, page } = paginationData;
    const skip: number = (page - 1) * limit;
    return this.postFavoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.post', 'post', 'post.status = :status', {
        status: PostStatus.APPROVED,
      })
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('favorite.user', 'user')
      .select([
        'favorite',
        'user.id',
        'post.id',
        'post.title',
        'post.status',
        'author.id',
        'author.name',
        'author.profilePicture',
      ])
      .where('user.id = :id', { id: userId })
      .andWhere('favorite.isActive = :isActive', { isActive: true })
      .orderBy('favorite.createdAt', 'DESC')
      .addOrderBy('favorite.id', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
  }

  async activate(favoriteId: string): Promise<PostFavorite> {
    await this.postFavoriteRepository.update(favoriteId, { isActive: true });
    return this.postFavoriteRepository.findOne({ where: { id: favoriteId } });
  }

  async softDelete(favoriteId: string) {
    await this.postFavoriteRepository.update(favoriteId, { isActive: false });
  }
}
