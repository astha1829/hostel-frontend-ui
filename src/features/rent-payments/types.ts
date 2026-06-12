export interface RentPayment {
  id: string;
  student_id: string;
  student_name: string | null;
  hostel_contract_id: string;
  hostel_contract_name: string | null;
  room_allotment_id: string;
  room_allotment_name: string | null;
  name: string;
  against_month: string;
  posting_datetime: string;
  transaction_type: string;
  direction: string;
  amount: number;
  entry_key: string | null;
  room_allotment_payment_id: string | null;
  room_allotment_payment_name: string | null;
  hostel_contract_event_id: string | null;
  hostel_contract_event_name: string | null;
  reference_doctype: string | null;
  reference_name: string | null;
  remarks: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRentPaymentPayload {
  student_id: string;
  hostel_contract_id: string;
  room_allotment_id: string;
  name?: string;
  against_month: string;
  posting_datetime: string;
  transaction_type: string;
  direction: string;
  amount: number;
  entry_key?: string;
  room_allotment_payment_id?: string;
  hostel_contract_event_id?: string;
  reference_doctype?: string;
  reference_name?: string;
  remarks?: string;
}

export interface UpdateRentPaymentPayload extends Partial<CreateRentPaymentPayload> {}

export interface RentPaymentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  student_id?: string;
  hostel_contract_id?: string;
  room_allotment_id?: string;
  transaction_type?: string;
  direction?: string;
  against_month?: string;
  room_allotment_payment_id?: string;
  posting_datetime?: string;
}

export interface StudentSummary {
  id: string;
  student_name: string;
  last_name?: string;
  passport_no?: string;
}

export interface HostelContractSummary {
  id: string;
  contract_no: string;
  contract_type: string;
  student_id: string;
}

export interface RoomAllotmentSummary {
  id: string;
  room_no: string;
  floor_no: number;
  hostel_name: string | null;
  student_id: string;
}

export interface RoomAllotmentPaymentSummary {
  id: string;
  room_allotment_name: string | null;
  total_amount: number;
  posting_datetime: string | null;
}

export interface HostelContractEventSummary {
  id: string;
  event_no?: string;
  action_type: string;
  student_id: string;
}
