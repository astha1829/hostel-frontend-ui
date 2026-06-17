import { useState, useEffect, useCallback } from "react";
import { CreateHostelFloorPayload } from "../types";
import { HostelFloorsApi } from "../api";
import { HostelApi } from "../../hostels/api";
import { Hostel, HostelFloor } from "../../hostels/types";
import { showDeleteSuccess, showDeleteError, showLoading, closeLoading, showSuccess, showError } from '@/utils/swal';

interface UseHostelFloorFormProps {
  hostels: Hostel[];
  onSuccess: () => void;
  onClose: () => void;
}

const initialFormState: CreateHostelFloorPayload = {
  hostel_id: "",
  floor_no: 1,
  room_number_series: "",
  idx: 0,
};

export function useHostelFloorForm({ hostels, onSuccess, onClose }: UseHostelFloorFormProps) {
  const [formData, setFormData] = useState<CreateHostelFloorPayload>(initialFormState);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [existingFloors, setExistingFloors] = useState<HostelFloor[]>([]);
  const [isLoadingFloors, setIsLoadingFloors] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handle Hostel Selection Change
  const handleHostelSelect = useCallback(async (hostelId: string) => {
    setApiError(null);
    setFieldErrors({});

    if (!hostelId) {
      setSelectedHostel(null);
      setExistingFloors([]);
      setFormData(initialFormState);
      return;
    }

    const hostel = hostels.find((h) => h.id === hostelId) || null;
    setSelectedHostel(hostel);

    if (hostel) {
      setIsLoadingFloors(true);
      try {
        // Fetch floors already created for this hostel
        const res = await HostelApi.getHostelFloors(hostel.id);
        if (res && res.data) {
          const sortedFloors = res.data.sort((a, b) => a.floor_no - b.floor_no);
          setExistingFloors(sortedFloors);

          // Calculate next available floor number
          const maxFloor = sortedFloors.reduce((max, f) => (f.floor_no > max ? f.floor_no : max), 0);
          const suggestedFloor = maxFloor + 1;

          // Set form state with selected hostel and suggested floor no
          setFormData((prev) => ({
            ...prev,
            hostel_id: hostelId,
            floor_no: suggestedFloor,
            room_number_series: "", // Clear or default series
            idx: maxFloor, // Default index to maxFloor for layout ordering
          }));
        }
      } catch (err) {
        console.error("Failed to load existing floors for hostel:", err);
      } finally {
        setIsLoadingFloors(false);
      }
    }
  }, [hostels]);

  const handleInputChange = useCallback((field: keyof CreateHostelFloorPayload, value: any) => {
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

    if (!formData.hostel_id) {
      errors.hostel_id = "Please select a Hostel";
    }

    if (formData.floor_no === undefined || formData.floor_no === null) {
      errors.floor_no = "Floor Number is required";
    } else {
      const floorNum = Number(formData.floor_no);
      if (isNaN(floorNum) || floorNum < 1) {
        errors.floor_no = "Floor number must be at least 1";
      }

      // Check max floors configured on hostel
      if (selectedHostel && selectedHostel.number_of_floors && floorNum > selectedHostel.number_of_floors) {
        errors.floor_no = `Floor number exceeds hostel maximum floors (${selectedHostel.number_of_floors})`;
      }

      // Check if floor number already exists
      const isDuplicate = existingFloors.some((f) => f.floor_no === floorNum);
      if (isDuplicate) {
        errors.floor_no = `Floor ${floorNum} is already registered for this hostel`;
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = useCallback(() => {
    setFormData(initialFormState);
    setSelectedHostel(null);
    setExistingFloors([]);
    setFieldErrors({});
    setApiError(null);
    onClose();
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);
    showLoading("Adding floor...", "Please wait");

    try {
      const payload: CreateHostelFloorPayload = {
        ...formData,
        floor_no: Number(formData.floor_no),
        idx: Number(formData.idx || 0),
      };

      await HostelFloorsApi.createHostelFloor(payload);
      closeLoading();
      await showSuccess("Created Successfully", "Record has been created successfully.");
      onSuccess();
      handleReset();
    } catch (error: any) {
      closeLoading();
      const msg = error?.message || "Failed to add hostel floor. Please verify fields and try again.";
      setApiError(msg);
      showError("Creation Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    selectedHostel,
    existingFloors,
    isLoadingFloors,
    fieldErrors,
    apiError,
    isSubmitting,
    handleHostelSelect,
    handleInputChange,
    handleReset,
    handleSubmit,
  };
}
