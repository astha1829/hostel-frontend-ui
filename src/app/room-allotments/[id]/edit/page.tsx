import React from "react";
import { EditRoomAllotmentPage } from "@/features/room-allotments/components/edit-room-allotment-page";

export const metadata = {
  title: "Edit Allotment | ATMIA",
  description: "Modify an existing student room allotment stays record.",
};

interface EditRoomAllotmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRoomAllotmentRoute({ params }: EditRoomAllotmentPageProps) {
  const resolvedParams = await params;
  return <EditRoomAllotmentPage id={resolvedParams.id} />;
}
