export interface WatchSession {
  _id: string;
  userId: string;
  vesselId: string;
  status: 'STARTED' | 'ACTIVE' | 'PAUSED' | 'HANDED_OVER' | 'COMPLETED' | 'AUTO_COMPLETED';
  startedAt: string;
  completedAt: string | null;
  notes: string | null;
  signature: string | null;
  pausedAt?: string | null;
  totalPausedMs?: number;
  updatedAt?: string | null;
  createdAt?: string;
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
