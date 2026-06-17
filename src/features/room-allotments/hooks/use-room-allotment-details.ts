import { useState, useEffect, useCallback } from "react";
import { RoomAllotmentsApi } from "../api";
import { HostelFloorsApi } from "../../hostel-floors/api";
import {
  RoomAllotment,
  UpdateRoomAllotmentPayload,
  RoomAllotmentPayment,
  HostelHistoryEntry,
  StudentWalletBalance,
  StudentWalletTransaction,
  RoomTransferSettlePayload,
} from "../types";
import { Hostel } from "../../hostels/types";
import { Student } from "../../students/types";
import { HostelContract } from "../../hostel-contracts/types";
import { HostelFloor } from "../../hostel-floors/types";
import { HostelRoom } from "../../rooms/types";
import { showDeleteSuccess, showDeleteError, showLoading, closeLoading, showSuccess, showError } from '@/utils/swal';

export const useRoomAllotmentDetails = (id: string) => {
  const [allotment, setAllotment] = useState<RoomAllotment | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [contracts, setContracts] = useState<HostelContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tab Data States
  const [payments, setPayments] = useState<RoomAllotmentPayment[]>([]);
  const [history, setHistory] = useState<HostelHistoryEntry[]>([]);
  const [wallet, setWallet] = useState<StudentWalletBalance | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<StudentWalletTransaction[]>([]);

  // Inline Edit State
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateRoomAllotmentPayload>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dependent dropdowns state for edit mode
  const [floors, setFloors] = useState<HostelFloor[]>([]);
  const [rooms, setRooms] = useState<HostelRoom[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allotmentData = await RoomAllotmentsApi.getRoomAllotmentById(id);
      setAllotment(allotmentData);

      setFormData({
        hostel_id: allotmentData.hostel_id,
        student_id: allotmentData.student_id,
        hostel_contract_id: allotmentData.hostel_contract_id,
        floor_no: allotmentData.floor_no,
        room_no: allotmentData.room_no,
        rent: allotmentData.rent || undefined,
        status: allotmentData.status,
        remarks: allotmentData.remarks,
        add_transaction_charge: allotmentData.add_transaction_charge,
      });

      const [
        hostelsList,
        studentsList,
        contractsList,
        paymentsRes,
        historyRes,
        walletRes,
        walletTxRes
      ] = await Promise.all([
        RoomAllotmentsApi.getHostelsList().catch(() => []),
        RoomAllotmentsApi.getStudentsList().catch(() => []),
        RoomAllotmentsApi.getHostelContractsList(allotmentData.student_id).catch(() => []),
        RoomAllotmentsApi.getRoomAllotmentPayments({ room_allotment_id: id }).catch(() => ({ data: [] })),
        RoomAllotmentsApi.getHostelHistory({ room_allotment_id: id }).catch(() => ({ data: [] })),
        RoomAllotmentsApi.getStudentWalletBalance(allotmentData.student_id).catch(() => null),
        RoomAllotmentsApi.getStudentWalletTransactions(allotmentData.student_id).catch(() => ({ data: [] }))
      ]);

      setHostels(hostelsList);
      setStudents(studentsList);
      setContracts(contractsList);
      setPayments(paymentsRes.data);
      setHistory(historyRes.data);
      setWallet(walletRes);
      setWalletTransactions(walletTxRes.data);

      // Load initial floors & rooms for edit selections
      setIsLoadingOptions(true);
      const floorsList = await RoomAllotmentsApi.getHostelFloorsList(allotmentData.hostel_id).catch(() => []);
      setFloors(Array.isArray(floorsList) ? floorsList : []);

      const matchingFloor = Array.isArray(floorsList)
        ? floorsList.find((f) => f.floor_no === allotmentData.floor_no)
        : undefined;
      if (matchingFloor) {
        const roomsList = await RoomAllotmentsApi.getFloorRoomsList(matchingFloor.id).catch(() => []);
        setRooms(Array.isArray(roomsList) ? roomsList : []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load room allotment details.");
    } finally {
      setIsLoading(false);
      setIsLoadingOptions(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, loadData]);

  // Load floors when hostel changes in edit mode
  const handleHostelChange = async (hostelId: string) => {
    handleInputChange("hostel_id", hostelId);
    handleInputChange("floor_no", "");
    handleInputChange("room_no", "");
    setFloors([]);
    setRooms([]);

    if (!hostelId) return;

    setIsLoadingOptions(true);
    try {
      const floorsList = await RoomAllotmentsApi.getHostelFloorsList(hostelId);
      setFloors(Array.isArray(floorsList) ? floorsList : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  // Load rooms when floor changes in edit mode
  const handleFloorChange = async (floorNoVal: string) => {
    const floorNo = floorNoVal ? Number(floorNoVal) : 0;
    handleInputChange("floor_no", floorNo || "");
    handleInputChange("room_no", "");
    setRooms([]);

    if (!floorNo) return;

    const selectedFloor = floors.find((f) => f.floor_no === floorNo);
    if (!selectedFloor) return;

    setIsLoadingOptions(true);
    try {
      const roomsList = await RoomAllotmentsApi.getFloorRoomsList(selectedFloor.id);
      setRooms(Array.isArray(roomsList) ? roomsList : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  // Load student contracts when student changes in edit mode
  const handleStudentChange = async (studentId: string) => {
    handleInputChange("student_id", studentId);
    handleInputChange("hostel_contract_id", "");
    setContracts([]);

    if (!studentId) return;

    setIsLoadingOptions(true);
    try {
      const contractsList = await RoomAllotmentsApi.getHostelContractsList(studentId);
      setContracts(Array.isArray(contractsList) ? contractsList : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditMode && allotment) {
      // reset form
      setFormData({
        hostel_id: allotment.hostel_id,
        student_id: allotment.student_id,
        hostel_contract_id: allotment.hostel_contract_id,
        floor_no: allotment.floor_no,
        room_no: allotment.room_no,
        rent: allotment.rent || undefined,
        status: allotment.status,
        remarks: allotment.remarks,
        add_transaction_charge: allotment.add_transaction_charge,
      });
      setFormErrors({});
    }
    setIsEditMode(!isEditMode);
    setSuccessMessage(null);
  };

  const handleInputChange = (field: keyof UpdateRoomAllotmentPayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

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
    if (!formData.hostel_contract_id) tempErrors.hostel_contract_id = "Hostel Contract is required.";
    if (!formData.floor_no) tempErrors.floor_no = "Floor number is required.";
    if (!formData.room_no) tempErrors.room_no = "Room number is required.";
    if (!formData.status) tempErrors.status = "Status is required.";
    if (formData.rent !== undefined && Number(formData.rent) < 0) {
      tempErrors.rent = "Rent cannot be negative.";
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
      if (payload.rent !== undefined && payload.rent !== null) {
        payload.rent = Number(payload.rent);
      }
      if (payload.floor_no !== undefined) {
        payload.floor_no = Number(payload.floor_no);
      }

      const updated = await RoomAllotmentsApi.updateRoomAllotment(id, payload);
      closeLoading();
      setAllotment(updated);
      setIsEditMode(false);
      setSuccessMessage("Room allotment details saved successfully.");
      await showSuccess("Updated Successfully", "Changes have been saved successfully.");
      
      // reload lists
      const [paymentsRes, historyRes] = await Promise.all([
        RoomAllotmentsApi.getRoomAllotmentPayments({ room_allotment_id: id }),
        RoomAllotmentsApi.getHostelHistory({ room_allotment_id: id })
      ]);
      setPayments(paymentsRes.data);
      setHistory(historyRes.data);

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      closeLoading();
      setError(err.message || "Failed to save room allotment details.");
      showError("Update Failed", err.message || "Failed to save room allotment details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoomTransfer = async (payload: RoomTransferSettlePayload) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    showLoading("Settling room transfer...", "Please wait");
    try {
      const result = await RoomAllotmentsApi.settleRoomTransfer(payload);
      closeLoading();
      const successMsg = `Room transfer settled successfully. Wallet balance credited: $${result.wallet_credit_added.toFixed(2)}.`;
      setSuccessMessage(successMsg);
      await showSuccess("Updated Successfully", successMsg);
      await loadData(); // Reload all allotments details, stay history, payments ledger, and wallet balance
      setTimeout(() => setSuccessMessage(null), 6000);
      return true;
    } catch (err: any) {
      closeLoading();
      setError(err.message || "Failed to settle room transfer.");
      showError("Update Failed", err.message || "Failed to settle room transfer.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    allotment,
    hostels,
    students,
    contracts,
    payments,
    history,
    wallet,
    walletTransactions,
    isLoading,
    isSaving,
    error,
    isEditMode,
    formData,
    formErrors,
    successMessage,
    toggleEditMode,
    handleInputChange,
    handleHostelChange,
    handleFloorChange,
    handleStudentChange,
    saveChanges,
    handleRoomTransfer,
    reload: loadData,
    floors,
    rooms,
    isLoadingOptions,
  };
};
