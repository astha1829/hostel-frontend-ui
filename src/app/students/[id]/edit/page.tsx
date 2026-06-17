import React from "react";
import { EditStudentPage } from "@/features/students/components/edit-student-page";

interface StudentEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: StudentEditPageProps) {
  const resolvedParams = await params;
  return {
    title: `Edit Student ${resolvedParams.id.substring(0, 8).toUpperCase()} | ATMIA`,
    description: "Modify student profile records.",
  };
}

export default async function StudentEditPage({ params }: StudentEditPageProps) {
  const resolvedParams = await params;
  console.log("Student ID:", resolvedParams.id);
  return <EditStudentPage id={resolvedParams.id} />;
}
