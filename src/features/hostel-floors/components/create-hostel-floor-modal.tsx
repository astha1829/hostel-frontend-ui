import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { CreateHostelFloorForm } from "./create-hostel-floor-form";
import { Hostel } from "../../hostels/types";

interface CreateHostelFloorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hostels: Hostel[];
}

export const CreateHostelFloorModal: React.FC<CreateHostelFloorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  hostels,
}) => {
  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add Hostel Floor"
      description="Register a new floor level under an active hostel."
      className="dialog-large"
    >
      <CreateHostelFloorForm
        hostels={hostels}
        onSuccess={onSuccess}
        onClose={onClose}
      />
    </Dialog>
  );
};
