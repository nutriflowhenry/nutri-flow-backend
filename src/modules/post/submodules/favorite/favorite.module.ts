import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostFavorite } from './entities/post-favorite.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { PostModule } from '../../post.module';
import { FavoriteRepository } from './favorite.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostFavorite]), UsersModule, PostModule],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
})
export class FavoriteModule {}
