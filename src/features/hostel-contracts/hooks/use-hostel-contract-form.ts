import { useState, useEffect } from "react";
import { HostelContractsApi } from "../api";
import { CreateHostelContractPayload } from "../types";
import { Hostel } from "../../hostels/types";
import { Student } from "../../students/types";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

interface UseHostelContractFormProps {
  onSuccess: (id: string) => void;
  onCancel: () => void;
}

export const useHostelContractForm = ({ onSuccess, onCancel }: UseHostelContractFormProps) => {
  const [formData, setFormData] = useState<CreateHostelContractPayload>({
    hostel_id: "",
    student_id: "",
    contract_type: "Regular",
    contract_no: "",
    standard_duration_months: 12,
    status: "Active",
    arrival_date: "",
    contract_start_date: new Date().toISOString().substring(0, 10),
    contract_end_date: "",
    sharing: "Single",
    contract_price: 500,
    confirm_status: "Pending",
    is_submitted: false,
  });

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [hostelsList, studentsList] = await Promise.all([
          HostelContractsApi.getHostelsList(),
          HostelContractsApi.getStudentsList(),
        ]);
        setHostels(hostelsList);
        setStudents(studentsList);

        // Auto assign first values if available
        if (hostelsList.length > 0 && !formData.hostel_id) {
          setFormData((prev) => ({ ...prev, hostel_id: hostelsList[0].id }));
        }
        if (studentsList.length > 0 && !formData.student_id) {
          setFormData((prev) => ({ ...prev, student_id: studentsList[0].id }));
        }
      } catch (err: any) {
        console.error("Failed to load options", err);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  const handleInputChange = (field: keyof CreateHostelContractPayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};

    if (!formData.hostel_id) tempErrors.hostel_id = "Hostel is required.";
    if (!formData.student_id) tempErrors.student_id = "Student is required.";
    if (!formData.contract_type?.trim()) tempErrors.contract_type = "Contract type is required.";
    if (!formData.contract_no?.trim()) tempErrors.contract_no = "Contract number is required.";
    if (!formData.status) tempErrors.status = "Status is required.";
    if (!formData.contract_start_date) tempErrors.contract_start_date = "Start date is required.";

    if (formData.contract_start_date && formData.contract_end_date) {
      const start = new Date(formData.contract_start_date);
      const end = new Date(formData.contract_end_date);
      if (start > end) {
        tempErrors.contract_end_date = "End date cannot be before start date.";
      }
    }

    setFieldErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setApiError(null);
    showLoading("Creating contract...", "Please wait");

    try {
      const payload = { ...formData };

      if (payload.contract_price !== undefined) {
        payload.contract_price = Number(payload.contract_price);
      }
      if (payload.standard_duration_months !== undefined && payload.standard_duration_months !== null) {
        const valStr = String(payload.standard_duration_months).trim();
        payload.standard_duration_months = valStr !== "" ? Number(valStr) : undefined;
      }

      const res = await HostelContractsApi.createHostelContract(payload);
      closeLoading();
      await showSuccess("Created Successfully", "Record has been created successfully.");
      onSuccess(res.id);
    } catch (err: any) {
      closeLoading();
      setApiError(err.message || "Failed to create contract.");
      showError("Creation Failed", err.message || "Failed to create contract.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    hostels,
    students,
    isLoadingOptions,
    fieldErrors,
    apiError,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  };
};
