import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { HealthModule } from './modules/health/health.module';
import { IngestModule } from './modules/ingest/ingest.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), HealthModule, IngestModule],
})
export class AppModule {}
