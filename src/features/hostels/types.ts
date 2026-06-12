export type HostelStatus = "active" | "inactive" | "maintenance" | string;

export interface Hostel {
  id: string; // Database UUID
  hostel_id: string; // Business identifier (e.g. H001)
  hostel_name: string;
  zone?: string;
  status?: HostelStatus;
  auth_person_name?: string;
  contact?: string;
  number_of_floors?: number;
  is_submitted: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HostelRoom {
  id: string;
  room_number: string;
  capacity?: number;
}

export interface HostelFloor {
  id: string; // Database UUID
  hostel_id: string; // Hostel UUID relation
  floor_no: number;
  room_number_series?: string;
  idx: number;
  rooms?: HostelRoom[]; // Relation array of rooms
  created_at?: string;
  updated_at?: string;
}

export interface UpdateHostelPayload {
  hostel_name?: string;
  hostel_id?: string;
  zone?: string;
  status?: HostelStatus;
  auth_person_name?: string;
  contact?: string;
  number_of_floors?: number;
  is_submitted?: boolean;
}

export interface HostelQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  hostel_name?: string;
  hostel_id?: string;
  zone?: string;
  status?: HostelStatus;
  is_submitted?: boolean;
}

export interface CreateHostelPayload {
  hostel_name: string;
  hostel_id: string;
  zone?: string;
  status?: HostelStatus;
  auth_person_name?: string;
  contact?: string;
  number_of_floors?: number;
  is_submitted?: boolean;
}
