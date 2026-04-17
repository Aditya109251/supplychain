export interface Hub {
  id: string;
  name: string;
  capacity: number;
  currentLoad: number;
  status: 'green' | 'yellow' | 'red';
  incomingRate: number;
  processingRate: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price: number;
  city: string;
  available: boolean;
}

export interface SimulationLog {
  timestamp: Date | string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface SimulationState {
  isRunning: boolean;
  surgeIntensity: number;
  hubs: Hub[];
  warehouses: Warehouse[];
  logs: SimulationLog[];
}
