import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReaction } from './entities/post-reaction.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { PostModule } from '../../post.module';
import { PostReactionRepository } from './reaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostReaction]), UsersModule, PostModule],
  controllers: [ReactionController],
  providers: [ReactionService, PostReactionRepository],
})
export class ReactionModule {}
