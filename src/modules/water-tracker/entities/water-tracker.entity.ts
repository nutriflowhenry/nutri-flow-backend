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

  @Column({ type: 'int' })
  amount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  // @ManyToOne(() => User, (user) => user.waterTrackers, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user: User;
}
