import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PostStatus } from '../enums/post-status.enum';
import { PostImage } from './post-image.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { PostFavorite } from '../submodules/favorite/entities/post-favorite.entity';
import { Tag } from '../enums/tag.enum';
import { Comment } from '../submodules/comment/entities/comment.entity';
import { PostReaction } from '../submodules/reaction/entities/post-reaction.entity';

@Entity({ name: 'posts' })
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 120 })
    title: string;

    @Column({ length: 5000 })
    content: string;

    @Column({
        type: 'enum',
        enum: Tag,
        array: true,
        default: [],
    })
    tags?: Tag[];

    @Column({
        type: 'enum',
        enum: PostStatus,
        default: PostStatus.PENDING,
    })
    status: PostStatus;

    @Column({ nullable: true })
    image: string;

    // @OneToMany(() => PostImage, (postImage) => postImage.post, {
    //   cascade: true,
    //   nullable: true,
    // })
    // images?: PostImage[];

    @OneToMany(() => Comment, (postComment) => postComment.post, {
        nullable: true,
    })
    comments?: Comment[];

    @OneToMany(() => PostReaction, (postReaction) => postReaction.post, {
        nullable: true,
    })
    reactions?: PostReaction[];

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @OneToMany(() => PostFavorite, (postFavorite) => postFavorite.post, {
        nullable: true,
    })
    favorites?: PostFavorite[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
