import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 2048,
  })
  url: string;

  @Column({
    type: 'int',
    default: 1,
  })
  order: number;

  @ManyToOne(() => Post, (post) => post.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: Post;
}
