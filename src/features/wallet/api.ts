import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import {
  StudentWalletBalance,
  StudentWalletTransaction,
  RoomTransferSettlePayload,
  RoomTransferSettleResult,
} from "./types";
import { RoomAllotment } from "../room-allotments/types";

export const WalletApi = {
  /**
   * Fetch the student's wallet balance
   */
  getStudentWalletBalance: async (studentId: string): Promise<StudentWalletBalance> => {
    return await http.get<StudentWalletBalance>(
      API_ENDPOINTS.STUDENT_WALLETS.DETAIL(studentId)
    );
  },

  /**
   * Fetch the student's wallet transactions / ledger
   */
  getStudentWalletTransactions: async (
    studentId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<StudentWalletTransaction>> => {
    return await http.get<PaginatedResponse<StudentWalletTransaction>>(
      API_ENDPOINTS.STUDENT_WALLETS.TRANSACTIONS(studentId),
      { params: params as any }
    );
  },

  /**
   * Execute the room transfer settlement
   */
  settleRoomTransfer: async (payload: RoomTransferSettlePayload): Promise<RoomTransferSettleResult> => {
    return await http.post<RoomTransferSettleResult>(
      API_ENDPOINTS.ROOM_TRANSFERS.SETTLE,
      payload
    );
  },

  /**
   * Fetch room allotments for a specific student to list source/target choices
   */
  getStudentRoomAllotments: async (studentId: string): Promise<PaginatedResponse<RoomAllotment>> => {
    return await http.get<PaginatedResponse<RoomAllotment>>(
      API_ENDPOINTS.ROOM_ALLOTMENTS.LIST,
      { params: { student_id: studentId, limit: 100 } }
    );
  },
};
