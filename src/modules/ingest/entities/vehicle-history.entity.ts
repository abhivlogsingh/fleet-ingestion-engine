import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('vehicle_telemetry_history')
@Index(['vehicleId', 'timestamp'])
export class VehicleHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  @Column('float', { name: 'kwh_delivered_dc' })
  kwhDeliveredDc: number;

  @Column('float', { name: 'battery_temp' })
  batteryTemp: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
