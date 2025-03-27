import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReview } from './entities/user-review.entity';
import { Repository } from 'typeorm';
import { CreateUserReviewDto } from './dto/create-user-review.dto';
import { GetUserReviewsDto } from './dto/get-user-review.dto';
import { User } from '../../entities/user.entity';
import { never } from 'rxjs';

@Injectable()
export class UsersReviewRepository {
  constructor(
    @InjectRepository(UserReview)
    private userReviewRepository: Repository<UserReview>,
  ) {}

  async create(
    user: User,
    reviewCreateData: CreateUserReviewDto,
  ): Promise<UserReview> {
    return this.userReviewRepository.save({
      user,
      content: reviewCreateData.content,
    });
  }

  async findOneByUserId(userId: string): Promise<UserReview | null> {
    return this.userReviewRepository.findOne({
      where: {
        user: { id: userId },
      },
    });
  }

  async findAllReviews(
    paginationData: GetUserReviewsDto,
  ): Promise<[UserReview[], number]> {
    const { limit, page } = paginationData;
    return this.userReviewRepository.findAndCount({
      relations: {
        user: true,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          email: true,
          isActive: true,
        },
      },
      order: {
        createdAt: 'DESC',
        id: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
