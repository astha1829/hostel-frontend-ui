import { useState, useEffect, useCallback } from "react";
import { HostelContractEventsApi } from "../api";
import { HostelContractEvent } from "../types";
import { showDeleteConfirm, showDeleteSuccess, showDeleteError, showLoading, closeLoading } from "@/utils/swal";

export const useHostelContractEventDetails = (id: string) => {
  const [event, setEvent] = useState<HostelContractEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await HostelContractEventsApi.getHostelContractEventById(id);
      setEvent(data);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve hostel contract event details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleDelete = async (): Promise<boolean> => {
    const result = await showDeleteConfirm("Are you sure you want to delete this contract event?");
    if (!result.isConfirmed) {
      return false;
    }
    showLoading("Deleting...", "Please wait");
    try {
      await HostelContractEventsApi.deleteHostelContractEvent(id);
      closeLoading();
      await showDeleteSuccess();
      return true;
    } catch (err: any) {
      closeLoading();
      await showDeleteError();
      return false;
    }
  };

  return {
    event,
    isLoading,
    error,
    handleDelete,
    reload: loadDetails,
  };
};
