import Swal from "sweetalert2";

/**
 * Shows a success alert dialog.
 */
export const showSuccess = async (title: string, text: string = "Record has been created successfully.") => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#4F46E5'
  });
};

/**
 * Shows an error alert dialog.
 */
export const showError = async (title: string, text: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#EF4444'
  });
};

/**
 * Shows a delete confirmation dialog.
 */
export const showDeleteConfirm = async (text: string = "This action cannot be undone.") => {
  return Swal.fire({
    title: 'Are you sure?',
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel'
  });
};

/**
 * Shows a cancel/discard confirmation dialog.
 */
export const showCancelConfirm = async (text: string = "Unsaved changes will be lost.") => {
  return Swal.fire({
    title: 'Discard Changes?',
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Discard',
    cancelButtonText: 'Continue Editing',
    confirmButtonColor: '#F59E0B'
  });
};

/**
 * Shows a processing loading spinner dialog.
 */
export const showLoading = (title: string = "Processing...", text: string = "Please wait") => {
  Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

/**
 * Closes the currently active SweetAlert2 dialog (e.g. the loading dialog).
 */
export const closeLoading = () => {
  Swal.close();
};
