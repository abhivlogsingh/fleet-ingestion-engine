import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from './config/database.config';

import { HealthModule } from './modules/health/health.module';
import { IngestModule } from './modules/ingest/ingest.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    // 🔌 Database connection (global)
    TypeOrmModule.forRoot(databaseConfig),

    // ❤️ Health & readiness checks
    HealthModule,

    // 📥 High-throughput ingestion APIs
    IngestModule,

    // 📊 Read-only analytics APIs
    AnalyticsModule,
  ],
})
export class AppModule {}
