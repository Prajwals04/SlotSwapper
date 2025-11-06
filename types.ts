export enum EventStatus {
  BUSY = 'BUSY',
  SWAPPABLE = 'SWAPPABLE',
  SWAP_PENDING = 'SWAP_PENDING',
}

export enum SwapRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface Event {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: EventStatus;
  userId: string;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterSlotId: string;
  requestedUserId: string;
  requestedSlotId: string;
  status: SwapRequestStatus;
}

// For UI display
export interface DetailedEvent extends Event {
  user?: {
    name: string;
    email: string;
  };
}

export interface DetailedSwapRequest extends SwapRequest {
    requester: User;
    requestedUser: User;
    requesterSlot: Event;
    requestedSlot: Event;
}

export type Page = 'login' | 'signup' | 'dashboard' | 'marketplace' | 'requests';
