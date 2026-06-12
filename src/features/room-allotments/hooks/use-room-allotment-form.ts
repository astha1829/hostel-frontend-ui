import { useState, useEffect } from "react";
import { RoomAllotmentsApi } from "../api";
import { CreateRoomAllotmentPayload } from "../types";
import { Hostel } from "../../hostels/types";
import { Student } from "../../students/types";
import { HostelContract } from "../../hostel-contracts/types";
import { HostelFloor } from "../../hostel-floors/types";
import { HostelRoom } from "../../rooms/types";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

interface UseRoomAllotmentFormProps {
  onSuccess: (id: string) => void;
  onCancel: () => void;
}

export const useRoomAllotmentForm = ({ onSuccess, onCancel }: UseRoomAllotmentFormProps) => {
  const [formData, setFormData] = useState<CreateRoomAllotmentPayload>({
    hostel_id: "",
    student_id: "",
    hostel_contract_id: "",
    floor_no: 0,
    room_no: "",
    rent: 0,
    status: "Active",
    remarks: "",
    add_transaction_charge: false,
  });

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [contracts, setContracts] = useState<HostelContract[]>([]);
  const [floors, setFloors] = useState<HostelFloor[]>([]);
  const [rooms, setRooms] = useState<HostelRoom[]>([]);

  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInitialOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [hostelsList, studentsList] = await Promise.all([
          RoomAllotmentsApi.getHostelsList().catch(() => []),
          RoomAllotmentsApi.getStudentsList().catch(() => []),
        ]);
        setHostels(hostelsList);
        setStudents(studentsList);

        // Auto select first option values if available
        if (hostelsList.length > 0) {
          const firstHostelId = hostelsList[0].id;
          setFormData((prev) => ({ ...prev, hostel_id: firstHostelId }));
          const floorsList = await RoomAllotmentsApi.getHostelFloorsList(firstHostelId).catch(() => []);
          setFloors(floorsList);
          if (floorsList.length > 0) {
            const firstFloorNo = floorsList[0].floor_no;
            setFormData((prev) => ({ ...prev, floor_no: firstFloorNo }));
            const roomsList = await RoomAllotmentsApi.getFloorRoomsList(floorsList[0].id).catch(() => []);
            setRooms(roomsList);
            if (roomsList.length > 0) {
              setFormData((prev) => ({ ...prev, room_no: roomsList[0].room_no }));
            }
          }
        }

        if (studentsList.length > 0) {
          const firstStudentId = studentsList[0].id;
          setFormData((prev) => ({ ...prev, student_id: firstStudentId }));
          const contractsList = await RoomAllotmentsApi.getHostelContractsList(firstStudentId).catch(() => []);
          setContracts(contractsList);
          if (contractsList.length > 0) {
            setFormData((prev) => ({ ...prev, hostel_contract_id: contractsList[0].id }));
          }
        }
      } catch (err: any) {
        console.error("Failed to load initial form options", err);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    loadInitialOptions();
  }, []);

  const handleInputChange = (field: keyof CreateRoomAllotmentPayload, value: any) => {
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

  const handleHostelChange = async (hostelId: string) => {
    handleInputChange("hostel_id", hostelId);
    handleInputChange("floor_no", 0);
    handleInputChange("room_no", "");
    setFloors([]);
    setRooms([]);

    if (!hostelId) return;

    setIsLoadingOptions(true);
    try {
      const floorsList = await RoomAllotmentsApi.getHostelFloorsList(hostelId);
      setFloors(floorsList);
      if (floorsList.length > 0) {
        const firstFloorNo = floorsList[0].floor_no;
        setFormData((prev) => ({ ...prev, floor_no: firstFloorNo }));
        const roomsList = await RoomAllotmentsApi.getFloorRoomsList(floorsList[0].id).catch(() => []);
        setRooms(roomsList);
        if (roomsList.length > 0) {
          setFormData((prev) => ({ ...prev, room_no: roomsList[0].room_no }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleFloorChange = async (floorNoVal: string) => {
    const floorNo = floorNoVal ? Number(floorNoVal) : 0;
    handleInputChange("floor_no", floorNo);
    handleInputChange("room_no", "");
    setRooms([]);

    if (!floorNo || !formData.hostel_id) return;

    const selectedFloor = floors.find((f) => f.floor_no === floorNo);
    if (!selectedFloor) return;

    setIsLoadingOptions(true);
    try {
      const roomsList = await RoomAllotmentsApi.getFloorRoomsList(selectedFloor.id);
      setRooms(roomsList);
      if (roomsList.length > 0) {
        setFormData((prev) => ({ ...prev, room_no: roomsList[0].room_no }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleStudentChange = async (studentId: string) => {
    handleInputChange("student_id", studentId);
    handleInputChange("hostel_contract_id", "");
    setContracts([]);

    if (!studentId) return;

    setIsLoadingOptions(true);
    try {
      const contractsList = await RoomAllotmentsApi.getHostelContractsList(studentId);
      setContracts(contractsList);
      if (contractsList.length > 0) {
        setFormData((prev) => ({ ...prev, hostel_contract_id: contractsList[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};
    if (!formData.hostel_id) tempErrors.hostel_id = "Hostel selection is required.";
    if (!formData.student_id) tempErrors.student_id = "Student selection is required.";
    if (!formData.hostel_contract_id) tempErrors.hostel_contract_id = "Hostel Contract is required.";
    if (!formData.floor_no) tempErrors.floor_no = "Floor number is required.";
    if (!formData.room_no) tempErrors.room_no = "Room number is required.";
    if (!formData.status) tempErrors.status = "Allotment status is required.";
    if (formData.rent !== undefined && Number(formData.rent) < 0) {
      tempErrors.rent = "Rent cannot be negative.";
    }

    setFieldErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setApiError(null);
    showLoading("Creating allotment...", "Please wait");

    try {
      const payload = { ...formData };
      if (payload.rent !== undefined && payload.rent !== null) {
        payload.rent = Number(payload.rent);
      }
      payload.floor_no = Number(payload.floor_no);

      const res = await RoomAllotmentsApi.createRoomAllotment(payload);
      closeLoading();
      await showSuccess("Created Successfully", "Record has been created successfully.");
      onSuccess(res.id);
    } catch (err: any) {
      closeLoading();
      setApiError(err.message || "Failed to create room allotment.");
      showError("Creation Failed", err.message || "Failed to create room allotment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    hostels,
    students,
    contracts,
    floors,
    rooms,
    isLoadingOptions,
    fieldErrors,
    apiError,
    isSubmitting,
    handleInputChange,
    handleHostelChange,
    handleFloorChange,
    handleStudentChange,
    handleSubmit,
  };
};
