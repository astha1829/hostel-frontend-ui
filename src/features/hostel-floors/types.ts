import { Hostel } from "../hostels/types";

export interface HostelRoom {
  id: string; // Database UUID
  hostel_id: string; // Hostel UUID relation
  hostel_floor_id: string; // Floor UUID relation
  room_no: string;
  capacity: number;
  room_type: string;
  rent: string | number; // Back-end returns decimal strings
  qr_code?: string | null;
  status: string;
  idx: number;
  created_at?: string;
  updated_at?: string;
}

export interface HostelFloor {
  id: string; // Database UUID
  hostel_id: string; // Hostel UUID relation
  floor_no: number;
  room_number_series?: string;
  idx: number;
  rooms?: HostelRoom[]; // Nested rooms array
  hostel?: Hostel; // Loaded hostel relation
  created_at?: string;
  updated_at?: string;
}

export interface CreateHostelFloorPayload {
  hostel_id: string;
  floor_no: number;
  room_number_series?: string;
  idx?: number;
}

export interface UpdateHostelFloorPayload {
  hostel_id?: string;
  floor_no?: number;
  room_number_series?: string;
  idx?: number;
}

export interface HostelFloorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  hostel_id?: string;
  floor_no?: number;
}

export interface RoomNumberSeriesOption {
  label: string;
  value: string;
}

export const ROOM_NUMBER_SERIES_OPTIONS: RoomNumberSeriesOption[] = [
  { label: "X - 1,2,3,4", value: "X - 1,2,3,4" },
  { label: "X0X - 101,102,201,202", value: "X0X - 101,102,201,202" },
  { label: "X00X - 1001,1002,2001,2002", value: "X00X - 1001,1002,2001,2002" },
  { label: "X000X - 10001,10002,20001", value: "X000X - 10001,10002,20001" },
];
