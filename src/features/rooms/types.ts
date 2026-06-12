import { Hostel } from "../hostels/types";
import { HostelFloor } from "../hostel-floors/types";

export interface HostelRoom {
  id: string; // Database UUID
  hostel_id: string; // Hostel UUID relation
  hostel_floor_id: string; // Floor UUID relation
  room_no: string;
  capacity: number;
  room_type: string;
  rent: number;
  qr_code?: string | null;
  status: string;
  idx: number;
  created_at?: string;
  updated_at?: string;
  // Loaded relation fields
  hostel?: Hostel;
  floor?: HostelFloor;
}

export interface CreateHostelRoomPayload {
  room_no: string;
  capacity: number;
  room_type: string;
  rent: number;
  status: string;
  idx?: number;
  qr_code?: string | null;
}

export interface UpdateHostelRoomPayload {
  room_no?: string;
  capacity?: number;
  room_type?: string;
  rent?: number;
  status?: string;
  idx?: number;
  qr_code?: string | null;
}

export interface HostelRoomQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  room_type?: string;
  status?: string;
}
