import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import { Hostel } from "../hostels/types";
import { Student } from "../students/types";
import {
  HostelContract,
  CreateHostelContractPayload,
  UpdateHostelContractPayload,
  HostelContractQueryParams,
  HostelContractEvent,
} from "./types";

export const HostelContractsApi = {
  /**
   * Fetch a list of hostel contracts (paginated and filtered)
   */
  getHostelContracts: async (
    params: HostelContractQueryParams = {}
  ): Promise<PaginatedResponse<HostelContract>> => {
    return await http.get<PaginatedResponse<HostelContract>>(
      API_ENDPOINTS.HOSTEL_CONTRACTS.LIST,
      { params: params as any }
    );
  },

  /**
   * Fetch a single hostel contract by UUID
   */
  getHostelContractById: async (id: string): Promise<HostelContract> => {
    return await http.get<HostelContract>(
      API_ENDPOINTS.HOSTEL_CONTRACTS.DETAIL(id)
    );
  },

  /**
   * Create a new hostel contract record
   */
  createHostelContract: async (
    payload: CreateHostelContractPayload
  ): Promise<HostelContract> => {
    return await http.post<HostelContract>(
      API_ENDPOINTS.HOSTEL_CONTRACTS.CREATE,
      payload
    );
  },

  /**
   * Update an existing hostel contract
   */
  updateHostelContract: async (
    id: string,
    payload: UpdateHostelContractPayload
  ): Promise<HostelContract> => {
    return await http.patch<HostelContract>(
      API_ENDPOINTS.HOSTEL_CONTRACTS.UPDATE(id),
      payload
    );
  },

  /**
   * Delete a hostel contract
   */
  deleteHostelContract: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      API_ENDPOINTS.HOSTEL_CONTRACTS.DELETE(id)
    );
  },

  /**
   * Helper to retrieve list of hostels for dropdowns
   */
  getHostelsList: async (): Promise<Hostel[]> => {
    const res = await http.get<PaginatedResponse<Hostel>>(
      API_ENDPOINTS.HOSTELS.LIST,
      { params: { limit: 100 } }
    );
    return res.data;
  },

  /**
   * Helper to retrieve list of students for dropdowns
   */
  getStudentsList: async (): Promise<Student[]> => {
    const res = await http.get<PaginatedResponse<Student>>(
      API_ENDPOINTS.STUDENTS.LIST,
      { params: { limit: 1000 } }
    );
    return res.data;
  },

  /**
   * Fetch contract events (amendments, extend, cancel) for the history timeline
   */
  getHostelContractEvents: async (contractId: string): Promise<HostelContractEvent[]> => {
    const res = await http.get<PaginatedResponse<HostelContractEvent>>(
      "/hostel-contract-events",
      { params: { target_hostel_contract_id: contractId, limit: 100 } }
    );
    return res.data;
  },
};
