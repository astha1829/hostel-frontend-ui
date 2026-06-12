import React from "react";
import { StudentDetailsPage } from "@/features/students/components/student-details-page";

interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: StudentDetailPageProps) {
  const resolvedParams = await params;
  return {
    title: `Student Profile ${resolvedParams.id.substring(0, 8).toUpperCase()} | ATMIA`,
    description: "Detailed student profile records.",
  };
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const resolvedParams = await params;
  return <StudentDetailsPage id={resolvedParams.id} />;
}
