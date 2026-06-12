import React from "react";
import { HostelContractDetailsPage } from "@/features/hostel-contracts/components/hostel-contract-details-page";

interface ContractDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ContractDetailPageProps) {
  const resolvedParams = await params;
  return {
    title: `Contract Details ${resolvedParams.id.substring(0, 8).toUpperCase()} | ATMIA`,
    description: "Detailed hostel contract profile and billing information.",
  };
}

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  const resolvedParams = await params;
  return <HostelContractDetailsPage id={resolvedParams.id} />;
}
