import React from "react";
import { StudentsListPage } from "@/features/students/components/students-list-page";

export const metadata = {
  title: "Students Directory | ATMIA",
  description: "Manage student profiles and KYC verifications.",
};

export default function StudentsPage() {
  return <StudentsListPage />;
}
