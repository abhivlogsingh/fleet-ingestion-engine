import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('vehicle_live_status')
export class VehicleLiveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  // Current state for dashboard
  @Column('float')
  soc: number;

  @Column('float', { name: 'battery_temp' })
  batteryTemp: number;

  // 🔑 REQUIRED for analytics (delta calculation)
  // Last cumulative DC energy reported by vehicle
  @Column('float', {
    name: 'last_kwh_delivered_dc',
    nullable: true,
  })
  lastKwhDeliveredDc: number | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
