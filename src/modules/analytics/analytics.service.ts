import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VehicleHistoryEntity, MeterHistoryEntity } from '../ingest/entities';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehicleHistoryEntity)
    private readonly vehicleHistoryRepo: Repository<VehicleHistoryEntity>,

    @InjectRepository(MeterHistoryEntity)
    private readonly meterHistoryRepo: Repository<MeterHistoryEntity>,
  ) {}

  async getPerformance(vehicleId: string) {
    // ⏱️ 24-hour window (bucket-based)
    const toTime = new Date();
    const fromTime = new Date(toTime.getTime() - 24 * 60 * 60 * 1000);

    // 🚗 Vehicle side aggregation (DC + avg temp)
    const vehicleAgg = await this.vehicleHistoryRepo
      .createQueryBuilder('vh')
      .select('SUM(vh.dcDelta)', 'totalDc')
      .addSelect('AVG(vh.batteryTemp)', 'avgTemp')
      .where('vh.vehicleId = :vehicleId', { vehicleId })
      .andWhere('vh.bucketTime BETWEEN :from AND :to', {
        from: fromTime,
        to: toTime,
      })
      .getRawOne<{
        totalDc: string | null;
        avgTemp: string | null;
      }>();

    const totalDc = Number(vehicleAgg?.totalDc ?? 0);
    const avgBatteryTemp = Number(vehicleAgg?.avgTemp ?? 0);

    // 🔌 Meter side aggregation (AC)
    // ⚠️ No direct mapping: aggregate ALL meters in same window
    const meterAgg = await this.meterHistoryRepo
      .createQueryBuilder('mh')
      .select('SUM(mh.acDelta)', 'totalAc')
      .where('mh.bucketTime BETWEEN :from AND :to', {
        from: fromTime,
        to: toTime,
      })
      .getRawOne<{ totalAc: string | null }>();

    const totalAc = Number(meterAgg?.totalAc ?? 0);

    // ⚡ Efficiency
    const efficiency = totalAc > 0 ? Number((totalDc / totalAc).toFixed(2)) : 0;

    // 📦 Final response
    return {
      vehicleId,
      windowHours: 24,
      totalAcConsumed: totalAc,
      totalDcDelivered: totalDc,
      efficiency,
      avgBatteryTemp,
    };
  }
}
