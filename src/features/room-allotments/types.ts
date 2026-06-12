export interface RoomAllotment {
  id: string;
  hostel_id: string;
  hostel_name: string | null;
  student_id: string;
  student_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  college: string | null;
  passport_number: string | null;
  hostel_contract_id: string;
  hostel_contract_name: string | null;
  status: string;
  floor_no: number;
  room_no: string;
  rent: number | null;
  remarks: string;
  add_transaction_charge: boolean;
  last_payment_receipt_number: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRoomAllotmentPayload {
  hostel_id: string;
  student_id: string;
  hostel_contract_id: string;
  floor_no: number;
  room_no: string;
  rent?: number;
  status: string;
  remarks?: string;
  add_transaction_charge?: boolean;
}

export interface UpdateRoomAllotmentPayload extends Partial<CreateRoomAllotmentPayload> {}

export interface RoomAllotmentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  hostel_id?: string;
  student_id?: string;
  hostel_contract_id?: string;
  floor_no?: number;
  room_no?: string;
  status?: string;
}

export interface RoomTransferSettlePayload {
  student_id: string;
  source_room_allotment_id: string;
  target_room_allotment_id: string;
  effective_date: string;
  calculation_mode?: "full_month_round" | "daily_prorata";
  remarks?: string;
  source_hostel_contract_id?: string;
  target_hostel_contract_id?: string;
  months_used_old?: number;
  months_remaining?: number;
  old_monthly_rent?: number;
  old_total_paid?: number;
  new_monthly_rent?: number;
}

export interface StudentWalletBalance {
  id: string;
  student_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface StudentWalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  direction: "credit" | "debit";
  transaction_type: string;
  balance_after: number;
  reference_id: string | null;
  remarks: string | null;
  created_at: string;
}

export interface HostelHistoryEntry {
  id: string;
  room_allotment_id: string;
  hostel_id: string;
  hostel_name?: string;
  from_date?: string;
  to_transfer_date?: string;
  created_at: string;
}

export interface RoomAllotmentPayment {
  id: string;
  room_allotment_id: string;
  student_id: string;
  transaction_type: string;
  total_amount: number;
  rent_amount?: number;
  payment_status: string;
  posting_datetime: string;
  summary_json?: string;
  created_at: string;
}
