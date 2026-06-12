import { Hostel } from "../hostels/types";

export interface Student {
  id: string; // Database UUID
  user_id?: string;
  student_registration_id?: string;
  student_name: string;
  last_name?: string;
  college: string;
  course?: string;
  student_type: string;
  meal_type?: string;
  nationality: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  passport_no: string;
  profile_pic?: string;
  passport_image_1?: string;
  passport_image_2?: string;
  student_email?: string;
  parent_email?: string;
  contact?: string;
  parent_emergency_contact?: string;
  local_mobile_no?: string;
  alternative_contact?: string;
  home_town: boolean;
  no_notification: boolean;
  arrival_datetime?: string;
  passport_no_reviewed: boolean;
  passport_copy_reviewed: boolean;
  profile_picture_reviewed: boolean;
  student_mobile_verified: boolean;
  student_email_verified: boolean;
  parent_mobile_verified: boolean;
  parent_email_verified: boolean;
  reviewed_on?: string;
  reviewed_by?: string;
  kyc_verified: boolean;
  hostel_id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  hostel?: Hostel;
}

export interface CreateStudentPayload {
  user_id?: string;
  student_registration_id?: string;
  student_name: string;
  last_name?: string;
  college: string;
  course?: string;
  student_type: string;
  meal_type?: string;
  nationality: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  passport_no: string;
  profile_pic?: string;
  passport_image_1?: string;
  passport_image_2?: string;
  student_email?: string;
  parent_email?: string;
  contact?: string;
  parent_emergency_contact?: string;
  local_mobile_no?: string;
  alternative_contact?: string;
  home_town?: boolean;
  no_notification?: boolean;
  arrival_datetime?: string;
  passport_no_reviewed?: boolean;
  passport_copy_reviewed?: boolean;
  profile_picture_reviewed?: boolean;
  student_mobile_verified?: boolean;
  student_email_verified?: boolean;
  parent_mobile_verified?: boolean;
  parent_email_verified?: boolean;
  reviewed_on?: string;
  reviewed_by?: string;
  kyc_verified?: boolean;
  hostel_id?: string;
}

export interface UpdateStudentPayload extends Partial<CreateStudentPayload> {}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  student_name?: string;
  passport_no?: string;
  college?: string;
  course?: string;
  student_type?: string;
  nationality?: string;
  gender?: string;
  hostel_id?: string;
  kyc_verified?: boolean;
  no_notification?: boolean;
  student_registration_id?: string;
}
