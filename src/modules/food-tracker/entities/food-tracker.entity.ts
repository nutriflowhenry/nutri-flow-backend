import { UserProfile } from 'src/modules/user-profiles/entities/user-profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FoodTracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  calories: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.foodTrackers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfile;
}
