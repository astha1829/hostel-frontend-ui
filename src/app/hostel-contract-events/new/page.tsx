import React from "react";
import { HostelContractEventFormPage } from "@/features/hostel-contract-events/components/hostel-contract-event-form-page";

export const metadata = {
  title: "New Contract Event | ATMIA",
  description: "Record a new contract transition, extend contracts, or cancel room allotments.",
};

export default function NewHostelContractEventPage() {
  return <HostelContractEventFormPage />;
}
