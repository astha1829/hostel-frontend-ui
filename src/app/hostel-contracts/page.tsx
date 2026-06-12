import React from "react";
import { HostelContractsListPage } from "@/features/hostel-contracts/components/hostel-contracts-list-page";

export const metadata = {
  title: "Hostel Contracts | ATMIA",
  description: "Manage hostel contract agreements and statuses.",
};

export default function ContractsPage() {
  return <HostelContractsListPage />;
}
