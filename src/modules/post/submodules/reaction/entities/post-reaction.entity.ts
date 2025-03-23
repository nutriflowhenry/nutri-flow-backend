import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { PostReactionType } from 'src/modules/post/enums/post-reaction.enum';

@Entity()
@Unique(['user', 'post'])
export class PostReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PostReactionType,
    default: PostReactionType.LIKE,
  })
  type: PostReactionType;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Post, (post) => post.reactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: Post;
}
