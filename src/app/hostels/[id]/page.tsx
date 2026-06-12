import React from "react";
import { HostelDetailsPage } from "@/features/hostels/components/hostel-details-page";

interface HostelDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HostelDetailPage({ params }: HostelDetailPageProps) {
  const resolvedParams = await params;
  return <HostelDetailsPage id={resolvedParams.id} />;
}
