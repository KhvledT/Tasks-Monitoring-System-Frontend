export interface WatchSession {
  _id: string;
  userId: string;
  vesselId: string;
  status: 'STARTED' | 'ACTIVE' | 'PAUSED' | 'HANDED_OVER' | 'COMPLETED';
  startedAt: string;
  completedAt: string | null;
  notes: string | null;
  signature: string | null;
}

export interface StartWatchRequest {
  vesselId: string;
}

export interface HandoverWatchRequest {
  incomingOfficerEmail: string;
  incomingOfficerPassword: string;
  notes?: string;
}

export interface CompleteWatchRequest {
  signature: string;
  notes?: string;
}
