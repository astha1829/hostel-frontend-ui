import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { Hostel, HostelFloor, UpdateHostelPayload, HostelQueryParams, CreateHostelPayload } from "./types";
import { PaginatedResponse } from "@/types/api";

export const HostelApi = {
  /**
   * Fetches all hostels matching optional filters.
   */
  getHostels: async (params?: HostelQueryParams): Promise<PaginatedResponse<Hostel>> => {
    return await http.get<PaginatedResponse<Hostel>>(API_ENDPOINTS.HOSTELS.LIST, {
      params: params as any,
    });
  },

  /**
   * Creates a new hostel record.
   */
  createHostel: async (payload: CreateHostelPayload): Promise<Hostel> => {
    return await http.post<Hostel>(API_ENDPOINTS.HOSTELS.LIST, payload);
  },

  /**
   * Fetches a hostel record by its UUID.
   */
  getHostelById: async (id: string): Promise<Hostel> => {
    return await http.get<Hostel>(API_ENDPOINTS.HOSTELS.DETAIL(id));
  },

  /**
   * Updates a hostel record details.
   */
  updateHostel: async (id: string, payload: UpdateHostelPayload): Promise<Hostel> => {
    return await http.patch<Hostel>(API_ENDPOINTS.HOSTELS.UPDATE(id), payload);
  },

  /**
   * Deletes a hostel record.
   */
  deleteHostel: async (id: string): Promise<void> => {
    return await http.delete<void>(API_ENDPOINTS.HOSTELS.DETAIL(id));
  },

  /**
   * Fetches floors associated with a hostel by hostel UUID.
   * Leverages the NestJS pagination schema query params.
   */
  getHostelFloors: async (hostelId: string): Promise<PaginatedResponse<HostelFloor>> => {
    return await http.get<PaginatedResponse<HostelFloor>>(API_ENDPOINTS.HOSTEL_FLOORS.LIST, {
      params: { 
        hostel_id: hostelId,
        limit: 100, // Retrieve all floors for the dashboard page details
      },
    });
  },
};
