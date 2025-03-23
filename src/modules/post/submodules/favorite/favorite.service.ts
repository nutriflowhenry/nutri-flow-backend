import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { PostService } from '../../post.service';
import { FavoriteRepository } from './favorite.repository';
import { PostFavorite } from './entities/post-favorite.entity';
import { PublicFavoriteDto } from './dto/public-favorite.dto';
import { plainToInstance } from 'class-transformer';
import { GetFavoritePosttDto } from './dto/get-favorite-post.dto';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly userService: UsersService,
    private readonly postService: PostService,
    private readonly favoriteRepository: FavoriteRepository,
  ) {}
  async create(postId: string, userId: string) {
    const [foundPost, foundUser] = await Promise.all([
      this.postService.findOneApproved(postId),
      this.userService.findById(userId),
    ]);

    if (!foundPost) {
      throw new NotFoundException('El post indicado no existe');
    }
    if (!foundUser) {
      throw new NotFoundException('El usuario indicado no existe');
    }

    let activeFavorite: PostFavorite;

    const existingFavorite: PostFavorite =
      await this.favoriteRepository.findOneByUserAndPost(
        foundPost.id,
        foundUser.id,
      );

    if (existingFavorite?.isActive) {
      throw new ConflictException(
        'El Post ya está guardado como favorito para el usuario indicado',
      );
    } else if (existingFavorite?.isActive === false) {
      activeFavorite = await this.favoriteRepository.activate(
        existingFavorite.id,
      );
    } else if (!existingFavorite) {
      activeFavorite = await this.favoriteRepository.create(
        foundPost,
        foundUser,
      );
    }

    const favorite: PublicFavoriteDto = plainToInstance(
      PublicFavoriteDto,
      activeFavorite,
    );
    return {
      message: `Post con el id ${postId} guardado como favorito para el usuario con id ${userId}`,
      favorite,
    };
  }

  async findAllByUser(paginationData: GetFavoritePosttDto, userId: string) {
    const [favoritesFound, favoritesCount] =
      await this.favoriteRepository.findAllByUser(userId, paginationData);
    const favorites: PublicFavoriteDto[] = favoritesFound.map((favorite) => {
      if (favorite.post) {
        return plainToInstance(PublicFavoriteDto, favorite, {
          groups: ['active'],
        });
      }
      return plainToInstance(PublicFavoriteDto, favorite, {
        groups: ['inactive'],
      });
    });

    const totalPages: number = Math.ceil(favoritesCount / paginationData.limit);
    return {
      message: `Se obtuvieron exitosamente los Post favoritos del usuario ${userId}`,
      favorites,
      pagination: {
        currentPage: paginationData.page,
        limit: paginationData.limit,
        favoritesCount,
        totalPages,
      },
    };
  }

  async softDelete(favoriteId: string, userId: string) {
    const foundFavorite: PostFavorite | null =
      await this.favoriteRepository.findValidatedToDeleteUpdate(
        favoriteId,
        userId,
      );
    if (!foundFavorite) {
      throw new BadRequestException(
        'El favorito indicado no existe o no se tienen los permisos para borrarlo',
      );
    }

    await this.favoriteRepository.softDelete(foundFavorite.id);
    return {
      message: `El favorito con id ${favoriteId} se desactivo con exito`,
    };
  }
}
