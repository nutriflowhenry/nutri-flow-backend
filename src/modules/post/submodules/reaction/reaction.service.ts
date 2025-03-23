import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { PostService } from '../../post.service';
import { PostReaction } from './entities/post-reaction.entity';
import { PostReactionRepository } from './reaction.repository';
import { PublicPostReaction } from './dto/public-post-reaction.dto';
import { plainToInstance } from 'class-transformer';
import { measureMemory } from 'vm';
import { UpdateResult } from 'typeorm';

@Injectable()
export class ReactionService {
  constructor(
    private readonly userService: UsersService,
    private readonly postService: PostService,
    private readonly postReactionRepository: PostReactionRepository,
  ) {}
  async create(postId: string, userId: string) {
    const [foundPost, foundUser, foundReaction] = await Promise.all([
      this.postService.findOneApproved(postId),
      this.userService.findById(userId),
      this.postReactionRepository.findByPostAndUser(postId, userId),
    ]);

    if (!foundPost) {
      throw new NotFoundException('El post indicado no existe');
    }

    if (!foundUser) {
      throw new NotFoundException('El usuario indicado no existe');
    }

    if (foundReaction.isActive === true) {
      throw new ConflictException(
        'El usuario ya ha reaccionado al post indicado',
      );
    }

    let reaction: PostReaction;
    if (foundReaction.isActive === false) {
      const updateResult: UpdateResult =
        await this.postReactionRepository.active(foundReaction.id);
      if (updateResult.affected === 0)
        throw new BadRequestException(
          'No se pudieron aplicar los cambios indicados',
        );
      reaction = await this.postReactionRepository.findById(foundReaction.id);
    } else {
      reaction = await this.postReactionRepository.create(foundPost, foundUser);
    }

    const publicReaction: PublicPostReaction = plainToInstance(
      PublicPostReaction,
      reaction,
    );

    return {
      message: `Reacción al post ${postId} creada exitosamente`,
      publicReaction,
    };
  }

  async findAllByUser(userId: string) {
    const userReactions: PostReaction[] =
      await this.postReactionRepository.findAllByUser(userId);

    const publicReactions: PublicPostReaction[] = userReactions.map(
      (reaction) => {
        return plainToInstance(PublicPostReaction, reaction);
      },
    );
    return {
      message: `Se obtuvieron exitosamente las reacciones del usuario ${userId}`,
      reactions: publicReactions,
    };
  }

  async sofDelete(reactionId: string, userId: string) {
    const [foundUser, foundReaction] = await Promise.all([
      this.userService.findById(userId),
      this.postReactionRepository.findById(reactionId),
    ]);
    if (!foundUser) {
      throw new NotFoundException('No se econtró al usuario indicado');
    }
    if (!foundReaction) {
      throw new NotFoundException('No se encontró la reacción indicada');
    }

    if (foundReaction.isActive === false) {
      throw new NotFoundException('El registro ya se encuentra eliminado');
    }
    const updateResult = await this.postReactionRepository.softDelete(
      foundReaction.id,
    );
    if (updateResult.affected === 0) {
      throw new BadRequestException('No se pudieron aplicar los cambios');
    }

    return {
      message: `La reacción con el id${foundReaction.id} fue borrada con exito`,
    };
  }
}
