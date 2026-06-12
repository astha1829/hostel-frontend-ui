export interface RentPaymentReference {
  rent_payment_id: string | null;
  month_label: string;
  rent_amount: number | null;
  penalty_amount: number | null;
}

export interface RoomAllotmentPayment {
  id: string;
  room_allotment_id: string;
  room_allotment_name: string | null;
  student_id: string;
  student_name: string | null;
  transaction_type: string;
  total_amount: number;
  rent_amount: number | null;
  penalty_amount: number | null;
  transaction_charge: number | null;
  payment_status: string | null;
  page_visited: boolean;
  posting_datetime: string | null;
  summary_json: any | null;
  target_room_allotment: string | null;
  contract_event_id: string | null;
  contract_event_name: string | null;
  months: RentPaymentReference[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateRentPaymentReferencePayload {
  rent_payment_id: string;
  month_label: string;
  rent_amount?: number;
  penalty_amount?: number;
  idx?: number;
}

export interface CreateRoomAllotmentPaymentPayload {
  room_allotment_id: string;
  student_id: string;
  transaction_type: string;
  total_amount: number;
  rent_amount?: number;
  penalty_amount?: number;
  transaction_charge?: number;
  payment_status?: string;
  page_visited?: boolean;
  posting_datetime?: string;
  summary_json?: any;
  target_room_allotment?: string;
  contract_event_id?: string;
  months?: CreateRentPaymentReferencePayload[];
}

export interface UpdateRoomAllotmentPaymentPayload extends Partial<CreateRoomAllotmentPaymentPayload> {}

export interface RoomAllotmentPaymentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  room_allotment_id?: string;
  student_id?: string;
  transaction_type?: string;
  payment_status?: string;
  posting_datetime?: string;
}

// Representing related Student reference
export interface StudentSummary {
  id: string;
  student_name: string;
  last_name?: string;
  passport_no?: string;
  college?: string;
}

// Representing related Room Allotment reference
export interface RoomAllotmentSummary {
  id: string;
  student_id: string;
  student_name: string | null;
  hostel_name: string | null;
  room_no: string;
  floor_no: number;
  status: string;
  created_at?: string;
}

// Representing related Hostel Contract Event reference
export interface ContractEventSummary {
  id: string;
  event_no?: string;
  action_type: string;
  event_status: string;
  student_id: string;
}

// Representing Rent Payment reference
export interface RentPayment {
  id: string;
  student_id: string;
  hostel_contract_id: string;
  room_allotment_id: string;
  name: string;
  against_month: string;
  posting_datetime: string;
  transaction_type: string;
  direction: string;
  amount: number;
  room_allotment_payment_id?: string | null;
  remarks?: string;
}
