import { useState, useEffect, useCallback } from "react";
import { RentPaymentsApi } from "../api";
import {
  CreateRentPaymentPayload,
  StudentSummary,
  HostelContractSummary,
  RoomAllotmentSummary,
  RoomAllotmentPaymentSummary,
  HostelContractEventSummary,
} from "../types";
import { showDeleteSuccess, showDeleteError, showLoading, closeLoading, showSuccess, showError } from '@/utils/swal';

const initialFormState: CreateRentPaymentPayload = {
  student_id: "",
  hostel_contract_id: "",
  room_allotment_id: "",
  name: "",
  against_month: "",
  posting_datetime: "",
  transaction_type: "Rent Payment",
  direction: "credit",
  amount: 0,
  entry_key: "",
  room_allotment_payment_id: "",
  hostel_contract_event_id: "",
  reference_doctype: "",
  reference_name: "",
  remarks: "",
};

interface UseRentPaymentFormProps {
  id?: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export function useRentPaymentForm({ id, onSuccess, onCancel }: UseRentPaymentFormProps) {
  const [formData, setFormData] = useState<CreateRentPaymentPayload>(initialFormState);
  
  // Lists State
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [contracts, setContracts] = useState<HostelContractSummary[]>([]);
  const [allotments, setAllotments] = useState<RoomAllotmentSummary[]>([]);
  const [allotmentPayments, setAllotmentPayments] = useState<RoomAllotmentPaymentSummary[]>([]);
  const [contractEvents, setContractEvents] = useState<HostelContractEventSummary[]>([]);

  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [originalPayment, setOriginalPayment] = useState<any>(null);

  // Fetch initial general metadata (students list)
  useEffect(() => {
    const loadMetadata = async () => {
      setIsLoadingMetadata(true);
      try {
        const studentList = await RentPaymentsApi.getStudents();
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

    const loadPaymentDetails = async () => {
      setIsLoadingDetails(true);
      setApiError(null);
      try {
        const payment = await RentPaymentsApi.getRentPaymentById(id);
        setOriginalPayment(payment);
        
        const formattedDate = payment.posting_datetime 
          ? new Date(payment.posting_datetime).toISOString().slice(0, 16) 
          : "";

        setFormData({
          student_id: payment.student_id || "",
          hostel_contract_id: payment.hostel_contract_id || "",
          room_allotment_id: payment.room_allotment_id || "",
          name: payment.name || "",
          against_month: payment.against_month || "",
          posting_datetime: formattedDate,
          transaction_type: payment.transaction_type || "Rent Payment",
          direction: payment.direction || "credit",
          amount: payment.amount || 0,
          entry_key: payment.entry_key || "",
          room_allotment_payment_id: payment.room_allotment_payment_id || "",
          hostel_contract_event_id: payment.hostel_contract_event_id || "",
          reference_doctype: payment.reference_doctype || "",
          reference_name: payment.reference_name || "",
          remarks: payment.remarks || "",
        });

        // Trigger loading of child lists for student
        const [studentContracts, studentAllotments, studentPayments, studentEvents] = await Promise.all([
          RentPaymentsApi.getHostelContracts(payment.student_id),
          RentPaymentsApi.getRoomAllotments(payment.student_id),
          RentPaymentsApi.getRoomAllotmentPayments(payment.student_id),
          RentPaymentsApi.getHostelContractEvents(payment.student_id),
        ]);

        setContracts(studentContracts);
        setAllotments(studentAllotments);
        setAllotmentPayments(studentPayments);
        setContractEvents(studentEvents);
      } catch (err: any) {
        setApiError(err.message || "Failed to load rent payment details.");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    loadPaymentDetails();
  }, [id]);

  // Load student related details dynamically when student changes
  const handleStudentChange = useCallback(async (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      student_id: studentId,
      hostel_contract_id: "",
      room_allotment_id: "",
      room_allotment_payment_id: "",
      hostel_contract_event_id: "",
    }));
    setContracts([]);
    setAllotments([]);
    setAllotmentPayments([]);
    setContractEvents([]);

    if (!studentId) return;

    try {
      const [studentContracts, studentAllotments, studentPayments, studentEvents] = await Promise.all([
        RentPaymentsApi.getHostelContracts(studentId),
        RentPaymentsApi.getRoomAllotments(studentId),
        RentPaymentsApi.getRoomAllotmentPayments(studentId),
        RentPaymentsApi.getHostelContractEvents(studentId),
      ]);
      setContracts(studentContracts);
      setAllotments(studentAllotments);
      setAllotmentPayments(studentPayments);
      setContractEvents(studentEvents);
    } catch (err) {
      console.error("Failed to load student context lists:", err);
    }
  }, []);

  const handleInputChange = useCallback((field: keyof CreateRentPaymentPayload, value: any) => {
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
    if (!formData.hostel_contract_id) {
      errors.hostel_contract_id = "Hostel Contract is required.";
    }
    if (!formData.room_allotment_id) {
      errors.room_allotment_id = "Room Allotment is required.";
    }
    if (!formData.against_month.trim()) {
      errors.against_month = "Against Month is required.";
    } else {
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(formData.against_month)) {
        errors.against_month = "Month format must be YYYY-MM.";
      }
    }
    if (!formData.posting_datetime) {
      errors.posting_datetime = "Posting Date/Time is required.";
    }
    if (!formData.direction) {
      errors.direction = "Direction is required.";
    }
    if (formData.amount <= 0) {
      errors.amount = "Amount must be a positive number.";
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
      const payload: CreateRentPaymentPayload = {
        student_id: formData.student_id,
        hostel_contract_id: formData.hostel_contract_id,
        room_allotment_id: formData.room_allotment_id,
        against_month: formData.against_month,
        posting_datetime: new Date(formData.posting_datetime).toISOString(),
        transaction_type: formData.transaction_type || "Rent Payment",
        direction: formData.direction,
        amount: Number(formData.amount),
        remarks: formData.remarks || undefined,
      };

      if (formData.name) {
        payload.name = formData.name;
      }
      if (formData.entry_key) {
        payload.entry_key = formData.entry_key;
      }
      if (formData.room_allotment_payment_id) {
        payload.room_allotment_payment_id = formData.room_allotment_payment_id;
      }
      if (formData.hostel_contract_event_id) {
        payload.hostel_contract_event_id = formData.hostel_contract_event_id;
      }
      if (formData.reference_doctype) {
        payload.reference_doctype = formData.reference_doctype;
      }
      if (formData.reference_name) {
        payload.reference_name = formData.reference_name;
      }

      showLoading(id ? "Updating..." : "Creating...", "Please wait");
      let resultId = "";
      if (id) {
        const updated = await RentPaymentsApi.updateRentPayment(id, payload);
        resultId = updated.id;
        closeLoading();
        await showSuccess("Updated Successfully", "Changes have been saved successfully.");
      } else {
        const created = await RentPaymentsApi.createRentPayment(payload);
        resultId = created.id;
        closeLoading();
        await showSuccess("Created Successfully", "Record has been created successfully.");
      }

      onSuccess(resultId);
    } catch (error: any) {
      closeLoading();
      const msg = error?.message || "Failed to save rent payment transaction entry. Please verify fields.";
      setApiError(msg);
      showError(id ? "Update Failed" : "Creation Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    originalPayment,
    students,
    contracts,
    allotments,
    allotmentPayments,
    contractEvents,
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
