import React from "react";
import { HostelFloorDetailsPage } from "@/features/hostel-floors/components/hostel-floor-details-page";

interface HostelFloorDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HostelFloorDetailPage({ params }: HostelFloorDetailPageProps) {
  const resolvedParams = await params;
  return <HostelFloorDetailsPage id={resolvedParams.id} />;
}
