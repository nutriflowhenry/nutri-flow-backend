import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from './dto/public-user.dto';
import { User } from './entities/user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { S3Service } from '../aws/s3-service';
import { CloudFrontService } from '../aws/cloud-front.service';
import axios from 'axios';
import { TimeZoneService } from '../notifications/time-zone.service';
import { CreateUserReviewDto } from './submodules/user-review/dto/create-user-review.dto';
import { UserReview } from './submodules/user-review/entities/user-review.entity';
import { UsersReviewRepository } from './submodules/user-review/user-review.repository';
import { GetUserReviewsDto } from './submodules/user-review/dto/get-user-review.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly cloudFrontService: CloudFrontService,
    private readonly usersRepository: UsersRepository,
    private readonly timeZoneService: TimeZoneService,
    private readonly s3Service: S3Service,
    private readonly userReviewRepository: UsersReviewRepository,
  ) {}

  async createAdmin(adminData: CreateAdminDto): Promise<void> {
    return this.usersRepository.createAdmin(adminData);
  }

  async findAll(): Promise<PublicUserDto[]> {
    let users = await this.usersRepository.findAll();

    users.map(async (user) => ({
      ...user,
      profilePicture: await this.cloudFrontService.generateSignedUrl(
        user.profilePicture,
      ),
    }));

    return plainToInstance(PublicUserDto, users);
  }

  async findAllUsersWithNotificationsEnabled(): Promise<User[]> {
    return this.usersRepository.findAllWithNotificationsEnabled();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findOne(id: string): Promise<PublicUserDto> {
    const user = await this.findById(id);

    if (user?.profilePicture) {
      user.profilePicture = await this.cloudFrontService.generateSignedUrl(
        user.profilePicture,
      );
    }

    return plainToInstance(PublicUserDto, user);
  }

  async update(id: string, updateData: UpdateUserDto): Promise<PublicUserDto> {
    await this.findById(id);

    if (updateData?.country && updateData?.city) {
      updateData.timeZone = this.timeZoneService.getTimeZone(
        updateData.country,
        updateData.city,
      );
    }

    const updatedUser = await this.usersRepository.update(id, updateData);
    return plainToInstance(PublicUserDto, updatedUser);
  }

  async deactivateAccount(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user.isActive)
      throw new ConflictException(`User with ID ${id} is already deactivated`);

    await this.usersRepository.deactivateUser(id);
  }

  async banUser(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user.isActive)
      throw new ConflictException(`User with ID ${id} is already deactivated`);

    await this.usersRepository.banUser(id);
  }

  async unbanUser(id: string): Promise<void> {
    const user = await this.findById(id);
    if (user.isActive)
      throw new ConflictException(`User with ID ${id} is active`);

    await this.usersRepository.unbanUser(id);
  }

  async checkIfAdminExists(): Promise<boolean> {
    return this.usersRepository.checkIfAdminExists();
  }

  async getImageUploadUrl(userId: string, fileType: string): Promise<string> {
    return this.s3Service.generateUploadUrl(userId, 'profile', fileType);
  }

  async updateProfilePicture(userId: string, fileType: string): Promise<void> {
    const filePath = `profile-pictures/${userId}.${fileType}`;
    await this.update(userId, { profilePicture: filePath });
  }

  async uploadGoogleProfilePicture(
    userId: string,
    googleImageUrl: string,
  ): Promise<string> {
    try {
      const response = await axios.get(googleImageUrl, {
        responseType: 'arraybuffer',
      });
      const imageBuffer = Buffer.from(response.data);
      const fileType = 'jpg';
      const filePath = `profile-pictures/${userId}.${fileType}`;

      await this.s3Service.uploadFile(
        filePath,
        imageBuffer,
        `image/${fileType}`,
      );

      await this.update(userId, { profilePicture: filePath });
      return filePath;
    } catch (error) {
      console.error('Failed to upload Google profile picture:', error);
      return null;
    }
  }

  async findByStripeId(stripeId: string): Promise<User> {
    const user: User = await this.usersRepository.findByStripeId(stripeId);
    if (!user)
      throw new NotFoundException(
        `El usuario buscado no tiene una cuenta en Stripe`,
      );
    return user;
  }

  async addStripeId(stripeId: string, userId: string): Promise<User> {
    return this.usersRepository.addStripeId(stripeId, userId);
  }

  async updateSubscriptionType(userId: string): Promise<void> {
    return this.usersRepository.updateSubscriptionType(userId);
  }

  async downgradeSubscriptionType(userId: string): Promise<void> {
    return this.usersRepository.downgradeSubscriptionType(userId);
  }

  async createReview(userId: string, reviewData: CreateUserReviewDto) {
    const [foundUser, foundReview] = await Promise.all([
      this.findById(userId),
      this.userReviewRepository.findOneByUserId(userId),
    ]);
    if (!foundUser)
      throw new NotFoundException(`User with id ${userId} not found`);
    if (foundReview)
      throw new ConflictException('El usuario logueado ya ha hecho una review');

    const newReview: UserReview = await this.userReviewRepository.create(
      foundUser,
      reviewData,
    );

    const { user, ...sanitizedReview } = newReview;
    sanitizedReview;

    return {
      message: `Opinión creada con éxito para el usuario con id ${foundUser.id}`,
      review: sanitizedReview,
    };
  }

  async findAllreviews(paginationData: GetUserReviewsDto) {
    const [reviews, countReviews] =
      await this.userReviewRepository.findAllReviews(paginationData);
    return {
      message: `Registros de reviews obtenidos con éxito considerando estar en la página ${paginationData.page} con ${paginationData.limit} registros por cada página`,
      data: {
        results: reviews,
        total: countReviews,
        page: paginationData.page,
        limit: paginationData.limit,
        totalPages: Math.ceil(countReviews / paginationData.limit),
      },
    };
  }
}
