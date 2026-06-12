import { useState, useEffect, useCallback } from "react";
import { StudentsApi } from "../api";
import { CreateStudentPayload } from "../types";
import { Hostel } from "../../hostels/types";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

const initialFormState: CreateStudentPayload = {
  user_id: "",
  student_registration_id: "",
  student_name: "",
  last_name: "",
  college: "",
  course: "",
  student_type: "Regular",
  meal_type: "Veg",
  nationality: "",
  gender: "Male",
  date_of_birth: "",
  address: "",
  passport_no: "",
  student_email: "",
  parent_email: "",
  contact: "",
  parent_emergency_contact: "",
  local_mobile_no: "",
  alternative_contact: "",
  home_town: false,
  no_notification: false,
  arrival_datetime: "",
  passport_no_reviewed: false,
  passport_copy_reviewed: false,
  profile_picture_reviewed: false,
  student_mobile_verified: false,
  student_email_verified: false,
  parent_mobile_verified: false,
  parent_email_verified: false,
  kyc_verified: false,
  hostel_id: "",
};

interface UseStudentFormProps {
  onSuccess: (studentId: string) => void;
  onCancel: () => void;
}

export function useStudentForm({ onSuccess, onCancel }: UseStudentFormProps) {
  const [formData, setFormData] = useState<CreateStudentPayload>(initialFormState);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoadingHostels, setIsLoadingHostels] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File inputs state
  const [selectedFiles, setSelectedFiles] = useState<{
    profile_pic?: File | null;
    passport_image_1?: File | null;
    passport_image_2?: File | null;
  }>({});

  useEffect(() => {
    const loadHostels = async () => {
      setIsLoadingHostels(true);
      try {
        const list = await StudentsApi.getHostelsList();
        setHostels(list);
      } catch (err) {
        console.error("Failed to load hostels list:", err);
      } finally {
        setIsLoadingHostels(false);
      }
    };
    loadHostels();
  }, []);

  const handleInputChange = useCallback((field: keyof CreateStudentPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
    setApiError(null);
  }, []);

  const handleFileChange = useCallback((field: "profile_pic" | "passport_image_1" | "passport_image_2", file: File | null) => {
    setSelectedFiles((prev) => ({ ...prev, [field]: file }));
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.student_name.trim()) {
      errors.student_name = "Given name is required.";
    }
    if (!formData.college.trim()) {
      errors.college = "College/Institution is required.";
    }
    if (!formData.student_type.trim()) {
      errors.student_type = "Student enrollment type is required.";
    }
    if (!formData.nationality.trim()) {
      errors.nationality = "Nationality is required.";
    }
    if (!formData.passport_no.trim()) {
      errors.passport_no = "Passport number is required.";
    }

    // Email format checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.student_email && !emailRegex.test(formData.student_email)) {
      errors.student_email = "Invalid email format.";
    }
    if (formData.parent_email && !emailRegex.test(formData.parent_email)) {
      errors.parent_email = "Invalid email format.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = useCallback(() => {
    setFormData(initialFormState);
    setSelectedFiles({});
    setFieldErrors({});
    setApiError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);
    showLoading("Registering student...", "Please wait");

    try {
      const payload: CreateStudentPayload = { ...formData };
      
      // Clean up empty fields
      if (payload.hostel_id === "") {
        payload.hostel_id = undefined;
      }
      if (payload.date_of_birth === "") {
        payload.date_of_birth = undefined;
      }
      if (payload.arrival_datetime === "") {
        payload.arrival_datetime = undefined;
      }

      const created = await StudentsApi.createStudent(payload, selectedFiles);
      closeLoading();
      await showSuccess("Created Successfully", "Record has been created successfully.");
      onSuccess(created.id);
      handleReset();
    } catch (error: any) {
      closeLoading();
      const msg = error?.message || "Failed to register student record. Please verify fields and try again.";
      setApiError(msg);
      showError("Creation Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    hostels,
    isLoadingHostels,
    fieldErrors,
    apiError,
    isSubmitting,
    selectedFiles,
    handleInputChange,
    handleFileChange,
    handleReset,
    handleSubmit,
  };
}
