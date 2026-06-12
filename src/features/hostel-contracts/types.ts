export interface HostelContract {
  id: string;
  hostel_id: string;
  hostel_name: string | null;
  student_id: string;
  student_name: string | null;
  contract_type: string;
  contract_no: string;
  standard_duration_months?: number;
  status: string;
  arrival_date?: string;
  contract_start_date: string;
  contract_end_date?: string;
  sharing?: string;
  contract_price?: number;
  confirm_status?: string;
  is_submitted: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateHostelContractPayload {
  hostel_id: string;
  student_id: string;
  contract_type: string;
  contract_no: string;
  standard_duration_months?: number;
  status: string;
  arrival_date?: string;
  contract_start_date: string;
  contract_end_date?: string;
  sharing?: string;
  contract_price?: number;
  confirm_status?: string;
  is_submitted?: boolean;
}

export interface UpdateHostelContractPayload extends Partial<CreateHostelContractPayload> {}

export interface HostelContractQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  hostel_id?: string;
  student_id?: string;
  contract_type?: string;
  contract_no?: string;
  status?: string;
  confirm_status?: string;
  sharing?: string;
  contract_start_date?: string;
  contract_end_date?: string;
}

export interface HostelContractEvent {
  id: string;
  event_no?: string;
  student_id: string;
  action_type: string;
  event_status: string;
  contract_type_before?: string;
  contract_type_after?: string;
  source_hostel_contract_id?: string;
  target_hostel_contract_id?: string;
  source_room_allotment_id?: string;
  target_room_allotment_id?: string;
  triggered_by?: string;
  triggered_on?: string;
  effective_date?: string;
  settlement_rap?: string;
  created_at?: string;
  updated_at?: string;
}

