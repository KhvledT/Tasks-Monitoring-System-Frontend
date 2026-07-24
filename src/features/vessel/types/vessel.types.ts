export interface Vessel {
  id: string;
  _id?: string;
  name: string;
  type: string;
  grt?: number;
  dwt?: number;
  isActive?: boolean;
  vesselMode?: 'Personal' | 'VIP';
  captainId?: string;
  inviteCode?: string;
  vesselStatus?: 'Active' | 'Draft' | 'Maintenance' | 'Suspended' | 'Archived';
  userRank?: string;
  hasRequestedLeave?: boolean;
  isOffboarded?: boolean;
  serviceDays?: number;
}

export interface CreateVesselRequest {
  name: string;
  type: string;
  grt?: number;
  dwt?: number;
  vesselMode?: 'Personal' | 'VIP';
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
