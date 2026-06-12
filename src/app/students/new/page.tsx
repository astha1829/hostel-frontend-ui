import React from "react";
import { StudentFormPage } from "@/features/students/components/student-form-page";

export const metadata = {
  title: "Register New Student | ATMIA",
  description: "Add a new student profile and documentation.",
};

export default function NewStudentPage() {
  return <StudentFormPage />;
}
