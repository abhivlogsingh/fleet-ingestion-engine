import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import {
  VehicleLiveEntity,
  VehicleHistoryEntity,
  MeterLiveEntity,
  MeterHistoryEntity,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleLiveEntity,
      VehicleHistoryEntity,
      MeterLiveEntity,
      MeterHistoryEntity,
    ]),
  ],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
