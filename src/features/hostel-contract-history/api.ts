import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import {
  HostelContractHistoryRow,
  CreateHostelContractHistoryPayload,
  UpdateHostelContractHistoryPayload,
  HostelContractHistoryQueryParams,
  StudentSummary,
} from "./types";

export const HostelContractHistoryApi = {
  /**
   * Fetch a paginated and filtered list of hostel contract history logs.
   */
  getHostelContractHistory: async (
    params: HostelContractHistoryQueryParams = {}
  ): Promise<PaginatedResponse<HostelContractHistoryRow>> => {
    return await http.get<PaginatedResponse<HostelContractHistoryRow>>(
      API_ENDPOINTS.HOSTEL_CONTRACT_HISTORY.LIST,
      { params: params as any }
    );
  },

  /**
   * Fetch a single hostel contract history record by ID.
   */
  getHostelContractHistoryById: async (id: string): Promise<HostelContractHistoryRow> => {
    return await http.get<HostelContractHistoryRow>(
      API_ENDPOINTS.HOSTEL_CONTRACT_HISTORY.DETAIL(id)
    );
  },

  /**
   * Create a new hostel contract history record.
   */
  createHostelContractHistory: async (
    payload: CreateHostelContractHistoryPayload
  ): Promise<HostelContractHistoryRow> => {
    return await http.post<HostelContractHistoryRow>(
      API_ENDPOINTS.HOSTEL_CONTRACT_HISTORY.CREATE,
      payload
    );
  },

  /**
   * Update an existing hostel contract history record.
   */
  updateHostelContractHistory: async (
    id: string,
    payload: UpdateHostelContractHistoryPayload
  ): Promise<HostelContractHistoryRow> => {
    return await http.patch<HostelContractHistoryRow>(
      API_ENDPOINTS.HOSTEL_CONTRACT_HISTORY.UPDATE(id),
      payload
    );
  },

  /**
   * Delete a hostel contract history record.
   */
  deleteHostelContractHistory: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      API_ENDPOINTS.HOSTEL_CONTRACT_HISTORY.DELETE(id)
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
};
