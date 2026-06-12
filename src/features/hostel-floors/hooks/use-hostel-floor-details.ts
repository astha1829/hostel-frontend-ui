import { useState, useEffect, useCallback } from "react";
import { HostelFloor, UpdateHostelFloorPayload } from "../types";
import { HostelFloorsApi } from "../api";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export function useHostelFloorDetails(floorId: string) {
  const [floor, setFloor] = useState<HostelFloor | null>(null);
  
  // UX Loading / Saving States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit flow forms state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateHostelFloorPayload>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Success toast/banner feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchFloorData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await HostelFloorsApi.getHostelFloorById(floorId);

      if (res) {
        setFloor(res);
        setFormData({
          hostel_id: res.hostel_id,
          floor_no: res.floor_no,
          room_number_series: res.room_number_series || "",
          idx: res.idx || 0,
        });
      } else {
        throw new Error("No floor details returned from the API.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while loading floor details.");
    } finally {
      setIsLoading(false);
    }
  }, [floorId]);

  useEffect(() => {
    if (floorId) {
      fetchFloorData();
    }
  }, [floorId, fetchFloorData]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => {
      // If cancelling, reset form data
      if (prev && floor) {
        setFormData({
          hostel_id: floor.hostel_id,
          floor_no: floor.floor_no,
          room_number_series: floor.room_number_series || "",
          idx: floor.idx || 0,
        });
        setFormErrors({});
      }
      return !prev;
    });
  }, [floor]);

  const handleInputChange = useCallback((field: keyof UpdateHostelFloorPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error on type
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (formData.floor_no === undefined || formData.floor_no === null) {
      errors.floor_no = "Floor Number is required";
    } else {
      const floorNum = Number(formData.floor_no);
      if (isNaN(floorNum) || floorNum < 1) {
        errors.floor_no = "Floor Number must be at least 1";
      } else if (floor?.hostel?.number_of_floors && floorNum > floor.hostel.number_of_floors) {
        errors.floor_no = `Floor number exceeds hostel maximum floors limit (${floor.hostel.number_of_floors})`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveChanges = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setSuccessMessage(null);
    showLoading("Saving changes...", "Please wait");
    try {
      const updatedFloor = await HostelFloorsApi.updateHostelFloor(floorId, {
        ...formData,
        floor_no: Number(formData.floor_no),
        idx: Number(formData.idx),
      });

      if (updatedFloor) {
        closeLoading();
        // Refetch full floor data to get updated relations correctly
        const refetched = await HostelFloorsApi.getHostelFloorById(floorId);
        setFloor(refetched);
        setIsEditMode(false);
        setSuccessMessage("Hostel floor details updated successfully!");
        await showSuccess("Updated Successfully", "Changes have been saved successfully.");

        // Dismiss success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error("Failed to receive updated floor data from server.");
      }
    } catch (err: any) {
      closeLoading();
      showError("Update Failed", err?.message || "Failed to save details. Please check connection.");
    } finally {
      setIsSaving(false);
    }
  }, [floorId, formData, floor]);

  return {
    floor,
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
    reload: fetchFloorData,
  };
}
