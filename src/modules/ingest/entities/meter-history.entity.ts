import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('meter_telemetry_history')
@Index(['meterId', 'bucketTime'])
export class MeterHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'meter_id' })
  meterId: string;

  // 🔑 Per-window AC energy (derived at ingest time)
  @Column('float', { name: 'ac_delta' })
  acDelta: number;

  // Voltage snapshot for that window (optional analytics)
  @Column('float')
  voltage: number;

  // ⏱️ Time bucket for efficient analytics
  @Column({ name: 'bucket_time', type: 'timestamptz' })
  bucketTime: Date;

  // 🧾 Raw event timestamp (audit/debug)
  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
