import { UserProfile } from 'src/modules/user-profiles/entities/user-profile.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WaterTracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.waterTrackers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_profile_id' })
  userProfile: UserProfile;
}
