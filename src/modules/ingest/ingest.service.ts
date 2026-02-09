import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { IngestDto } from './dto/ingest.dto';
import {
  VehicleLiveEntity,
  VehicleHistoryEntity,
  MeterLiveEntity,
  MeterHistoryEntity,
} from './entities';

@Injectable()
export class IngestService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(VehicleLiveEntity)
    private readonly vehicleLiveRepo: Repository<VehicleLiveEntity>,

    @InjectRepository(VehicleHistoryEntity)
    private readonly vehicleHistoryRepo: Repository<VehicleHistoryEntity>,

    @InjectRepository(MeterLiveEntity)
    private readonly meterLiveRepo: Repository<MeterLiveEntity>,

    @InjectRepository(MeterHistoryEntity)
    private readonly meterHistoryRepo: Repository<MeterHistoryEntity>,
  ) {}

  async ingest(dto: IngestDto) {
    const hasVehicle = !!dto.vehicleId;
    const hasMeter = !!dto.meterId;

    // ❗ strict polymorphic validation
    if (hasVehicle && hasMeter) {
      throw new BadRequestException(
        'Provide either vehicleId or meterId, not both',
      );
    }

    if (!hasVehicle && !hasMeter) {
      throw new BadRequestException(
        'Payload must contain either vehicleId or meterId',
      );
    }

    const timestamp = new Date(dto.timestamp);

    // ⏱minute bucket for analytics
    const bucketTime = new Date(timestamp);
    bucketTime.setSeconds(0, 0);

    return this.dataSource.transaction(async (manager) => {
      // ===============================
      // VEHICLE INGEST
      // ===============================
      if (hasVehicle) {
        const live = await manager.findOne(VehicleLiveEntity, {
          where: { vehicleId: dto.vehicleId },
        });

        const previousKwh = live?.lastKwhDeliveredDc ?? 0;
        const deltaDc =
          dto.kwhDeliveredDc != null ? dto.kwhDeliveredDc - previousKwh : 0;

        // 1️⃣ HISTORY (append-only, analytics-ready)
        await manager.insert(VehicleHistoryEntity, {
          vehicleId: dto.vehicleId,
          bucketTime,
          dcDelta: Math.max(deltaDc, 0),
          batteryTemp: dto.batteryTemp,
          timestamp, // ✅ FIX: NOT NULL column
        });

        // 2️⃣ LIVE (stateful upsert)
        await manager.upsert(
          VehicleLiveEntity,
          {
            vehicleId: dto.vehicleId,
            soc: dto.soc,
            batteryTemp: dto.batteryTemp,
            lastKwhDeliveredDc: dto.kwhDeliveredDc,
            updatedAt: new Date(),
          },
          ['vehicleId'],
        );

        return {
          status: 'ingested',
          stream: 'vehicle',
          vehicleId: dto.vehicleId,
        };
      }

      // ===============================
      //  METER INGEST
      // ===============================
      const live = await manager.findOne(MeterLiveEntity, {
        where: { meterId: dto.meterId },
      });

      const previousKwh = live?.lastKwhConsumedAc ?? 0;
      const deltaAc =
        dto.kwhConsumedAc != null ? dto.kwhConsumedAc - previousKwh : 0;

      await manager.insert(MeterHistoryEntity, {
        meterId: dto.meterId,
        bucketTime,
        acDelta: Math.max(deltaAc, 0),
        voltage: dto.voltage,
        timestamp, // FIX: NOT NULL column
      });

      await manager.upsert(
        MeterLiveEntity,
        {
          meterId: dto.meterId,
          voltage: dto.voltage,
          lastKwhConsumedAc: dto.kwhConsumedAc,
          updatedAt: new Date(),
        },
        ['meterId'],
      );

      return {
        status: 'ingested',
        stream: 'meter',
        meterId: dto.meterId,
      };
    });
  }
}
