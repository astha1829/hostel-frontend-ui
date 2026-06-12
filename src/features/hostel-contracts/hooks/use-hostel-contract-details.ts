import { useState, useEffect, useCallback } from "react";
import { HostelContractsApi } from "../api";
import { HostelContract, UpdateHostelContractPayload, HostelContractEvent } from "../types";
import { Hostel } from "../../hostels/types";
import { Student } from "../../students/types";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export const useHostelContractDetails = (id: string) => {
  const [contract, setContract] = useState<HostelContract | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<HostelContractEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inline edit state
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateHostelContractPayload>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [contractData, hostelsList, studentsList, eventsList] = await Promise.all([
        HostelContractsApi.getHostelContractById(id),
        HostelContractsApi.getHostelsList(),
        HostelContractsApi.getStudentsList(),
        HostelContractsApi.getHostelContractEvents(id).catch(() => []),
      ]);
      setContract(contractData);
      setHostels(hostelsList);
      setStudents(studentsList);
      setEvents(eventsList);

      // Populate initial form state
      setFormData({
        hostel_id: contractData.hostel_id,
        student_id: contractData.student_id,
        contract_type: contractData.contract_type,
        contract_no: contractData.contract_no,
        standard_duration_months: contractData.standard_duration_months,
        status: contractData.status,
        arrival_date: contractData.arrival_date || "",
        contract_start_date: contractData.contract_start_date,
        contract_end_date: contractData.contract_end_date || "",
        sharing: contractData.sharing || "",
        contract_price: contractData.contract_price,
        confirm_status: contractData.confirm_status || "",
        is_submitted: contractData.is_submitted,
      });
      setFormErrors({});
    } catch (err: any) {
      setError(err.message || "Failed to load contract details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, loadData]);

  const toggleEditMode = () => {
    if (isEditMode && contract) {
      // Reset changes
      setFormData({
        hostel_id: contract.hostel_id,
        student_id: contract.student_id,
        contract_type: contract.contract_type,
        contract_no: contract.contract_no,
        standard_duration_months: contract.standard_duration_months,
        status: contract.status,
        arrival_date: contract.arrival_date || "",
        contract_start_date: contract.contract_start_date,
        contract_end_date: contract.contract_end_date || "",
        sharing: contract.sharing || "",
        contract_price: contract.contract_price,
        confirm_status: contract.confirm_status || "",
        is_submitted: contract.is_submitted,
      });
      setFormErrors({});
    }
    setIsEditMode(!isEditMode);
    setSuccessMessage(null);
  };

  const handleInputChange = (field: keyof UpdateHostelContractPayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error
    if (formErrors[field]) {
      setFormErrors((prev) => {
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

    // Date validate
    if (formData.contract_start_date && formData.contract_end_date) {
      const start = new Date(formData.contract_start_date);
      const end = new Date(formData.contract_end_date);
      if (start > end) {
        tempErrors.contract_end_date = "End date cannot be before start date.";
      }
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
      const payload = { ...formData };

      if (payload.contract_price !== undefined) {
        payload.contract_price = Number(payload.contract_price);
      }
      if (payload.standard_duration_months !== undefined && payload.standard_duration_months !== null) {
        const valStr = String(payload.standard_duration_months).trim();
        payload.standard_duration_months = valStr !== "" ? Number(valStr) : undefined;
      }

      const updated = await HostelContractsApi.updateHostelContract(id, payload);
      closeLoading();
      setContract(updated);
      setIsEditMode(false);
      setSuccessMessage("Hostel contract updated successfully.");
      await showSuccess("Updated Successfully", "Changes have been saved successfully.");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      closeLoading();
      setError(err.message || "Failed to update contract.");
      showError("Update Failed", err.message || "Failed to update contract.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    contract,
    hostels,
    students,
    events,
    isLoading,
    isSaving,
    error,
    isEditMode,
    formData,
    formErrors,
    successMessage,
    toggleEditMode,
    handleInputChange,
    saveChanges,
    reload: loadData,
  };
};
