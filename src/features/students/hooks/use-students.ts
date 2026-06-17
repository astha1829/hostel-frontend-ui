import { useState, useEffect, useCallback } from "react";
import { StudentsApi } from "../api";
import { Student, StudentQueryParams } from "../types";
import { showDeleteConfirm, showDeleteSuccess, showDeleteError, showLoading, closeLoading } from "@/utils/swal";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filter States
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedNationality, setSelectedNationality] = useState("");
  const [selectedStudentType, setSelectedStudentType] = useState("");
  const [selectedKycVerified, setSelectedKycVerified] = useState<string>("all"); // "all", "true", "false"
  
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: StudentQueryParams = {
        page: currentPage,
        limit,
        search: search.trim() || undefined,
        college: selectedCollege || undefined,
        nationality: selectedNationality || undefined,
        student_type: selectedStudentType || undefined,
      };

      if (selectedKycVerified === "true") {
        queryParams.kyc_verified = true;
      } else if (selectedKycVerified === "false") {
        queryParams.kyc_verified = false;
      }

      const res = await StudentsApi.getStudents(queryParams);
      setStudents(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve student records.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, search, selectedCollege, selectedNationality, selectedStudentType, selectedKycVerified]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCollege, selectedNationality, selectedStudentType, selectedKycVerified]);

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm("Are you sure you want to delete this student profile?");
    if (!result.isConfirmed) return;

    showLoading("Deleting student...", "Please wait");
    try {
      await StudentsApi.deleteStudent(id);
      closeLoading();
      await showDeleteSuccess();
      loadData();
    } catch (err: any) {
      closeLoading();
      await showDeleteError();
    }
  };

  return {
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedCollege,
    setSelectedCollege,
    selectedNationality,
    setSelectedNationality,
    selectedStudentType,
    setSelectedStudentType,
    selectedKycVerified,
    setSelectedKycVerified,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    handleDelete,
    reload: loadData,
  };
};

