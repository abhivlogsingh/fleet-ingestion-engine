import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

import { VehicleHistoryEntity } from '../ingest/entities/vehicle-history.entity';
import { MeterHistoryEntity } from '../ingest/entities/meter-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehicleHistoryEntity, MeterHistoryEntity]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
