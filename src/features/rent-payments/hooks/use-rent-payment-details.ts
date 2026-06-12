import { useState, useEffect, useCallback } from "react";
import { RentPaymentsApi } from "../api";
import { RentPayment } from "../types";
import { showDeleteConfirm, showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export const useRentPaymentDetails = (id: string) => {
  const [payment, setPayment] = useState<RentPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await RentPaymentsApi.getRentPaymentById(id);
      setPayment(data);
    } catch (err: any) {
      setError(err.message || "Failed to load rent payment details.");
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
    const result = await showDeleteConfirm("Are you sure you want to delete this rent payment entry?");
    if (!result.isConfirmed) {
      return false;
    }
    showLoading("Deleting...", "Please wait");
    try {
      await RentPaymentsApi.deleteRentPayment(id);
      closeLoading();
      await showSuccess("Deleted Successfully", "Record has been removed successfully.");
      return true;
    } catch (err: any) {
      closeLoading();
      showError("Delete Failed", err.message || "Failed to delete rent payment entry.");
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
