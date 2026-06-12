import React from "react";
import { RoomAllotmentsListPage } from "@/features/room-allotments/components/room-allotments-list-page";

export const metadata = {
  title: "Room Allotments | ATMIA",
  description: "Allocate and manage student stay options, rent values, and transfers.",
};

export default function RoomAllotmentsPage() {
  return <RoomAllotmentsListPage />;
}
