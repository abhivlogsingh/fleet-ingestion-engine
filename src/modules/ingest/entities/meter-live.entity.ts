import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('meter_live_status')
export class MeterLiveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'meter_id', unique: true })
  meterId: string;

  @Column('float')
  voltage: number;

  @Column('float', { name: 'kwh_consumed_ac' })
  kwhConsumedAc: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
