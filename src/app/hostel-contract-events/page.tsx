import React from "react";
import { HostelContractEventsListPage } from "@/features/hostel-contract-events/components/hostel-contract-events-list-page";

export const metadata = {
  title: "Hostel Contract Events | ATMIA",
  description: "Audit student contract lifecycles and transitions.",
};

export default function HostelContractEventsPage() {
  return <HostelContractEventsListPage />;
}
