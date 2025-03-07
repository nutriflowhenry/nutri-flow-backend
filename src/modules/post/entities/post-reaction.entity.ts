import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { PostReactionType } from '../enums/post-reaction.enum';

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
