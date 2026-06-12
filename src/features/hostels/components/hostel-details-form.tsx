import React from "react";
import { User, Phone, MapPin, Layers, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatPhoneNumber } from "@/lib/utils";
import { Hostel, UpdateHostelPayload } from "../types";

interface HostelDetailsFormProps {
  hostel: Hostel;
  isEditMode: boolean;
  formData: UpdateHostelPayload;
  formErrors: Record<string, string>;
  onInputChange: (field: keyof UpdateHostelPayload, value: any) => void;
}

export const HostelDetailsForm: React.FC<HostelDetailsFormProps> = ({
  hostel,
  isEditMode,
  formData,
  formErrors,
  onInputChange,
}) => {
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Inactive", value: "inactive" },
  ];

  if (isEditMode) {
    return (
      <div className="flex flex-col gap-6">
        <div className="border border-border/80 rounded-lg p-5 bg-secondary/15 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border/80 pb-2">
            <Layers size={16} className="text-primary" />
            <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">
              Profile & Operational Configuration
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Hostel Name"
              value={formData.hostel_name || ""}
              onChange={(e) => onInputChange("hostel_name", e.target.value)}
              error={formErrors.hostel_name}
              placeholder="Enter hostel name"
            />

            <Input
              label="Hostel ID (Code)"
              value={formData.hostel_id || ""}
              onChange={(e) => onInputChange("hostel_id", e.target.value)}
              error={formErrors.hostel_id}
              placeholder="Enter hostel code (e.g. H001)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Zone / Campus Location"
              value={formData.zone || ""}
              onChange={(e) => onInputChange("zone", e.target.value)}
              error={formErrors.zone}
              placeholder="e.g. North Campus"
            />

            <Select
              label="Operational Status"
              value={formData.status || "active"}
              onChange={(e) => onInputChange("status", e.target.value)}
              options={statusOptions}
              error={formErrors.status}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Number of Floors"
              type="number"
              min={1}
              max={100}
              value={formData.number_of_floors !== undefined ? formData.number_of_floors : ""}
              onChange={(e) => onInputChange("number_of_floors", e.target.value ? Number(e.target.value) : "")}
              error={formErrors.number_of_floors}
              placeholder="e.g. 5"
            />
            <div />
          </div>
        </div>

        <div className="border border-border/80 rounded-lg p-5 bg-secondary/15 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border/80 pb-2">
            <User size={16} className="text-primary" />
            <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">
              Authorized Contact Representative
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Authorized Person Name"
              value={formData.auth_person_name || ""}
              onChange={(e) => onInputChange("auth_person_name", e.target.value)}
              error={formErrors.auth_person_name}
              placeholder="Enter full name"
            />

            <Input
              label="Contact Number"
              value={formData.contact || ""}
              onChange={(e) => onInputChange("contact", e.target.value)}
              error={formErrors.contact}
              placeholder="Enter contact number"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-secondary/20 border border-border/80 rounded-xl p-5 relative overflow-hidden transition-colors hover:bg-secondary/30">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-xl"></div>
        <div className="flex items-center gap-2 mb-4">
          <Layers size={16} className="text-primary" />
          <span className="text-sm font-bold uppercase tracking-wider text-foreground">General & Operational Specifications</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center">
              <Hash size={14} className="mr-1 text-muted-foreground/70" />
              Hostel Identifier (Code)
            </span>
            <span className="text-sm font-medium text-foreground font-mono bg-muted/50 px-2 py-0.5 rounded inline-block w-max border border-border/50">
              {hostel.hostel_id}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center">
              <MapPin size={14} className="mr-1 text-muted-foreground/70" />
              Zone Location / Campus
            </span>
            <span className="text-sm font-medium text-foreground">{hostel.zone || "Not Assigned"}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center">
              <Layers size={14} className="mr-1 text-muted-foreground/70" />
              Number of Floors
            </span>
            <span className="text-sm font-medium text-foreground">{hostel.number_of_floors || 0} Floors Registered</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${hostel.status === "active" ? "bg-success" : hostel.status === "maintenance" ? "bg-warning" : "bg-muted-foreground"}`} />
              Operational Status
            </span>
            <span className="text-sm font-medium text-foreground capitalize">
              {hostel.status || "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-secondary/20 border border-border/80 rounded-xl p-5 relative overflow-hidden transition-colors hover:bg-secondary/30">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-xl"></div>
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-primary" />
          <span className="text-sm font-bold uppercase tracking-wider text-foreground">Authorized Management Contact</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center">
              <User size={14} className="mr-1 text-muted-foreground/70" />
              Primary Representative
            </span>
            <span className="text-sm font-medium text-foreground">{hostel.auth_person_name || "Unassigned"}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center">
              <Phone size={14} className="mr-1 text-muted-foreground/70" />
              Direct Contact Number
            </span>
            <span className="text-sm font-medium text-foreground">{formatPhoneNumber(hostel.contact) || "No Contact Specified"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
