import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('meter_live_status')
export class MeterLiveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ name: 'meter_id' })
  meterId: string;

  // Current voltage for live dashboard
  @Column('float')
  voltage: number;

  // 🔑 REQUIRED for analytics (delta calculation)
  // Last cumulative AC energy reported by meter
  @Column('float', {
    name: 'last_kwh_consumed_ac',
    nullable: true,
  })
  lastKwhConsumedAc: number | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
