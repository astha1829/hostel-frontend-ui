import React from "react";
import { RoomAllotmentPaymentDetailsPage } from "@/features/room-allotment-payments/components/room-allotment-payment-details-page";

interface RoomAllotmentPaymentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: RoomAllotmentPaymentDetailPageProps) {
  const resolvedParams = await params;
  return {
    title: `Payment Details ${resolvedParams.id.substring(0, 8).toUpperCase()} | ATMIA`,
    description: "Detailed room allotment payment transaction logs and billing ledger references.",
  };
}

export default async function RoomAllotmentPaymentDetailPage({ params }: RoomAllotmentPaymentDetailPageProps) {
  const resolvedParams = await params;
  return <RoomAllotmentPaymentDetailsPage id={resolvedParams.id} />;
}
