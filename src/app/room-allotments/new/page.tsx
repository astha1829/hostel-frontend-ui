import React from "react";
import { RoomAllotmentFormPage } from "@/features/room-allotments/components/room-allotment-form-page";

export const metadata = {
  title: "Add Allotment | ATMIA",
  description: "Create a new student room allotment stays record.",
};

export default function NewRoomAllotmentPage() {
  return <RoomAllotmentFormPage />;
}
