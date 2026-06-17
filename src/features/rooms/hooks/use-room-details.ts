import { useState, useEffect } from "react";
import { RoomsApi } from "../api";
import { HostelRoom, UpdateHostelRoomPayload } from "../types";
import { showDeleteSuccess, showDeleteError, showLoading, closeLoading, showSuccess, showError } from '@/utils/swal';

export const useRoomDetails = (id: string, initialEditMode: boolean = false) => {
  const [room, setRoom] = useState<HostelRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // In-place inline edit mode state
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [formData, setFormData] = useState<UpdateHostelRoomPayload>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadRoom = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await RoomsApi.getRoomById(id);
      setRoom(data);
      setFormData({
        room_no: data.room_no,
        capacity: data.capacity,
        room_type: data.room_type,
        rent: Number(data.rent),
        status: data.status,
        idx: data.idx,
        qr_code: data.qr_code,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load room details record.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadRoom();
    }
  }, [id]);

  const toggleEditMode = () => {
    if (isEditMode && room) {
      // Revert edit changes
      setFormData({
        room_no: room.room_no,
        capacity: room.capacity,
        room_type: room.room_type,
        rent: Number(room.rent),
        status: room.status,
        idx: room.idx,
        qr_code: room.qr_code,
      });
      setFormErrors({});
    }
    setIsEditMode(!isEditMode);
    setSuccessMessage(null);
  };

  const handleInputChange = (field: keyof UpdateHostelRoomPayload, value: any) => {
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

  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};
    if (!formData.room_no?.toString().trim()) {
      tempErrors.room_no = "Room Number is required.";
    }
    if (formData.capacity !== undefined) {
      const cap = Number(formData.capacity);
      if (isNaN(cap) || cap < 1 || cap > 5) {
        tempErrors.capacity = "Capacity must be between 1 and 5 beds.";
      }
    }
    if (formData.room_type !== undefined && formData.room_type !== "Normal") {
      tempErrors.room_type = "Room Type must be Normal.";
    }
    if (formData.rent !== undefined) {
      const rentVal = Number(formData.rent);
      if (isNaN(rentVal) || rentVal < 0) {
        tempErrors.rent = "Rent rate must be non-negative.";
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
      const payload: UpdateHostelRoomPayload = {
        room_no: formData.room_no,
        capacity: Number(formData.capacity),
        room_type: formData.room_type,
        rent: Number(formData.rent),
        status: formData.status,
        idx: Number(formData.idx),
        qr_code: formData.qr_code,
      };
      
      const updated = await RoomsApi.updateRoom(id, payload);
      closeLoading();
      setRoom(updated);
      setIsEditMode(false);
      setSuccessMessage("Room details updated successfully.");
      await showSuccess("Updated Successfully", "Changes have been saved successfully.");
      
      // Auto clear success banner
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      closeLoading();
      setError(err.message || "Failed to update room details.");
      showError("Update Failed", err.message || "Failed to update room details.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    room,
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
    reload: loadRoom,
  };
};
