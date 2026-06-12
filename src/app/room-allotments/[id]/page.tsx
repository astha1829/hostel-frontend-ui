import React from "react";
import { RoomAllotmentDetailsPage } from "@/features/room-allotments/components/room-allotment-details-page";

interface RoomAllotmentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: RoomAllotmentDetailPageProps) {
  const resolvedParams = await params;
  return {
    title: `Allotment Details ${resolvedParams.id.substring(0, 8).toUpperCase()} | ATMIA`,
    description: "Detailed stay allotments, roommates, history, and rent ledger.",
  };
}

export default async function RoomAllotmentDetailPage({ params }: RoomAllotmentDetailPageProps) {
  const resolvedParams = await params;
  return <RoomAllotmentDetailsPage id={resolvedParams.id} />;
}
