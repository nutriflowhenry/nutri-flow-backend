import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WaterTracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  date: string;
}
