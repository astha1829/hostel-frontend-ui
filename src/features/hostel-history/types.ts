export interface HostelHistoryRow {
  id: string;
  room_allotment_id: string;
  hostel_id: string;
  hostel_name: string | null;
  floor_room_no: string;
  from_date: string | null;
  to_transfer_date: string | null;
  months_elapsed: number;
  idx: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHostelHistoryPayload {
  room_allotment_id: string;
  hostel_id: string;
  floor_room_no: string;
  from_date?: string;
  to_transfer_date?: string;
  months_elapsed?: number;
  idx?: number;
}

export interface UpdateHostelHistoryPayload extends Partial<CreateHostelHistoryPayload> {}

export interface HostelOption {
  id: string;
  hostel_name: string;
}
