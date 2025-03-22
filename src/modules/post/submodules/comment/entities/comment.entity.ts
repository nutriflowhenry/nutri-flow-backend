import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Post } from '../../../entities/post.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  content: string;

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
