import React from "react";
import { EditRoomPage } from "@/features/rooms/components/edit-room-page";

interface RoomEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomEditPage({ params }: RoomEditPageProps) {
  const resolvedParams = await params;
  return <EditRoomPage id={resolvedParams.id} />;
}
