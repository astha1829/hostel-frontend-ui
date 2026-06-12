export interface HostelContractHistoryRow {
  id: string;
  student_id: string;
  contract_ref: string;
  display_order: number;
  created_at: string;
  updated_at?: string;
  student_name?: string | null;
  student?: {
    id: string;
    student_name: string;
    last_name?: string;
    passport_no?: string;
  } | null;
}

export interface CreateHostelContractHistoryPayload {
  student_id: string;
  contract_ref: string;
  display_order?: number;
}

export interface UpdateHostelContractHistoryPayload extends Partial<CreateHostelContractHistoryPayload> {}

export interface HostelContractHistoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  student_id?: string;
  contract_ref?: string;
}

export interface StudentSummary {
  id: string;
  student_name: string;
  last_name?: string;
  passport_no?: string;
}
