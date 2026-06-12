import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import { Hostel } from "../hostels/types";
import { Student } from "../students/types";
import { HostelContract } from "../hostel-contracts/types";
import { HostelFloor } from "../hostel-floors/types";
import { HostelRoom } from "../rooms/types";
import {
  RoomAllotment,
  CreateRoomAllotmentPayload,
  UpdateRoomAllotmentPayload,
  RoomAllotmentQueryParams,
  RoomTransferSettlePayload,
  StudentWalletBalance,
  StudentWalletTransaction,
  HostelHistoryEntry,
  RoomAllotmentPayment,
} from "./types";

export const RoomAllotmentsApi = {
  /**
   * Fetch a paginated list of room allotments matching query filters
   */
  getRoomAllotments: async (
    params: RoomAllotmentQueryParams = {}
  ): Promise<PaginatedResponse<RoomAllotment>> => {
    return await http.get<PaginatedResponse<RoomAllotment>>(
      API_ENDPOINTS.ROOM_ALLOTMENTS.LIST,
      { params: params as any }
    );
  },

  /**
   * Fetch a single room allotment by UUID
   */
  getRoomAllotmentById: async (id: string): Promise<RoomAllotment> => {
    return await http.get<RoomAllotment>(
      API_ENDPOINTS.ROOM_ALLOTMENTS.DETAIL(id)
    );
  },

  /**
   * Create a new room allotment record
   */
  createRoomAllotment: async (
    payload: CreateRoomAllotmentPayload
  ): Promise<RoomAllotment> => {
    return await http.post<RoomAllotment>(
      API_ENDPOINTS.ROOM_ALLOTMENTS.CREATE,
      payload
    );
  },

  /**
   * Update an existing room allotment
   */
  updateRoomAllotment: async (
    id: string,
    payload: UpdateRoomAllotmentPayload
  ): Promise<RoomAllotment> => {
    return await http.patch<RoomAllotment>(
      API_ENDPOINTS.ROOM_ALLOTMENTS.UPDATE(id),
      payload
    );
  },

  /**
   * Delete a room allotment record
   */
  deleteRoomAllotment: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      API_ENDPOINTS.ROOM_ALLOTMENTS.DELETE(id)
    );
  },

  /**
   * Settle a room transfer and distribute credits
   */
  settleRoomTransfer: async (payload: RoomTransferSettlePayload): Promise<any> => {
    return await http.post<any>(
      API_ENDPOINTS.ROOM_TRANSFERS.SETTLE,
      payload
    );
  },

  /**
   * Fetch student's wallet balance
   */
  getStudentWalletBalance: async (studentId: string): Promise<StudentWalletBalance> => {
    return await http.get<StudentWalletBalance>(
      API_ENDPOINTS.STUDENT_WALLETS.DETAIL(studentId)
    );
  },

  /**
   * Fetch student's wallet transactions
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
   * Fetch stay history matching filters
   */
  getHostelHistory: async (
    params: { room_allotment_id?: string; hostel_id?: string; page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<HostelHistoryEntry>> => {
    return await http.get<PaginatedResponse<HostelHistoryEntry>>(
      API_ENDPOINTS.HOSTEL_HISTORY.LIST,
      { params: params as any }
    );
  },

  /**
   * Fetch rent payment transactions
   */
  getRoomAllotmentPayments: async (
    params: { room_allotment_id?: string; student_id?: string; page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<RoomAllotmentPayment>> => {
    return await http.get<PaginatedResponse<RoomAllotmentPayment>>(
      API_ENDPOINTS.ROOM_ALLOTMENT_PAYMENTS.LIST,
      { params: params as any }
    );
  },

  /**
   * Helpers to retrieve list of hostels for dropdowns
   */
  getHostelsList: async (): Promise<Hostel[]> => {
    const res = await http.get<PaginatedResponse<Hostel>>(
      API_ENDPOINTS.HOSTELS.LIST,
      { params: { limit: 100 } }
    );
    return res.data;
  },

  /**
   * Helpers to retrieve list of students for dropdowns
   */
  getStudentsList: async (): Promise<Student[]> => {
    const res = await http.get<PaginatedResponse<Student>>(
      API_ENDPOINTS.STUDENTS.LIST,
      { params: { limit: 1000 } }
    );
    return res.data;
  },

  /**
   * Helpers to retrieve list of contracts for dropdowns
   */
  getHostelContractsList: async (studentId?: string): Promise<HostelContract[]> => {
    const params: any = { limit: 100 };
    if (studentId) {
      params.student_id = studentId;
    }
    const res = await http.get<PaginatedResponse<HostelContract>>(
      API_ENDPOINTS.HOSTEL_CONTRACTS.LIST,
      { params }
    );
    return res.data;
  },

  /**
   * Fetch floors for a hostel
   */
  getHostelFloorsList: async (hostelId: string): Promise<HostelFloor[]> => {
    const res = await http.get<PaginatedResponse<HostelFloor>>(
      API_ENDPOINTS.HOSTEL_FLOORS.BY_HOSTEL(hostelId)
    );
    return res.data;
  },

  /**
   * Fetch rooms on a specific floor
   */
  getFloorRoomsList: async (floorId: string): Promise<HostelRoom[]> => {
    const res = await http.get<PaginatedResponse<HostelRoom>>(
      API_ENDPOINTS.HOSTEL_ROOMS.LIST(floorId)
    );
    return res.data;
  },
};
