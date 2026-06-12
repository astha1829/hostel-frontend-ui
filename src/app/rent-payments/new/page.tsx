import React from "react";
import { RentPaymentFormPage } from "@/features/rent-payments/components/rent-payment-form-page";

export const metadata = {
  title: "New Rent Entry | ATMIA",
  description: "Register a new rent entry in the ledger.",
};

export default function NewRentPaymentPage() {
  return <RentPaymentFormPage />;
}
