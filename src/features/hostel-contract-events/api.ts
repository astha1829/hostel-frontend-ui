import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import {
  HostelContractEvent,
  CreateHostelContractEventPayload,
  UpdateHostelContractEventPayload,
  HostelContractEventQueryParams,
  StudentSummary,
  HostelContractSummary,
  RoomAllotmentSummary,
  RoomAllotmentPaymentSummary,
} from "./types";

export const HostelContractEventsApi = {
  /**
   * Fetch a paginated and filtered list of hostel contract events.
   */
  getHostelContractEvents: async (
    params: HostelContractEventQueryParams = {}
  ): Promise<PaginatedResponse<HostelContractEvent>> => {
    return await http.get<PaginatedResponse<HostelContractEvent>>(
      API_ENDPOINTS.HOSTEL_CONTRACT_EVENTS.LIST,
      { params: params as any }
    );
  },

  /**
   * Fetch a single hostel contract event by ID.
   */
  getHostelContractEventById: async (id: string): Promise<HostelContractEvent> => {
    return await http.get<HostelContractEvent>(
      API_ENDPOINTS.HOSTEL_CONTRACT_EVENTS.DETAIL(id)
    );
  },

  /**
   * Create a new hostel contract event record.
   */
  createHostelContractEvent: async (
    payload: CreateHostelContractEventPayload
  ): Promise<HostelContractEvent> => {
    return await http.post<HostelContractEvent>(
      API_ENDPOINTS.HOSTEL_CONTRACT_EVENTS.CREATE,
      payload
    );
  },

  /**
   * Update an existing hostel contract event.
   */
  updateHostelContractEvent: async (
    id: string,
    payload: UpdateHostelContractEventPayload
  ): Promise<HostelContractEvent> => {
    return await http.patch<HostelContractEvent>(
      API_ENDPOINTS.HOSTEL_CONTRACT_EVENTS.UPDATE(id),
      payload
    );
  },

  /**
   * Delete a hostel contract event from the logs.
   */
  deleteHostelContractEvent: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      API_ENDPOINTS.HOSTEL_CONTRACT_EVENTS.DELETE(id)
    );
  },

  /**
   * Helper to fetch student directory for select dropdowns.
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
   * Helper to fetch room allotment payments (RAPs), optionally filtered by student.
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
};
