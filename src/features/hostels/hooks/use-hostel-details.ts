import { useState, useEffect, useCallback } from "react";
import { Hostel, HostelFloor, UpdateHostelPayload } from "../types";
import { HostelApi } from "../api";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export function useHostelDetails(hostelId: string) {
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [floors, setFloors] = useState<HostelFloor[]>([]);
  
  // UX Loading / Saving States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit flow forms state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateHostelPayload>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Success toast/banner feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchHostelData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch hostel metadata first using the route param ID (UUID)
      const hostelRes = await HostelApi.getHostelById(hostelId);

      if (hostelRes) {
        setHostel(hostelRes);
        setFormData({
          hostel_name: hostelRes.hostel_name,
          hostel_id: hostelRes.hostel_id,
          zone: hostelRes.zone || "",
          status: hostelRes.status || "active",
          auth_person_name: hostelRes.auth_person_name || "",
          contact: hostelRes.contact || "",
          number_of_floors: hostelRes.number_of_floors || 0,
        });

        // 2. Fetch floors using the verified database UUID (hostelRes.id)
        const floorsRes = await HostelApi.getHostelFloors(hostelRes.id);
        if (floorsRes && floorsRes.data) {
          setFloors(floorsRes.data.sort((a, b) => a.floor_no - b.floor_no));
        } else {
          throw new Error("No floor allocations data returned from the API.");
        }
      } else {
        throw new Error("No hostel data returned from the API.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while loading details.");
    } finally {
      setIsLoading(false);
    }
  }, [hostelId]);

  useEffect(() => {
    if (hostelId) {
      fetchHostelData();
    }
  }, [hostelId, fetchHostelData]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => {
      // If cancelling, reset form data
      if (prev && hostel) {
        setFormData({
          hostel_name: hostel.hostel_name,
          hostel_id: hostel.hostel_id,
          zone: hostel.zone || "",
          status: hostel.status || "active",
          auth_person_name: hostel.auth_person_name || "",
          contact: hostel.contact || "",
          number_of_floors: hostel.number_of_floors || 0,
        });
        setFormErrors({});
      }
      return !prev;
    });
  }, [hostel]);

  const handleInputChange = useCallback((field: keyof UpdateHostelPayload, value: any) => {
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

    if (!formData.hostel_name?.trim()) {
      errors.hostel_name = "Hostel Name is required";
    }
    if (!formData.hostel_id?.trim()) {
      errors.hostel_id = "Hostel ID (Code) is required";
    }
    if (!formData.zone?.trim()) {
      errors.zone = "Zone is required";
    }
    if (!formData.auth_person_name?.trim()) {
      errors.auth_person_name = "Authorized Person Name is required";
    }
    if (!formData.contact?.trim()) {
      errors.contact = "Contact No is required";
    } else {
      const cleanContact = formData.contact.replace(/\D/g, "");
      if (cleanContact.length < 7) {
        errors.contact = "Please enter a valid phone number";
      }
    }
    
    if (formData.number_of_floors === undefined || formData.number_of_floors === null) {
      errors.number_of_floors = "Number of Floors is required";
    } else {
      const floorsNum = Number(formData.number_of_floors);
      if (isNaN(floorsNum) || floorsNum < 1 || floorsNum > 100) {
        errors.number_of_floors = "Floors must be between 1 and 100";
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
      const updatedHostel = await HostelApi.updateHostel(hostelId, {
        ...formData,
        number_of_floors: Number(formData.number_of_floors),
      });

      if (updatedHostel) {
        closeLoading();
        setHostel(updatedHostel);
        setIsEditMode(false);
        setSuccessMessage("Hostel details updated successfully!");
        await showSuccess("Updated Successfully", "Changes have been saved successfully.");
        
        // Refetch floors table in case number_of_floors changed
        const floorsRes = await HostelApi.getHostelFloors(updatedHostel.id);
        if (floorsRes && floorsRes.data) {
          setFloors(floorsRes.data.sort((a, b) => a.floor_no - b.floor_no));
        }

        // Dismiss success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error("Failed to receive updated hostel data from server.");
      }
    } catch (err: any) {
      closeLoading();
      showError("Update Failed", err?.message || "Failed to save details. Please check connection.");
    } finally {
      setIsSaving(false);
    }
  }, [hostelId, formData]);

  return {
    hostel,
    floors,
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
    reload: fetchHostelData,
  };
}
