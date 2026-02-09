import { Controller, Post, Body } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestDto } from './dto/ingest.dto';

@Controller('v1/ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post()
  ingest(@Body() body: IngestDto) {
    return this.ingestService.ingest(body);
  }
}
