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
   git clone <your-repo-url>
   cd fleet-ingestion-engine

# NPM Start Services
  npm install
  npm run start:dev

# Docker build & start device

  docker-compose up --build
  docker-compose up -d --build
  
  # Everything is Running
    docker ps
  
  # http://localhost:3000/ - 
    fleet ingestion engine running
  

## API Overview

### 1. Ingestion API


Accepts two payload types:

**Vehicle Telemetry**
```json
{
  "vehicleId": "EV-1",
  "soc": 72,
  "kwhDeliveredDc": 1.2,
  "batteryTemp": 36,
  "timestamp": "2026-02-09T10:00:00Z"
}

**Meter Telemetry**

{
  "meterId": "MTR-1",
  "kwhConsumedAc": 1.5,
  "voltage": 230,
  "timestamp": "2026-02-09T10:00:00Z"
}

