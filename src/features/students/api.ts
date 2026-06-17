import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import { Hostel } from "../hostels/types";
import {
  Student,
  CreateStudentPayload,
  UpdateStudentPayload,
  StudentQueryParams,
} from "./types";

export const StudentsApi = {
  /**
   * Fetches a paginated and filtered list of students.
   */
  getStudents: async (
    params: StudentQueryParams = {}
  ): Promise<PaginatedResponse<Student>> => {
    return await http.get<PaginatedResponse<Student>>(
      API_ENDPOINTS.STUDENTS.LIST,
      { params: params as any }
    );
  },

  /**
   * Fetches a single student details by UUID.
   */
  getStudentById: async (id: string): Promise<Student> => {
    return await http.get<Student>(API_ENDPOINTS.STUDENTS.DETAIL(id));
  },

  /**
   * Registers a new student with file uploads (profile pic, passport pages).
   */
  createStudent: async (
    payload: CreateStudentPayload,
    files: {
      profile_pic?: File | null;
      passport_image_1?: File | null;
      passport_image_2?: File | null;
      passport?: File | null;
    }
  ): Promise<Student> => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    if (files.profile_pic) {
      formData.append("profile_pic", files.profile_pic);
    }
    if (files.passport_image_1) {
      formData.append("passport_image_1", files.passport_image_1);
    }
    if (files.passport_image_2) {
      formData.append("passport_image_2", files.passport_image_2);
    }
    if (files.passport) {
      formData.append("passport", files.passport);
    }

    return await http.post<Student>(API_ENDPOINTS.STUDENTS.CREATE, formData);
  },

  /**
   * Updates student details with optional file uploads.
   */
  updateStudent: async (
    id: string,
    payload: UpdateStudentPayload,
    files: {
      profile_pic?: File | null;
      passport_image_1?: File | null;
      passport_image_2?: File | null;
      passport?: File | null;
    }
  ): Promise<Student> => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    if (files.profile_pic) {
      formData.append("profile_pic", files.profile_pic);
    }
    if (files.passport_image_1) {
      formData.append("passport_image_1", files.passport_image_1);
    }
    if (files.passport_image_2) {
      formData.append("passport_image_2", files.passport_image_2);
    }
    if (files.passport) {
      formData.append("passport", files.passport);
    }

    return await http.patch<Student>(
      API_ENDPOINTS.STUDENTS.UPDATE(id),
      formData
    );
  },

  /**
   * Deletes a student profile.
   */
  deleteStudent: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      API_ENDPOINTS.STUDENTS.DELETE(id)
    );
  },

  /**
   * Fetches hostels list to display in select dropdowns.
   */
  getHostelsList: async (): Promise<Hostel[]> => {
    const res = await http.get<PaginatedResponse<Hostel>>(
      API_ENDPOINTS.HOSTELS.LIST,
      { params: { limit: 100 } }
    );
    return res.data;
  },
};
