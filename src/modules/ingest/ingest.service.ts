import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    // 🔐 STRICT VALIDATION
    if ((hasVehicle && hasMeter) || (!hasVehicle && !hasMeter)) {
      throw new BadRequestException(
        'Payload must contain either vehicleId or meterId (exactly one)',
      );
    }

    const timestamp = new Date(dto.timestamp);

    // 🚗 VEHICLE TELEMETRY
    if (hasVehicle) {
      await this.vehicleHistoryRepo.insert({
        vehicleId: dto.vehicleId,
        kwhDeliveredDc: dto.kwhDeliveredDc,
        batteryTemp: dto.batteryTemp,
        timestamp,
      });

      await this.vehicleLiveRepo.upsert(
        {
          vehicleId: dto.vehicleId,
          soc: dto.soc,
          batteryTemp: dto.batteryTemp,
        },
        ['vehicleId'],
      );

      return {
        status: 'ingested',
        type: 'vehicle',
      };
    }

    // 🔌 METER TELEMETRY
    await this.meterHistoryRepo.insert({
      meterId: dto.meterId,
      voltage: dto.voltage,
      kwhConsumedAc: dto.kwhConsumedAc,
      timestamp,
    });

    await this.meterLiveRepo.upsert(
      {
        meterId: dto.meterId,
        voltage: dto.voltage,
        kwhConsumedAc: dto.kwhConsumedAc,
      },
      ['meterId'],
    );

    return {
      status: 'ingested',
      type: 'meter',
    };
  }
}
