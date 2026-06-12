export interface HostelContractEvent {
  id: string;
  student_id: string;
  student_name: string | null;
  action_type: string;
  event_status: string;
  contract_type_before: string | null;
  contract_type_after: string | null;
  source_hostel_contract_id: string | null;
  source_hostel_contract_name: string | null;
  target_hostel_contract_id: string | null;
  target_hostel_contract_name: string | null;
  source_room_allotment_id: string | null;
  source_room_allotment_name: string | null;
  target_room_allotment_id: string | null;
  target_room_allotment_name: string | null;
  triggered_by: string | null;
  triggered_on: string | null;
  effective_date: string | null;
  settlement_rap: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHostelContractEventPayload {
  student_id: string;
  action_type: string;
  event_status: string;
  contract_type_before?: string;
  contract_type_after?: string;
  source_hostel_contract_id?: string | null;
  target_hostel_contract_id?: string | null;
  source_room_allotment_id?: string | null;
  target_room_allotment_id?: string | null;
  triggered_by?: string;
  triggered_on?: string;
  effective_date?: string;
  settlement_rap?: string | null;
}

export interface UpdateHostelContractEventPayload extends Partial<CreateHostelContractEventPayload> {}

export interface HostelContractEventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  student_id?: string;
  action_type?: string;
  event_status?: string;
  target_hostel_contract_id?: string;
  target_room_allotment_id?: string;
  triggered_on?: string;
}

// Lookup interfaces for forms
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
  status: string;
}

export interface RoomAllotmentSummary {
  id: string;
  room_no: string;
  hostel_name: string | null;
  status: string;
}

export interface RoomAllotmentPaymentSummary {
  id: string;
  total_amount: number;
  room_allotment_name: string | null;
}
