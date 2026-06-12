"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CreateHostelFloorForm } from "@/features/hostel-floors/components/create-hostel-floor-form";
import { HostelApi } from "@/features/hostels/api";
import { Hostel } from "@/features/hostels/types";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";

export default function NewHostelFloorPage() {
  const router = useRouter();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadHostels() {
      try {
        const res = await HostelApi.getHostels({ limit: 100 });
        if (res && res.data) {
          setHostels(res.data);
        }
      } catch (err) {
        console.error("Failed to load hostels list:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHostels();
  }, []);

  const handleSuccess = () => {
    // Redirect to list page upon successful creation
    router.push("/hostel-floors");
  };

  const handleClose = () => {
    // Redirect to list page on cancel
    router.push("/hostel-floors");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
      <PageHeader
        title="Add Hostel Floor"
        description="Register a new floor level under an active hostel property."
        backHref="/hostel-floors"
        backText="Back to Hostel Floors"
      />

      <Card>
        <CardContent style={{ padding: "1.5rem" }}>
          {isLoading ? (
            <DetailFormSkeleton />
          ) : (
            <CreateHostelFloorForm
              hostels={hostels}
              onSuccess={handleSuccess}
              onClose={handleClose}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
