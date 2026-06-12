import React from "react";
import { HostelContractEventFormPage } from "@/features/hostel-contract-events/components/hostel-contract-event-form-page";

interface EditHostelContractEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Edit Contract Event | ATMIA",
  description: "Modify an existing contract event record.",
};

export default async function EditHostelContractEventPage({ params }: EditHostelContractEventPageProps) {
  const resolvedParams = await params;
  return <HostelContractEventFormPage id={resolvedParams.id} />;
}
