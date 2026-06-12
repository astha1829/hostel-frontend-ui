import React from "react";
import { RentPaymentDetailsPage } from "@/features/rent-payments/components/rent-payment-details-page";

interface RentPaymentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: RentPaymentDetailPageProps) {
  const resolvedParams = await params;
  return {
    title: `Rent Entry Details ${resolvedParams.id.substring(0, 8).toUpperCase()} | ATMIA`,
    description: "Detailed rent ledger, billing allocations, and transaction references.",
  };
}

export default async function RentPaymentDetailPage({ params }: RentPaymentDetailPageProps) {
  const resolvedParams = await params;
  return <RentPaymentDetailsPage id={resolvedParams.id} />;
}
