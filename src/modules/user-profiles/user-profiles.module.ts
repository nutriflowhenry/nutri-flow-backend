import { Module } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfile } from './entities/user-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersProfileRepository } from './user-profile.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile]), UsersModule],
  controllers: [UserProfilesController],
  providers: [UserProfilesService, UsersProfileRepository],
  exports: [UserProfilesService],
})
export class UserProfilesModule {}
