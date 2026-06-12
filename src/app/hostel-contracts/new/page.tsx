import React from "react";
import { HostelContractFormPage } from "@/features/hostel-contracts/components/hostel-contract-form-page";

export const metadata = {
  title: "Add Contract | ATMIA",
  description: "Create a new hostel contract profile.",
};

export default function NewContractPage() {
  return <HostelContractFormPage />;
}
