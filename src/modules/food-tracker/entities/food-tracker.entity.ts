import { UserProfile } from 'src/modules/user-profiles/entities/user-profile.entity';
import {
  Column,
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

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // @CreateDateColumn({ type: 'timestamptz' })
  // createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.foodTrackers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_profile_id' })
  userProfile: UserProfile;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
