import { useState, useEffect, useCallback, useRef } from "react";
import { RoomAllotmentPaymentsApi } from "../api";
import {
  CreateRoomAllotmentPaymentPayload,
  CreateRentPaymentReferencePayload,
  StudentSummary,
  RoomAllotmentSummary,
  ContractEventSummary,
  RentPayment,
} from "../types";
import { showDeleteSuccess, showDeleteError, showLoading, closeLoading, showSuccess, showError } from '@/utils/swal';

const initialFormState: CreateRoomAllotmentPaymentPayload = {
  room_allotment_id: "",
  student_id: "",
  transaction_type: "Rent Payment",
  total_amount: 0,
  rent_amount: 0,
  penalty_amount: 0,
  transaction_charge: 0,
  payment_status: "Pending",
  page_visited: false,
  posting_datetime: "",
  summary_json: null,
  target_room_allotment: "",
  contract_event_id: "",
  months: [],
};

interface UseRoomAllotmentPaymentFormProps {
  id?: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export function useRoomAllotmentPaymentForm({ id, onSuccess, onCancel }: UseRoomAllotmentPaymentFormProps) {
  const [formData, setFormData] = useState<CreateRoomAllotmentPaymentPayload>(initialFormState);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [allotments, setAllotments] = useState<RoomAllotmentSummary[]>([]);
  const [contractEvents, setContractEvents] = useState<ContractEventSummary[]>([]);
  const [availableRentPayments, setAvailableRentPayments] = useState<RentPayment[]>([]);
  const [originalPayment, setOriginalPayment] = useState<any>(null);

  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Keep a reference to prevent infinite loops during details mapping
  const isMappingRef = useRef(false);

  // Fetch initial general metadata (students list)
  useEffect(() => {
    const loadMetadata = async () => {
      setIsLoadingMetadata(true);
      try {
        const studentList = await RoomAllotmentPaymentsApi.getStudents();
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
        isMappingRef.current = true;
        const payment = await RoomAllotmentPaymentsApi.getRoomAllotmentPaymentById(id);
        setOriginalPayment(payment);
        
        let summaryText = "";
        if (payment.summary_json) {
          if (typeof payment.summary_json === "object" && payment.summary_json !== null) {
            summaryText = payment.summary_json.notes !== undefined 
              ? String(payment.summary_json.notes) 
              : JSON.stringify(payment.summary_json);
          } else {
            summaryText = String(payment.summary_json);
          }
        }

        const formattedDate = payment.posting_datetime 
          ? new Date(payment.posting_datetime).toISOString().slice(0, 16) 
          : "";

        setFormData({
          room_allotment_id: payment.room_allotment_id || "",
          student_id: payment.student_id || "",
          transaction_type: payment.transaction_type || "Rent Payment",
          total_amount: payment.total_amount || 0,
          rent_amount: payment.rent_amount || 0,
          penalty_amount: payment.penalty_amount || 0,
          transaction_charge: payment.transaction_charge || 0,
          payment_status: payment.payment_status || "Pending",
          page_visited: payment.page_visited || false,
          posting_datetime: formattedDate,
          summary_json: summaryText,
          target_room_allotment: payment.target_room_allotment || "",
          contract_event_id: payment.contract_event_id || "",
          months: payment.months.map((m) => ({
            rent_payment_id: m.rent_payment_id || "",
            month_label: m.month_label || "",
            rent_amount: m.rent_amount || 0,
            penalty_amount: m.penalty_amount || 0,
          })),
        });

        // Trigger loading of child lists for student and allotment
        const [studentAllotments, studentEvents, rentPayments] = await Promise.all([
          RoomAllotmentPaymentsApi.getRoomAllotments(payment.student_id),
          RoomAllotmentPaymentsApi.getHostelContractEvents(payment.student_id),
          RoomAllotmentPaymentsApi.getRentPayments({
            student_id: payment.student_id,
            room_allotment_id: payment.room_allotment_id,
          }),
        ]);

        setAllotments(studentAllotments);
        setContractEvents(studentEvents);

        // Filter: Keep unlinked rent payments OR rent payments linked to THIS payment
        const relevantRentPayments = rentPayments.filter(
          (rp) => !rp.room_allotment_payment_id || rp.room_allotment_payment_id === id
        );
        setAvailableRentPayments(relevantRentPayments);
      } catch (err: any) {
        setApiError(err.message || "Failed to load room allotment payment details.");
      } finally {
        setIsLoadingDetails(false);
        isMappingRef.current = false;
      }
    };

    loadPaymentDetails();
  }, [id]);

  // Load student related allotments and contract events when student changes
  const handleStudentChange = useCallback(async (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      student_id: studentId,
      room_allotment_id: "",
      contract_event_id: "",
      months: [],
    }));
    setAllotments([]);
    setContractEvents([]);
    setAvailableRentPayments([]);

    if (!studentId) return;

    try {
      const [studentAllotments, studentEvents] = await Promise.all([
        RoomAllotmentPaymentsApi.getRoomAllotments(studentId),
        RoomAllotmentPaymentsApi.getHostelContractEvents(studentId),
      ]);
      setAllotments(studentAllotments);
      setContractEvents(studentEvents);
    } catch (err) {
      console.error("Failed to load student related data:", err);
    }
  }, []);

  // Load rent payments when room allotment changes
  const handleRoomAllotmentChange = useCallback(async (allotmentId: string) => {
    setFormData((prev) => ({
      ...prev,
      room_allotment_id: allotmentId,
      months: [],
    }));
    setAvailableRentPayments([]);

    if (!allotmentId || !formData.student_id) return;

    try {
      const rentPayments = await RoomAllotmentPaymentsApi.getRentPayments({
        student_id: formData.student_id,
        room_allotment_id: allotmentId,
      });

      // Filter: In Create Mode, only show unlinked payments. In Edit Mode, show unlinked OR linked to this ID.
      const relevant = rentPayments.filter(
        (rp) => !rp.room_allotment_payment_id || rp.room_allotment_payment_id === id
      );
      setAvailableRentPayments(relevant);
    } catch (err) {
      console.error("Failed to load rent payments:", err);
    }
  }, [formData.student_id, id]);

  const handleInputChange = useCallback((field: keyof CreateRoomAllotmentPaymentPayload, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total amount if transaction charge changes
      if (field === "transaction_charge") {
        const charge = parseFloat(value) || 0;
        const rentSum = prev.rent_amount || 0;
        const penaltySum = prev.penalty_amount || 0;
        updated.total_amount = rentSum + penaltySum + charge;
      }
      
      // Auto-calculate total amount if manual adjustments are made
      if (field === "rent_amount" || field === "penalty_amount") {
        const charge = prev.transaction_charge || 0;
        const rentSum = field === "rent_amount" ? (parseFloat(value) || 0) : (prev.rent_amount || 0);
        const penaltySum = field === "penalty_amount" ? (parseFloat(value) || 0) : (prev.penalty_amount || 0);
        updated.total_amount = rentSum + penaltySum + charge;
      }

      return updated;
    });

    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
    setApiError(null);
  }, []);

  // Checkbox toggle linking a rent payment month
  const handleToggleMonth = useCallback((rentPayment: RentPayment) => {
    setFormData((prev) => {
      const currentMonths = prev.months ? [...prev.months] : [];
      const index = currentMonths.findIndex((m) => m.rent_payment_id === rentPayment.id);

      if (index > -1) {
        // Remove month link
        currentMonths.splice(index, 1);
      } else {
        // Add month link
        currentMonths.push({
          rent_payment_id: rentPayment.id,
          month_label: rentPayment.against_month,
          rent_amount: Number(rentPayment.amount) || 0,
          penalty_amount: 0, // default penalty is 0, user can adjust in the list if needed
        });
      }

      // Auto-calculate sums from linked months
      const rentSum = currentMonths.reduce((sum, m) => sum + (m.rent_amount || 0), 0);
      const penaltySum = currentMonths.reduce((sum, m) => sum + (m.penalty_amount || 0), 0);
      const charge = prev.transaction_charge || 0;

      return {
        ...prev,
        months: currentMonths,
        rent_amount: rentSum,
        penalty_amount: penaltySum,
        total_amount: rentSum + penaltySum + charge,
      };
    });
  }, []);

  // Update specific month penalty amount in linked months array
  const handleMonthPenaltyChange = useCallback((rentPaymentId: string, penaltyVal: number) => {
    setFormData((prev) => {
      const currentMonths = prev.months ? [...prev.months] : [];
      const updatedMonths = currentMonths.map((m) => {
        if (m.rent_payment_id === rentPaymentId) {
          return { ...m, penalty_amount: penaltyVal };
        }
        return m;
      });

      const rentSum = updatedMonths.reduce((sum, m) => sum + (m.rent_amount || 0), 0);
      const penaltySum = updatedMonths.reduce((sum, m) => sum + (m.penalty_amount || 0), 0);
      const charge = prev.transaction_charge || 0;

      return {
        ...prev,
        months: updatedMonths,
        penalty_amount: penaltySum,
        total_amount: rentSum + penaltySum + charge,
      };
    });
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.student_id) {
      errors.student_id = "Student is required.";
    }
    if (!formData.room_allotment_id) {
      errors.room_allotment_id = "Room Allotment is required.";
    }
    if (!formData.transaction_type.trim()) {
      errors.transaction_type = "Transaction Type is required.";
    }
    if (formData.total_amount <= 0) {
      errors.total_amount = "Total Amount must be a positive number.";
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
      const payload: CreateRoomAllotmentPaymentPayload = {
        room_allotment_id: formData.room_allotment_id,
        student_id: formData.student_id,
        transaction_type: formData.transaction_type,
        total_amount: Number(formData.total_amount),
        rent_amount: Number(formData.rent_amount) || 0,
        penalty_amount: Number(formData.penalty_amount) || 0,
        transaction_charge: Number(formData.transaction_charge) || 0,
        payment_status: formData.payment_status || "Pending",
        page_visited: !!formData.page_visited,
      };

      if (formData.posting_datetime) {
        payload.posting_datetime = new Date(formData.posting_datetime).toISOString();
      }
      
      if (formData.target_room_allotment) {
        payload.target_room_allotment = formData.target_room_allotment;
      }
      
      if (formData.contract_event_id) {
        payload.contract_event_id = formData.contract_event_id;
      }

      payload.summary_json = { notes: String(formData.summary_json || "") };

      if (formData.months && formData.months.length > 0) {
        payload.months = formData.months.map((m, index) => ({
          rent_payment_id: m.rent_payment_id,
          month_label: m.month_label,
          rent_amount: Number(m.rent_amount) || 0,
          penalty_amount: Number(m.penalty_amount) || 0,
          idx: index,
        }));
      } else {
        payload.months = [];
      }

      showLoading(id ? "Updating..." : "Creating...", "Please wait");
      let resultId = "";
      if (id) {
        const updated = await RoomAllotmentPaymentsApi.updateRoomAllotmentPayment(id, payload);
        resultId = updated.id;
        closeLoading();
        await showSuccess("Updated Successfully", "Changes have been saved successfully.");
      } else {
        const created = await RoomAllotmentPaymentsApi.createRoomAllotmentPayment(payload);
        resultId = created.id;
        closeLoading();
        await showSuccess("Created Successfully", "Record has been created successfully.");
      }

      onSuccess(resultId);
    } catch (error: any) {
      closeLoading();
      const msg = error?.message || "Failed to save room allotment payment record. Please verify fields and try again.";
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
    allotments,
    contractEvents,
    availableRentPayments,
    isLoadingMetadata,
    isLoadingDetails,
    isSubmitting,
    fieldErrors,
    apiError,
    handleStudentChange,
    handleRoomAllotmentChange,
    handleInputChange,
    handleToggleMonth,
    handleMonthPenaltyChange,
    handleSubmit,
  };
}
