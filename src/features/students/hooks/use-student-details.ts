import { useState, useEffect, useCallback } from "react";
import { StudentsApi } from "../api";
import { Student, UpdateStudentPayload } from "../types";
import { Hostel } from "../../hostels/types";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export const useStudentDetails = (id: string) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In-place inline edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateStudentPayload>({});
  const [selectedFiles, setSelectedFiles] = useState<{
    profile_pic?: File | null;
    passport_image_1?: File | null;
    passport_image_2?: File | null;
  }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadStudentData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [studentData, hostelsList] = await Promise.all([
        StudentsApi.getStudentById(id),
        StudentsApi.getHostelsList(),
      ]);
      setStudent(studentData);
      setHostels(hostelsList);
      
      // Initialize form state
      setFormData({
        user_id: studentData.user_id || "",
        student_registration_id: studentData.student_registration_id || "",
        student_name: studentData.student_name,
        last_name: studentData.last_name || "",
        college: studentData.college,
        course: studentData.course || "",
        student_type: studentData.student_type,
        meal_type: studentData.meal_type || "",
        nationality: studentData.nationality,
        gender: studentData.gender || "",
        date_of_birth: studentData.date_of_birth ? studentData.date_of_birth.substring(0, 10) : "",
        address: studentData.address || "",
        passport_no: studentData.passport_no,
        student_email: studentData.student_email || "",
        parent_email: studentData.parent_email || "",
        contact: studentData.contact || "",
        parent_emergency_contact: studentData.parent_emergency_contact || "",
        local_mobile_no: studentData.local_mobile_no || "",
        alternative_contact: studentData.alternative_contact || "",
        home_town: studentData.home_town,
        no_notification: studentData.no_notification,
        arrival_datetime: studentData.arrival_datetime ? new Date(studentData.arrival_datetime).toISOString().slice(0, 16) : "",
        passport_no_reviewed: studentData.passport_no_reviewed,
        passport_copy_reviewed: studentData.passport_copy_reviewed,
        profile_picture_reviewed: studentData.profile_picture_reviewed,
        student_mobile_verified: studentData.student_mobile_verified,
        student_email_verified: studentData.student_email_verified,
        parent_mobile_verified: studentData.parent_mobile_verified,
        parent_email_verified: studentData.parent_email_verified,
        kyc_verified: studentData.kyc_verified,
        hostel_id: studentData.hostel_id || "",
      });
      setSelectedFiles({});
      setFormErrors({});
    } catch (err: any) {
      setError(err.message || "Failed to load student record details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadStudentData();
    }
  }, [id, loadStudentData]);

  const toggleEditMode = () => {
    if (isEditMode && student) {
      // Revert edit changes
      setFormData({
        user_id: student.user_id || "",
        student_registration_id: student.student_registration_id || "",
        student_name: student.student_name,
        last_name: student.last_name || "",
        college: student.college,
        course: student.course || "",
        student_type: student.student_type,
        meal_type: student.meal_type || "",
        nationality: student.nationality,
        gender: student.gender || "",
        date_of_birth: student.date_of_birth ? student.date_of_birth.substring(0, 10) : "",
        address: student.address || "",
        passport_no: student.passport_no,
        student_email: student.student_email || "",
        parent_email: student.parent_email || "",
        contact: student.contact || "",
        parent_emergency_contact: student.parent_emergency_contact || "",
        local_mobile_no: student.local_mobile_no || "",
        alternative_contact: student.alternative_contact || "",
        home_town: student.home_town,
        no_notification: student.no_notification,
        arrival_datetime: student.arrival_datetime ? new Date(student.arrival_datetime).toISOString().slice(0, 16) : "",
        passport_no_reviewed: student.passport_no_reviewed,
        passport_copy_reviewed: student.passport_copy_reviewed,
        profile_picture_reviewed: student.profile_picture_reviewed,
        student_mobile_verified: student.student_mobile_verified,
        student_email_verified: student.student_email_verified,
        parent_mobile_verified: student.parent_mobile_verified,
        parent_email_verified: student.parent_email_verified,
        kyc_verified: student.kyc_verified,
        hostel_id: student.hostel_id || "",
      });
      setSelectedFiles({});
      setFormErrors({});
    }
    setIsEditMode(!isEditMode);
    setSuccessMessage(null);
  };

  const handleInputChange = (field: keyof UpdateStudentPayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field-level error
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFileChange = (field: "profile_pic" | "passport_image_1" | "passport_image_2", file: File | null) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};
    
    if (!formData.student_name?.trim()) {
      tempErrors.student_name = "Given name is required.";
    }
    if (!formData.college?.trim()) {
      tempErrors.college = "College/Institution is required.";
    }
    if (!formData.student_type?.trim()) {
      tempErrors.student_type = "Student enrollment type is required.";
    }
    if (!formData.nationality?.trim()) {
      tempErrors.nationality = "Nationality is required.";
    }
    if (!formData.passport_no?.trim()) {
      tempErrors.passport_no = "Passport number is required.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.student_email && !emailRegex.test(formData.student_email)) {
      tempErrors.student_email = "Invalid student email format.";
    }
    if (formData.parent_email && !emailRegex.test(formData.parent_email)) {
      tempErrors.parent_email = "Invalid parent email format.";
    }

    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const saveChanges = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    showLoading("Saving changes...", "Please wait");
    try {
      const payload: UpdateStudentPayload = { ...formData };
      
      // Clean up empty strings or values
      if (payload.hostel_id === "") {
        payload.hostel_id = undefined;
      }
      
      const updated = await StudentsApi.updateStudent(id, payload, selectedFiles);
      closeLoading();
      setStudent(updated);
      setIsEditMode(false);
      setSuccessMessage("Student record updated successfully.");
      await showSuccess("Updated Successfully", "Changes have been saved successfully.");
      
      // Auto clear success banner
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      closeLoading();
      setError(err.message || "Failed to save student profile changes.");
      showError("Update Failed", err.message || "Failed to save student profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    student,
    hostels,
    isLoading,
    isSaving,
    error,
    isEditMode,
    formData,
    selectedFiles,
    formErrors,
    successMessage,
    toggleEditMode,
    handleInputChange,
    handleFileChange,
    saveChanges,
    reload: loadStudentData,
  };
};
