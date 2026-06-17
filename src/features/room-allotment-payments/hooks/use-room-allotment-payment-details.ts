import { useState, useEffect, useCallback } from "react";
import { RoomAllotmentPaymentsApi } from "../api";
import { RoomAllotmentPayment } from "../types";
import { showDeleteConfirm, showDeleteSuccess, showDeleteError, showLoading, closeLoading } from "@/utils/swal";

export const useRoomAllotmentPaymentDetails = (id: string) => {
  const [payment, setPayment] = useState<RoomAllotmentPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await RoomAllotmentPaymentsApi.getRoomAllotmentPaymentById(id);
      setPayment(data);
    } catch (err: any) {
      setError(err.message || "Failed to load payment transaction details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, loadData]);

  const handleDelete = async (): Promise<boolean> => {
    const result = await showDeleteConfirm("Are you sure you want to delete this room allotment payment record?");
    if (!result.isConfirmed) {
      return false;
    }
    showLoading("Deleting...", "Please wait");
    try {
      await RoomAllotmentPaymentsApi.deleteRoomAllotmentPayment(id);
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
    payment,
    isLoading,
    error,
    handleDelete,
    reload: loadData,
  };
};
