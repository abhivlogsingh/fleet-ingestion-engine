export class IngestDto {
  vehicleId?: string;
  meterId?: string;
  soc?: number;
  kwhDeliveredDc?: number;
  batteryTemp?: number;
  kwhConsumedAc?: number;
  voltage?: number;
  timestamp: number;
}
