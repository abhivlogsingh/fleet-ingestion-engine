import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/')
  root() {
    return { status: 'fleet ingestion engine running' };
  }

  @Get('/health')
  health() {
    return { status: 'ok' };
  }
}
