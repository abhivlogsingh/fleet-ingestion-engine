# High-Scale Energy Ingestion Engine

## Project Overview
This project implements a high-scale backend ingestion engine for EV fleets and smart meters.
The system is designed to handle telemetry data arriving every 60 seconds from thousands of
devices, store it efficiently, and provide fast analytical insights into energy efficiency
and vehicle performance.

The solution focuses on:
- High write throughput for ingestion
- Optimized read paths for dashboards and analytics
- Clear separation between real-time and historical data
- Scalable and production-ready architecture

---

## Problem Statement
Fleet platforms receive two independent telemetry streams:
1. Smart Meters (AC side) reporting energy consumed from the grid
2. Vehicles/Chargers (DC side) reporting energy delivered to the battery

Since AC consumed is always higher than DC delivered due to conversion losses,
the system must correlate both streams to compute efficiency and detect anomalies.

---

## High-Level Architecture
- A single polymorphic ingestion API accepts both vehicle and meter telemetry
- Data is stored in two layers:
  - Live (Hot) tables for current state
  - History (Cold) tables for analytics and audits
- Analytics APIs compute 24-hour summaries using indexed historical data
- The system is fully containerized using Docker

---

## Running the Project Locally
###
###
# Clone the Repository
   git clone https://github.com/abhivlogsingh/fleet-ingestion-engine.git
   cd fleet-ingestion-engine

# install 
  npm install

# NPM Start Services
  npm run start:dev

# Docker build & start device
  docker-compose up --build
  
# Everything is Running
    docker ps
  
# Running
  http://localhost:3000/
  fleet ingestion engine running
  

## API Overview

### 1. Ingestion API
Accepts two payload types:

**Vehicle Telemetry**

The ingestion API is polymorphic and accepts **two types of telemetry payloads**:
- Vehicle Telemetry
- Meter Telemetry

A single request must contain **either `vehicleId` or `meterId`**, never both.

---

### Vehicle Telemetry Payload
#Api - http://localhost:3000/v1/ingest
```json
{
  "vehicleId": "EV-1",
  "soc": 72,
  "kwhDeliveredDc": 1.2,
  "batteryTemp": 36,
  "timestamp": "2026-02-09T10:00:00Z"
}

```json
{
  "meterId": "MTR-1",
  "kwhConsumedAc": 1.5,
  "voltage": 230,
  "timestamp": "2026-02-09T10:00:00Z"
}

---

### Analytics API

1. Aggregates vehicle DC energy from vehicle_telemetry_history using dc_delta.
2. Aggregates AC energy from meter_telemetry_history using ac_delta.
3. Correlates data using aligned bucket_time windows.
4. Avoids full table scans by querying only the last 24 hours.

efficiency = total_dc_delivered / total_ac_consumed
#Api  - http://localhost:3000/v1/analytics/performance/{{vehicleId}}

{
  "vehicleId": "EV-1",
  "windowHours": 24,
  "totalAcConsumed": 133,
  "totalDcDelivered": 111,
  "efficiency": 0.83,
  "avgBatteryTemp": 33.1
}

