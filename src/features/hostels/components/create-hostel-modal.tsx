import React, { useState } from "react";
import { Building2, User, ShieldCheck, Layers, Phone } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HostelApi } from "../api";
import { CreateHostelPayload } from "../types";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

interface CreateHostelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormState: CreateHostelPayload = {
  hostel_name: "",
  hostel_id: "",
  zone: "",
  status: "active",
  auth_person_name: "",
  contact: "",
  number_of_floors: 1,
  is_submitted: true,
};

export const CreateHostelModal: React.FC<CreateHostelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateHostelPayload>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Inactive", value: "inactive" },
  ];

  const handleInputChange = (field: keyof CreateHostelPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
    setApiError(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.hostel_name.trim()) {
      errors.hostel_name = "Hostel Name is required";
    }
    if (!formData.hostel_id.trim()) {
      errors.hostel_id = "Hostel Code (ID) is required";
    }
    if (formData.number_of_floors === undefined || formData.number_of_floors === null) {
      errors.number_of_floors = "Number of floors is required";
    } else {
      const floors = Number(formData.number_of_floors);
      if (isNaN(floors) || floors < 1 || floors > 100) {
        errors.number_of_floors = "Floors count must be between 1 and 100";
      }
    }

    if (formData.contact && formData.contact.trim()) {
      const cleanContact = formData.contact.replace(/\D/g, "");
      if (cleanContact.length < 7) {
        errors.contact = "Please enter a valid phone number";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setFieldErrors({});
    setApiError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);
    showLoading("Creating hostel...", "Please wait");

    try {
      const payload: CreateHostelPayload = {
        ...formData,
        number_of_floors: Number(formData.number_of_floors),
      };

      await HostelApi.createHostel(payload);
      closeLoading();
      await showSuccess("Created Successfully", "Record has been created successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      closeLoading();
      const msg = error?.message || "Failed to create hostel record. Please verify fields and try again.";
      setApiError(msg);
      showError("Creation Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[850px]"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Create New Hostel</h2>
          <p className="text-sm font-normal text-muted-foreground">Register and configure a new property in the system.</p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col mt-4">
        {apiError && (
          <div className="mb-5 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>{apiError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pb-2">
          {/* Basic Details */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-foreground border-b border-border/40 pb-2 mb-1">Basic Details</h4>
          </div>
          <Input
            label="Hostel Name *"
            value={formData.hostel_name}
            onChange={(e) => handleInputChange("hostel_name", e.target.value)}
            error={fieldErrors.hostel_name}
            placeholder="e.g. Oakwood Hall"
            className="rounded-lg h-10 shadow-sm transition-colors hover:border-primary/50 focus:border-primary"
          />
          <Input
            label="Hostel Code (ID) *"
            value={formData.hostel_id}
            onChange={(e) => handleInputChange("hostel_id", e.target.value)}
            error={fieldErrors.hostel_id}
            placeholder="e.g. HSTL-025"
            className="rounded-lg h-10 shadow-sm transition-colors hover:border-primary/50 focus:border-primary"
          />

          {/* Operational Details */}
          <div className="md:col-span-2 pt-2">
            <h4 className="text-sm font-semibold text-foreground border-b border-border/40 pb-2 mb-1">Operational Parameters</h4>
          </div>
          <Input
            label="Zone / Location"
            value={formData.zone}
            onChange={(e) => handleInputChange("zone", e.target.value)}
            placeholder="e.g. North Campus"
            className="rounded-lg h-10 shadow-sm transition-colors hover:border-primary/50 focus:border-primary"
          />
          <Select
            label="Operational Status"
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            options={statusOptions}
            className="rounded-lg h-10 shadow-sm transition-colors hover:border-primary/50 focus:border-primary"
          />
          <Input
            label="Number of Floors *"
            type="number"
            min={1}
            max={100}
            value={formData.number_of_floors}
            onChange={(e) => handleInputChange("number_of_floors", e.target.value ? Number(e.target.value) : "")}
            error={fieldErrors.number_of_floors}
            placeholder="e.g. 4"
            className="rounded-lg h-10 shadow-sm transition-colors hover:border-primary/50 focus:border-primary"
          />
          
          {/* Empty div to balance the grid for 'Number of Floors' */}
          <div className="hidden md:block"></div>

          {/* Management */}
          <div className="md:col-span-2 pt-2">
            <h4 className="text-sm font-semibold text-foreground border-b border-border/40 pb-2 mb-1">Management Representative</h4>
          </div>
          <Input
            label="Representative Name"
            value={formData.auth_person_name}
            onChange={(e) => handleInputChange("auth_person_name", e.target.value)}
            error={fieldErrors.auth_person_name}
            placeholder="e.g. Jonathan Vance"
            className="rounded-lg h-10 shadow-sm transition-colors hover:border-primary/50 focus:border-primary"
          />
          <Input
            label="Direct Contact Number"
            value={formData.contact}
            onChange={(e) => handleInputChange("contact", e.target.value)}
            error={fieldErrors.contact}
            placeholder="e.g. 555-012-9988"
            className="rounded-lg h-10 shadow-sm transition-colors hover:border-primary/50 focus:border-primary"
          />
        </div>

        {/* Action Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-border/40">
          <Button variant="outline" type="button" onClick={handleClose} disabled={isSubmitting} className="rounded-lg px-5 h-9 text-sm font-medium">
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting} className="rounded-lg px-6 h-9 text-sm font-medium shadow-sm">
            Create Hostel
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

