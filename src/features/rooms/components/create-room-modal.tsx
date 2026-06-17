"use client";

import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { RoomForm } from "./room-form";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialHostelId?: string;
  initialFloorId?: string;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialHostelId,
  initialFloorId,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Room"
      description="Register a new room record under a hostel floor level."
      className="dialog-large"
    >
      <RoomForm
        onSuccess={onSuccess}
        onClose={onClose}
        initialHostelId={initialHostelId}
        initialFloorId={initialFloorId}
      />
    </Dialog>
  );
};
