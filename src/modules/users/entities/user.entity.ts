import {
   Column,
   CreateDateColumn,
   Entity,
   OneToMany,
   OneToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';
import { SubscriptionType } from '../enums/subscription-type.enum';
import { UserProfile } from '../../user-profiles/entities/user-profile.entity';
import { WaterTracker } from 'src/modules/water-tracker/entities/water-tracker.entity';
import { AuthProvider } from '../enums/auth-provider.enum';

@Entity({ name: 'users' })
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
   email: string;

   @Column({ type: 'varchar', length: 100 })
   password: string;

   @Column({ type: 'varchar', length: 50, unique: true })
   auth0Id: string;

   @Column({
      type: 'enum',
      enum: AuthProvider, default: AuthProvider.LOCAL
   })
   provider: AuthProvider;

   @Column({ type: 'varchar', length: 50, nullable: false })
   name: string;

   @OneToOne(() => UserProfile,
      (profile) => profile.user)
   profile: UserProfile;

   @OneToMany(() => WaterTracker,
      (waterTracker) => waterTracker.user)
   waterTrackers: WaterTracker[];

   // @OneToMany(() => BlogPost, post => post.author)
   // blogPosts: BlogPost[]
   //
   // @OneToMany(() => Comment, comment => comment.author)
   // comments: Comment[];

   @Column({
      type: 'enum',
      enum: SubscriptionType, default: SubscriptionType.FREE,
   })
   subscriptionType: SubscriptionType;

   @CreateDateColumn({ type: 'timestamptz' })
   createdAt: Date;

   @UpdateDateColumn({ type: 'timestamptz' })
   updatedAt: Date;
}
