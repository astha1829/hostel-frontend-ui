import React from "react";
import { RoomAllotmentPaymentFormPage } from "@/features/room-allotment-payments/components/room-allotment-payment-form-page";

export const metadata = {
  title: "New Payment Record | ATMIA",
  description: "Register a new room allotment payment transaction and link billing references.",
};

export default function NewRoomAllotmentPaymentPage() {
  return <RoomAllotmentPaymentFormPage />;
}
