import { useState, useEffect, useCallback } from "react";
import { HostelContractEventsApi } from "../api";
import {
  CreateHostelContractEventPayload,
  StudentSummary,
  HostelContractSummary,
  RoomAllotmentSummary,
  RoomAllotmentPaymentSummary,
} from "../types";
import { showDeleteSuccess, showDeleteError, showLoading, closeLoading, showSuccess, showError } from '@/utils/swal';

const initialFormState: CreateHostelContractEventPayload = {
  student_id: "",
  action_type: "Create",
  event_status: "Confirmed",
  contract_type_before: "",
  contract_type_after: "",
  source_hostel_contract_id: "",
  target_hostel_contract_id: "",
  source_room_allotment_id: "",
  target_room_allotment_id: "",
  triggered_by: "system",
  triggered_on: "",
  effective_date: "",
  settlement_rap: "",
};

interface UseHostelContractEventFormProps {
  id?: string;
  onSuccess: (eventId: string) => void;
  onCancel: () => void;
}

export function useHostelContractEventForm({ id, onSuccess, onCancel }: UseHostelContractEventFormProps) {
  const [formData, setFormData] = useState<CreateHostelContractEventPayload>(initialFormState);

  // Lookup lists
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [contracts, setContracts] = useState<HostelContractSummary[]>([]);
  const [allotments, setAllotments] = useState<RoomAllotmentSummary[]>([]);
  const [allotmentPayments, setAllotmentPayments] = useState<RoomAllotmentPaymentSummary[]>([]);

  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch initial general metadata (students list)
  useEffect(() => {
    const loadMetadata = async () => {
      setIsLoadingMetadata(true);
      try {
        const studentList = await HostelContractEventsApi.getStudents();
        setStudents(studentList);
      } catch (err) {
        console.error("Failed to load students metadata list:", err);
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    loadMetadata();
  }, []);

  // Fetch details if in Edit Mode
  useEffect(() => {
    if (!id) return;

    const loadEventDetails = async () => {
      setIsLoadingDetails(true);
      setApiError(null);
      try {
        const event = await HostelContractEventsApi.getHostelContractEventById(id);

        const formattedTriggeredOn = event.triggered_on
          ? new Date(event.triggered_on).toISOString().slice(0, 16)
          : "";

        setFormData({
          student_id: event.student_id || "",
          action_type: event.action_type || "Create",
          event_status: event.event_status || "Confirmed",
          contract_type_before: event.contract_type_before || "",
          contract_type_after: event.contract_type_after || "",
          source_hostel_contract_id: event.source_hostel_contract_id || "",
          target_hostel_contract_id: event.target_hostel_contract_id || "",
          source_room_allotment_id: event.source_room_allotment_id || "",
          target_room_allotment_id: event.target_room_allotment_id || "",
          triggered_by: event.triggered_by || "system",
          triggered_on: formattedTriggeredOn,
          effective_date: event.effective_date || "",
          settlement_rap: event.settlement_rap || "",
        });

        // Trigger loading of child lists for student
        const [studentContracts, studentAllotments, studentPayments] = await Promise.all([
          HostelContractEventsApi.getHostelContracts(event.student_id),
          HostelContractEventsApi.getRoomAllotments(event.student_id),
          HostelContractEventsApi.getRoomAllotmentPayments(event.student_id),
        ]);

        setContracts(studentContracts);
        setAllotments(studentAllotments);
        setAllotmentPayments(studentPayments);
      } catch (err: any) {
        setApiError(err.message || "Failed to load hostel contract event details.");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    loadEventDetails();
  }, [id]);

  // Load student related details dynamically when student changes
  const handleStudentChange = useCallback(async (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      student_id: studentId,
      source_hostel_contract_id: "",
      target_hostel_contract_id: "",
      source_room_allotment_id: "",
      target_room_allotment_id: "",
      settlement_rap: "",
    }));
    setContracts([]);
    setAllotments([]);
    setAllotmentPayments([]);

    if (!studentId) return;

    try {
      const [studentContracts, studentAllotments, studentPayments] = await Promise.all([
        HostelContractEventsApi.getHostelContracts(studentId),
        HostelContractEventsApi.getRoomAllotments(studentId),
        HostelContractEventsApi.getRoomAllotmentPayments(studentId),
      ]);
      setContracts(studentContracts);
      setAllotments(studentAllotments);
      setAllotmentPayments(studentPayments);
    } catch (err) {
      console.error("Failed to load student context lists:", err);
    }
  }, []);

  const handleInputChange = useCallback((field: keyof CreateHostelContractEventPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
    setApiError(null);
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.student_id) {
      errors.student_id = "Student is required.";
    }
    if (!formData.action_type) {
      errors.action_type = "Action Type is required.";
    }
    if (!formData.event_status) {
      errors.event_status = "Event Status is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const payload: CreateHostelContractEventPayload = {
        student_id: formData.student_id,
        action_type: formData.action_type,
        event_status: formData.event_status,
        contract_type_before: formData.contract_type_before || undefined,
        contract_type_after: formData.contract_type_after || undefined,
        source_hostel_contract_id: formData.source_hostel_contract_id || null,
        target_hostel_contract_id: formData.target_hostel_contract_id || null,
        source_room_allotment_id: formData.source_room_allotment_id || null,
        target_room_allotment_id: formData.target_room_allotment_id || null,
        triggered_by: formData.triggered_by || undefined,
        triggered_on: formData.triggered_on ? new Date(formData.triggered_on).toISOString() : undefined,
        effective_date: formData.effective_date || undefined,
        settlement_rap: formData.settlement_rap || null,
      };

      showLoading(id ? "Updating..." : "Creating...", "Please wait");
      let resultId = "";
      if (id) {
        const updated = await HostelContractEventsApi.updateHostelContractEvent(id, payload);
        resultId = updated.id;
        closeLoading();
        await showSuccess("Updated Successfully", "Changes have been saved successfully.");
      } else {
        const created = await HostelContractEventsApi.createHostelContractEvent(payload);
        resultId = created.id;
        closeLoading();
        await showSuccess("Created Successfully", "Record has been created successfully.");
      }

      onSuccess(resultId);
    } catch (error: any) {
      closeLoading();
      const msg = error?.message || "Failed to save contract event. Please verify fields.";
      setApiError(msg);
      showError(id ? "Update Failed" : "Creation Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    students,
    contracts,
    allotments,
    allotmentPayments,
    isLoadingMetadata,
    isLoadingDetails,
    isSubmitting,
    fieldErrors,
    apiError,
    handleStudentChange,
    handleInputChange,
    handleSubmit,
  };
}
