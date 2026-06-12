import React from "react";
import { RoomAllotmentPaymentFormPage } from "@/features/room-allotment-payments/components/room-allotment-payment-form-page";

interface EditRoomAllotmentPaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditRoomAllotmentPaymentPageProps) {
  const resolvedParams = await params;
  return {
    title: `Edit Payment ${resolvedParams.id.substring(0, 8).toUpperCase()} | ATMIA`,
    description: "Modify room allotment payment details and monthly linkages.",
  };
}

export default async function EditRoomAllotmentPaymentPage({ params }: EditRoomAllotmentPaymentPageProps) {
  const resolvedParams = await params;
  return <RoomAllotmentPaymentFormPage id={resolvedParams.id} />;
}
