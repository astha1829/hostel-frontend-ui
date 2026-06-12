import { useState, useEffect, useMemo } from "react";
import { RoomsApi } from "../api";
import { HostelApi } from "../../hostels/api";
import { Hostel } from "../../hostels/types";
import { HostelFloor } from "../../hostel-floors/types";
import { CreateHostelRoomPayload } from "../types";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

interface RoomFormErrors {
  hostel_id?: string;
  hostel_floor_id?: string;
  room_no?: string;
  capacity?: string;
  room_type?: string;
  rent?: string;
  status?: string;
  idx?: string;
  qr_code?: string;
}

export const useRoomForm = (onSuccess?: () => void) => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [floors, setFloors] = useState<HostelFloor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Field States
  const [hostelId, setHostelId] = useState("");
  const [floorId, setFloorId] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [capacity, setCapacity] = useState<number>(2);
  const [roomType, setRoomType] = useState("Normal");
  const [rent, setRent] = useState<number>(0);
  const [status, setStatus] = useState("Available");
  const [idx, setIdx] = useState<number>(1);
  const [qrCode, setQrCode] = useState<string>("");

  const [errors, setErrors] = useState<RoomFormErrors>({});

  useEffect(() => {
    const loadMetadata = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [hostelsList, floorsList] = await Promise.all([
          HostelApi.getHostels({ limit: 100 }),
          RoomsApi.getFloorsList(),
        ]);
        setHostels(hostelsList.data);
        setFloors(floorsList);
      } catch (err: any) {
        setError(err.message || "Failed to load floor/hostel context metadata.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMetadata();
  }, []);

  // Filtered floors based on selected hostel
  const filteredFloors = useMemo(() => {
    if (!hostelId) return [];
    return floors.filter((f) => f.hostel_id === hostelId);
  }, [floors, hostelId]);

  const handleHostelChange = (id: string) => {
    setHostelId(id);
    setFloorId(""); // Reset dependent floor selection
    if (errors.hostel_id) {
      setErrors((prev) => ({ ...prev, hostel_id: undefined }));
    }
  };

  const handleInputChange = (field: keyof RoomFormErrors, value: any) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const tempErrors: RoomFormErrors = {};
    if (!hostelId) tempErrors.hostel_id = "Associated Hostel is required.";
    if (!floorId) tempErrors.hostel_floor_id = "Associated Floor Level is required.";
    if (!roomNo.trim()) tempErrors.room_no = "Room Number is required.";
    
    const capNum = Number(capacity);
    if (isNaN(capNum) || capNum < 1 || capNum > 5) {
      tempErrors.capacity = "Room capacity must be between 1 and 5 beds.";
    }
    
    if (roomType !== "Normal") {
      tempErrors.room_type = "Room Type must be Normal.";
    }
    
    const rentNum = Number(rent);
    if (isNaN(rentNum) || rentNum < 0) {
      tempErrors.rent = "Rent rate must be non-negative.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const save = async (): Promise<boolean> => {
    if (!validate()) return false;
    setIsSaving(true);
    setError(null);
    showLoading("Creating room...", "Please wait");

    const payload: CreateHostelRoomPayload = {
      room_no: roomNo,
      capacity: Number(capacity),
      room_type: roomType,
      rent: Number(rent),
      status: status,
      idx: Number(idx),
      qr_code: qrCode.trim() ? qrCode : null,
    };

    try {
      await RoomsApi.createRoom(floorId, payload);
      closeLoading();
      await showSuccess("Created Successfully", "Record has been created successfully.");
      if (onSuccess) onSuccess();
      return true;
    } catch (err: any) {
      closeLoading();
      setError(err.message || "Failed to create new room record.");
      showError("Creation Failed", err.message || "Failed to create new room record.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    hostels,
    floors: filteredFloors,
    isLoading,
    isSaving,
    error,
    errors,
    hostelId,
    handleHostelChange,
    floorId,
    setFloorId: (val: string) => {
      setFloorId(val);
      handleInputChange("hostel_floor_id", val);
    },
    roomNo,
    setRoomNo: (val: string) => {
      setRoomNo(val);
      handleInputChange("room_no", val);
    },
    capacity,
    setCapacity: (val: number) => {
      setCapacity(val);
      handleInputChange("capacity", val);
    },
    roomType,
    setRoomType: (val: string) => {
      setRoomType(val);
      handleInputChange("room_type", val);
    },
    rent,
    setRent: (val: number) => {
      setRent(val);
      handleInputChange("rent", val);
    },
    status,
    setStatus,
    idx,
    setIdx,
    qrCode,
    setQrCode,
    save,
  };
};
