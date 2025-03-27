import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionType } from '../enums/subscription-type.enum';
import { UserProfile } from '../../user-profiles/entities/user-profile.entity';
import { AuthProvider } from '../enums/auth-provider.enum';
import { Role } from '../../auth/enums/roles.enum';
import { Payment } from '../../payments/entities/payment.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Comment } from 'src/modules/post/submodules/comment/entities/comment.entity';
import { PostFavorite } from 'src/modules/post/submodules/favorite/entities/post-favorite.entity';
import { PostReaction } from 'src/modules/post/submodules/reaction/entities/post-reaction.entity';
import { UserReview } from '../submodules/user-review/entities/user-review.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 40, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  auth0Id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  timeZone: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profilePicture: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  @JoinColumn({ name: 'userProfileId' })
  userProfile: UserProfile;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => PostReaction, (postReaction) => postReaction.user)
  reactions: PostReaction[];

  @OneToMany(() => PostFavorite, (favorite) => favorite.user)
  favorites: PostFavorite[];

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.FREE,
  })
  subscriptionType: SubscriptionType;

  @OneToOne(() => UserReview, (userReview) => userReview.user)
  review: UserReview;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  notifications: boolean;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @OneToMany(() => Payment, (payment) => payment.user, { nullable: true })
  payments?: Payment[];
}
