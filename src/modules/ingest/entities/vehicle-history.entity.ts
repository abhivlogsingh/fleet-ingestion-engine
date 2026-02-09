import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('vehicle_telemetry_history')
@Index(['vehicleId', 'bucketTime'])
export class VehicleHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  // 🔑 Per-window DC energy (derived at ingest time)
  @Column('float', { name: 'dc_delta' })
  dcDelta: number;

  @Column('float', { name: 'battery_temp' })
  batteryTemp: number;

  // ⏱️ Time window for analytics (minute bucket)
  @Column({ name: 'bucket_time', type: 'timestamptz' })
  bucketTime: Date;

  // 🧾 Optional: raw event time for audit/debug
  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
