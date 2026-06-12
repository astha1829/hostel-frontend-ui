import React from "react";
import { RoomDetailsPage } from "@/features/rooms/components/room-details-page";

interface RoomDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const resolvedParams = await params;
  return <RoomDetailsPage id={resolvedParams.id} />;
}
