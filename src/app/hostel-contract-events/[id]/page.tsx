import React from "react";
import { HostelContractEventDetailsPage } from "@/features/hostel-contract-events/components/hostel-contract-event-details-page";

interface HostelContractEventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: HostelContractEventDetailPageProps) {
  const resolvedParams = await params;
  return {
    title: `Contract Event ${resolvedParams.id.substring(0, 8).toUpperCase()} | ATMIA`,
    description: "Detailed contract audit log, relationships, and history.",
  };
}

export default async function HostelContractEventDetailPage({ params }: HostelContractEventDetailPageProps) {
  const resolvedParams = await params;
  return <HostelContractEventDetailsPage id={resolvedParams.id} />;
}
