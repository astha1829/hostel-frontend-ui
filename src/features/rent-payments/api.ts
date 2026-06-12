import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import {
  RentPayment,
  CreateRentPaymentPayload,
  UpdateRentPaymentPayload,
  RentPaymentQueryParams,
  StudentSummary,
  HostelContractSummary,
  RoomAllotmentSummary,
  RoomAllotmentPaymentSummary,
  HostelContractEventSummary,
} from "./types";

export const RentPaymentsApi = {
  /**
   * Fetches a paginated and filtered list of rent payments.
   */
  getRentPayments: async (
    params: RentPaymentQueryParams = {}
  ): Promise<PaginatedResponse<RentPayment>> => {
    return await http.get<PaginatedResponse<RentPayment>>(
      API_ENDPOINTS.RENT_PAYMENTS.LIST,
      { params: params as any }
    );
  },

  /**
   * Fetches a single rent payment transaction by UUID.
   */
  getRentPaymentById: async (id: string): Promise<RentPayment> => {
    return await http.get<RentPayment>(
      API_ENDPOINTS.RENT_PAYMENTS.DETAIL(id)
    );
  },

  /**
   * Registers a new rent payment in the ledger.
   */
  createRentPayment: async (
    payload: CreateRentPaymentPayload
  ): Promise<RentPayment> => {
    return await http.post<RentPayment>(
      API_ENDPOINTS.RENT_PAYMENTS.CREATE,
      payload
    );
  },

  /**
   * Updates an existing rent payment transaction.
   */
  updateRentPayment: async (
    id: string,
    payload: UpdateRentPaymentPayload
  ): Promise<RentPayment> => {
    return await http.patch<RentPayment>(
      API_ENDPOINTS.RENT_PAYMENTS.UPDATE(id),
      payload
    );
  },

  /**
   * Deletes a rent payment from the ledger.
   */
  deleteRentPayment: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      API_ENDPOINTS.RENT_PAYMENTS.DELETE(id)
    );
  },

  /**
   * Helper to fetch student directory for select inputs.
   */
  getStudents: async (): Promise<StudentSummary[]> => {
    const res = await http.get<PaginatedResponse<StudentSummary>>(
      API_ENDPOINTS.STUDENTS.LIST,
      { params: { limit: 1000 } }
    );
    return res.data;
  },

  /**
   * Helper to fetch hostel contracts, optionally filtered by student.
   */
  getHostelContracts: async (studentId?: string): Promise<HostelContractSummary[]> => {
    const params: any = { limit: 1000 };
    if (studentId) {
      params.student_id = studentId;
    }
    const res = await http.get<PaginatedResponse<HostelContractSummary>>(
      API_ENDPOINTS.HOSTEL_CONTRACTS.LIST,
      { params }
    );
    return res.data;
  },

  /**
   * Helper to fetch room allotments, optionally filtered by student.
   */
  getRoomAllotments: async (studentId?: string): Promise<RoomAllotmentSummary[]> => {
    const params: any = { limit: 1000 };
    if (studentId) {
      params.student_id = studentId;
    }
    const res = await http.get<PaginatedResponse<RoomAllotmentSummary>>(
      API_ENDPOINTS.ROOM_ALLOTMENTS.LIST,
      { params }
    );
    return res.data;
  },

  /**
   * Helper to fetch room allotment payments, optionally filtered by student.
   */
  getRoomAllotmentPayments: async (studentId?: string): Promise<RoomAllotmentPaymentSummary[]> => {
    const params: any = { limit: 1000 };
    if (studentId) {
      params.student_id = studentId;
    }
    const res = await http.get<PaginatedResponse<RoomAllotmentPaymentSummary>>(
      API_ENDPOINTS.ROOM_ALLOTMENT_PAYMENTS.LIST,
      { params }
    );
    return res.data;
  },

  /**
   * Helper to fetch contract events, optionally filtered by student.
   */
  getHostelContractEvents: async (studentId?: string): Promise<HostelContractEventSummary[]> => {
    const params: any = { limit: 1000 };
    if (studentId) {
      params.student_id = studentId;
    }
    const res = await http.get<PaginatedResponse<HostelContractEventSummary>>(
      API_ENDPOINTS.HOSTEL_CONTRACT_EVENTS.LIST,
      { params }
    );
    return res.data;
  },
};
