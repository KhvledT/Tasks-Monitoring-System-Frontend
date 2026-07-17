export interface Vessel {
  id: string;
  name: string;
  type: string;
  grt?: number;
  dwt?: number;
  isActive?: boolean;
}

export interface CreateVesselRequest {
  name: string;
  type: string;
  grt?: number;
  dwt?: number;
}

export interface CreateVesselResponse {
  statusCode: number;
  message: string;
  result: Vessel;
}

export interface VesselListResponse {
  statusCode: number;
  message: string;
  result: Vessel[];
}

export interface ActivateVesselResponse {
  statusCode: number;
  message: string;
  result: {
    id: string;
    name: string;
    type: string;
    grt?: number;
    dwt?: number;
    isActive: boolean;
  };
}
