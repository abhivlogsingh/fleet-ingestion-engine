import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vehicle_live_status')
export class VehicleLiveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'vehicle_id', unique: true })
  vehicleId: string;

  @Column('float')
  soc: number;

  @Column('float', { name: 'battery_temp' })
  batteryTemp: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
