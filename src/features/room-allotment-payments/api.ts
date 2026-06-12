import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import {
  RoomAllotmentPayment,
  CreateRoomAllotmentPaymentPayload,
  UpdateRoomAllotmentPaymentPayload,
  RoomAllotmentPaymentQueryParams,
  StudentSummary,
  RoomAllotmentSummary,
  ContractEventSummary,
  RentPayment,
} from "./types";

export const RoomAllotmentPaymentsApi = {
  /**
   * Fetches room allotment payment transactions (paginated & filtered)
   */
  getRoomAllotmentPayments: async (
    params: RoomAllotmentPaymentQueryParams = {}
  ): Promise<PaginatedResponse<RoomAllotmentPayment>> => {
    return await http.get<PaginatedResponse<RoomAllotmentPayment>>(
      API_ENDPOINTS.ROOM_ALLOTMENT_PAYMENTS.LIST,
      { params: params as any }
    );
  },

  /**
   * Fetches a single payment record by UUID
   */
  getRoomAllotmentPaymentById: async (id: string): Promise<RoomAllotmentPayment> => {
    return await http.get<RoomAllotmentPayment>(
      API_ENDPOINTS.ROOM_ALLOTMENT_PAYMENTS.DETAIL(id)
    );
  },

  /**
   * Creates a new room allotment payment transaction
   */
  createRoomAllotmentPayment: async (
    payload: CreateRoomAllotmentPaymentPayload
  ): Promise<RoomAllotmentPayment> => {
    return await http.post<RoomAllotmentPayment>(
      API_ENDPOINTS.ROOM_ALLOTMENT_PAYMENTS.CREATE,
      payload
    );
  },

  /**
   * Updates an existing room allotment payment transaction
   */
  updateRoomAllotmentPayment: async (
    id: string,
    payload: UpdateRoomAllotmentPaymentPayload
  ): Promise<RoomAllotmentPayment> => {
    return await http.patch<RoomAllotmentPayment>(
      API_ENDPOINTS.ROOM_ALLOTMENT_PAYMENTS.UPDATE(id),
      payload
    );
  },

  /**
   * Deletes a room allotment payment record
   */
  deleteRoomAllotmentPayment: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      API_ENDPOINTS.ROOM_ALLOTMENT_PAYMENTS.DELETE(id)
    );
  },

  /**
   * Fetches a list of room allotments for dropdown selections
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
   * Fetches a list of students for filter/dropdown selections
   */
  getStudents: async (): Promise<StudentSummary[]> => {
    const res = await http.get<PaginatedResponse<StudentSummary>>(
      API_ENDPOINTS.STUDENTS.LIST,
      { params: { limit: 1000 } }
    );
    return res.data;
  },

  /**
   * Fetches a list of rent payments for linking to months (unlinked ones, or ones matching a specific payment id)
   */
  getRentPayments: async (params: {
    student_id?: string;
    room_allotment_id?: string;
    room_allotment_payment_id?: string;
    limit?: number;
  }): Promise<RentPayment[]> => {
    const queryParams: any = {
      limit: params.limit || 500,
      ...params,
    };
    const res = await http.get<PaginatedResponse<RentPayment>>(
      API_ENDPOINTS.RENT_PAYMENTS.LIST,
      { params: queryParams }
    );
    return res.data;
  },

  /**
   * Fetches a list of hostel contract events to associate with payments (e.g. transfer, cancellation events)
   */
  getHostelContractEvents: async (studentId?: string): Promise<ContractEventSummary[]> => {
    const params: any = { limit: 500 };
    if (studentId) {
      params.student_id = studentId;
    }
    const res = await http.get<PaginatedResponse<ContractEventSummary>>(
      API_ENDPOINTS.HOSTEL_CONTRACT_EVENTS.LIST,
      { params }
    );
    return res.data;
  },
};
