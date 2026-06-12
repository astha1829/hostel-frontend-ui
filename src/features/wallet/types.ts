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

export interface RoomTransferSettleResult {
  student_id: string;
  source_room_allotment_id: string;
  target_room_allotment_id: string;
  old_total_paid: number;
  old_consumed_amount: number;
  old_unused_amount: number;
  wallet_credit_added: number;
  new_required_amount: number;
  wallet_credit_applied: number;
  remaining_payable: number;
  wallet_balance_after: number;
}
