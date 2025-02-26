import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ActivityLevel } from '../../user-profiles/enums/activity-level.enum';
import { Goal } from '../../user-profiles/enums/goal.enum';
import { SubscriptionType } from '../enums/subscription-type.enum';
import { Gender } from '../../user-profiles/enums/gender.enum';
import { UserProfile } from '../../user-profiles/entities/user-profile.entity';

@Entity({ name: 'users' })
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  auth0Id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @OneToOne(() => UserProfile,
    profile => profile.user)
  profile: UserProfile;

  // @OneToMany(() => BlogPost, post => post.author)
  // blogPosts: BlogPost[]
  //
  // @OneToMany(() => Comment, comment => comment.author)
  // comments: Comment[];

  @Column({ type: 'enum', enum: SubscriptionType, default: SubscriptionType.FREE })
  subscriptionType: SubscriptionType;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

}
