import React from "react";
import { RoomAllotmentPaymentFormPage } from "@/features/room-allotment-payments/components/room-allotment-payment-form-page";

interface EditPaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditPaymentPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || "";
  return {
    title: `Edit Payment ${id ? id.substring(0, 8).toUpperCase() : ""} | ATMIA`,
    description: "Modify room allotment payment details and monthly linkages.",
  };
}

export default async function EditPaymentPage({ params }: EditPaymentPageProps) {
  const resolvedParams = await params;
  return <RoomAllotmentPaymentFormPage id={resolvedParams.id} />;
}
