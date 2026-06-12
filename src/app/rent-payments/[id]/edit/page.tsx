import React from "react";
import { RentPaymentFormPage } from "@/features/rent-payments/components/rent-payment-form-page";

interface EditRentPaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditRentPaymentPageProps) {
  const resolvedParams = await params;
  return {
    title: `Edit Rent Entry ${resolvedParams.id.substring(0, 8).toUpperCase()} | ATMIA`,
    description: "Modify rent ledger details, billing months, and reference linkage.",
  };
}

export default async function EditRentPaymentPage({ params }: EditRentPaymentPageProps) {
  const resolvedParams = await params;
  return <RentPaymentFormPage id={resolvedParams.id} />;
}
