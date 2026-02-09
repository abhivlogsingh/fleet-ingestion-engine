import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('meter_telemetry_history')
@Index(['meterId', 'timestamp'])
export class MeterHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'meter_id' })
  meterId: string;

  @Column('float')
  voltage: number;

  @Column('float', { name: 'kwh_consumed_ac' })
  kwhConsumedAc: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
