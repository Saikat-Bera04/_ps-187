export interface WatchlistPerson {
  referenceId: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastMatch: string | null;
  addedAt: string;
  addedBy: string;
  description?: string;
  category: string;
}

export interface WatchlistVehicle {
  vehicleId: string;
  numberPlate: string;
  vehicleType: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastMatch: string | null;
  addedAt: string;
  addedBy: string;
  description?: string;
  category: string;
}
