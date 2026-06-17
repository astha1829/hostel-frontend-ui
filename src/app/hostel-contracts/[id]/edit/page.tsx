import React from "react";
import { EditHostelContractPage } from "@/features/hostel-contracts/components/edit-hostel-contract-page";

interface HostelContractEditRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HostelContractEditRoute({ params }: HostelContractEditRouteProps) {
  const resolvedParams = await params;
  return <EditHostelContractPage id={resolvedParams.id} />;
}
