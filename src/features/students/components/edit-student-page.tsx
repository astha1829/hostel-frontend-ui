"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, X, MoreVertical, FileText, Image as ImageIcon, Trash2, Building2, Layers, ShieldCheck, Users, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { DocumentPreviewModal } from "@/components/ui/document-preview-modal";
import { useStudentDetails } from "../hooks/use-student-details";

interface EditStudentPageProps {
  id: string;
}

export const EditStudentPage: React.FC<EditStudentPageProps> = ({ id }) => {
  const router = useRouter();

  const {
    student,
    hostels,
    isLoading,
    isSaving,
    error,
    formData,
    formErrors,
    handleInputChange,
    saveChanges,
    reload,
  } = useStudentDetails(id, true);

  const [previewModal, setPreviewModal] = React.useState<{isOpen: boolean; url: string; name: string}>({isOpen: false, url: '', name: ''});
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeUploadField, setActiveUploadField] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto">
        <DetailFormSkeleton />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto">
        <ErrorState
          title="Student Not Found"
          message={error || "The requested student record could not be found."}
          onRetry={reload}
          isLoading={isLoading}
        />
      </div>
    );
  }

  const getFileUrl = (path?: string | null): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
    const backendHost = apiBase.replace(/\/api\/?$/, "");
    return `${backendHost}/${path}`;
  };

  const hostelOptions = [
    { label: "No Hostel Assigned", value: "" },
    ...hostels.map((h) => ({
      label: h.hostel_name,
      value: h.id,
    })),
  ];

  const InputField = ({ label, value, onChange, error, type = "text", required = false }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className="form-label">{label} {required && <span className="text-red-500">*</span>}</label>
      <Input
        type={type}
        
        value={value}
        onChange={onChange}
        error={error}
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, error, required = false }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className="form-label">{label} {required && <span className="text-red-500">*</span>}</label>
      <Select
        
        value={value}
        onChange={onChange}
        options={options}
        error={error}
      />
    </div>
  );

  const SectionBadge = ({ num, title }: { num: number; title: string }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-[24px] h-[24px] bg-[#5B3DF5] rounded text-white flex items-center justify-center text-[12px] font-[700]">{num}</div>
      <h3 className="text-[16px] font-[700] text-[#0F172A]">{title}</h3>
    </div>
  );

  const StatusPill = ({ label, active }: { label: string; active: boolean }) => (
    <div className={`px-3 py-1.5 rounded-full text-[12px] font-[600] flex items-center gap-1.5 ${active ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]' : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'}`}>
      {active && <CheckCircle2 size={14} />}
      <span>{label}</span>
    </div>
  );

  const handleViewDocument = (path: string | null | undefined, title: string) => {
    if (!path) return;
    const url = getFileUrl(path);
    const isPdf = url.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      window.open(url, '_blank');
    } else {
      setPreviewModal({ isOpen: true, url, name: title });
    }
  };

  const handleReplaceClick = (field: string) => {
    setActiveUploadField(field);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadField) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    try {
      // Simulate API upload
      // Since useStudentDetails manages API, we can either call the API directly or update the form data.
      // The prompt asks to "Refresh preview instantly", so we use StudentsApi directly if we had it, 
      // but since we only have handleFileChange from hook, we can just call it for the UI update
      // Wait, handleFileChange only updates local state. The user said: "Update database record"
      // So we must use StudentsApi directly.
      const { StudentsApi } = await import('../api');
      const { showLoading, closeLoading, showSuccess, showError } = await import('@/utils/swal');
      
      showLoading("Uploading document...", "Please wait");
      await StudentsApi.updateStudent(id, {}, { [activeUploadField]: file });
      await reload(); // Refresh data
      closeLoading();
      showSuccess("Document updated successfully", "The file has been uploaded.");
    } catch (err: any) {
      const { closeLoading, showError } = await import('@/utils/swal');
      closeLoading();
      showError("Upload Failed", err.message || "Failed to upload document.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setActiveUploadField(null);
    }
  };

  const handleDeleteDocument = async (field: string) => {
    const { showDeleteConfirm, showLoading, closeLoading, showDeleteSuccess, showDeleteError } = await import('@/utils/swal');
    const result = await showDeleteConfirm("Are you sure you want to delete this document?");
    if (!result.isConfirmed) return;
    
    try {
      const { StudentsApi } = await import('../api');
      showLoading("Deleting document...", "Please wait");
      await StudentsApi.updateStudent(id, { [field]: "" } as any, {});
      await reload();
      closeLoading();
      await showDeleteSuccess();
    } catch (err: any) {
      closeLoading();
      await showDeleteError();
    }
  };

  const DocCard = ({ title, path, field }: any) => (
    <div className="border border-[#E2E8F0] rounded-[10px] p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-[36px] h-[36px] rounded flex items-center justify-center ${path ? 'bg-[#EEF2FF] text-[#5B3DF5]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
          {field.includes('profile') ? <ImageIcon size={18} /> : <FileText size={18} />}
        </div>
        <div className="flex flex-col">
          <span className="form-label">{title}</span>
          {path ? (
            <span className="text-[11px] font-[600] text-[#16A34A] mt-0.5">Uploaded</span>
          ) : (
            <span className="text-[11px] font-[500] text-[#94A3B8] mt-0.5">No file uploaded</span>
          )}
          <div className="flex gap-2 text-[11px] font-[600] mt-1">
            <span 
              className={`${path ? 'text-[#5B3DF5] cursor-pointer hover:underline' : 'text-[#94A3B8] cursor-not-allowed opacity-50'}`}
              onClick={() => path && handleViewDocument(path, title)}
            >
              View
            </span>
            <span 
              className="text-[#5B3DF5] cursor-pointer hover:underline"
              onClick={() => handleReplaceClick(field)}
            >
              Replace
            </span>
          </div>
        </div>
      </div>
      <Trash2 
        size={16} 
        className={`${path ? 'text-[#EF4444] hover:text-[#DC2626] cursor-pointer' : 'text-[#94A3B8] cursor-not-allowed opacity-50'}`} 
        onClick={() => path && handleDeleteDocument(field)} 
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter">
      <div className="max-w-[1600px] mx-auto px-[20px] py-[16px]">
        {/* Top Action Bar */}
        <div className="flex justify-between items-center mb-5">
          <button onClick={() => router.push('/students')} className="flex items-center gap-2 text-[14px] font-[600] text-[#5B3DF5] hover:text-[#4C33D1]">
            <ChevronLeft size={16} /> Back to Students
          </button>
          <div className="flex gap-3">
            <Button variant="outline" className="h-[44px] px-5 bg-white border-[#E2E8F0] text-[#334155] rounded-[8px] font-[600]" onClick={() => router.push(`/students/${id}`)}>
              <X size={16} className="mr-2" /> Cancel
            </Button>
            <Button className="h-[44px] px-5 bg-[#5B3DF5] hover:bg-[#4C33D1] text-white rounded-[8px] font-[600]" onClick={saveChanges} isLoading={isSaving}>
              <Save size={16} className="mr-2" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Profile Hero */}
        <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm px-5 py-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={student.profile_pic ? getFileUrl(student.profile_pic) : `https://ui-avatars.com/api/?name=${student.student_name}&background=EEF2FF&color=5B3DF5`} className="w-[64px] h-[64px] rounded-full object-cover border border-[#E2E8F0]" />
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[20px] font-[700] text-[#0F172A] uppercase tracking-wide">{student.student_name} {student.last_name}</h2>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded flex items-center justify-center bg-[#F1F5F9]"><FileText size={12} className="text-[#64748B]"/></span>
                <span className="text-[13px] font-[500] text-[#64748B] tracking-wide">{student.student_registration_id}</span>
                <div className="w-4 h-4 ml-1 cursor-pointer text-[#94A3B8] hover:text-[#5B3DF5]"><Copy size={14}/></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="bg-[#DCFCE7] text-[#16A34A] px-3 py-1 rounded-full text-[13px] font-[600] border border-[#BBF7D0]">
              Active Resident
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-[32px] h-[32px] rounded bg-[#EEF2FF] flex items-center justify-center text-[#5B3DF5]">
                <Building2 size={16}/>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-[500] text-[#64748B]">Assigned Hostel</span>
                <span className="text-[14px] font-[600] text-[#0F172A]">{student.hostel?.hostel_name || "Unassigned"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[32px] h-[32px] rounded bg-[#EEF2FF] flex items-center justify-center text-[#5B3DF5]">
                <Layers size={16}/>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-[500] text-[#64748B]">Current Room</span>
                <span className="text-[14px] font-[600] text-[#0F172A]">{student.room?.room_no ? `Room ${student.room.room_no} - Floor ${student.room.floor?.floor_no || 1}` : "Unassigned"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className="grid" style={{ gridTemplateColumns: '2.4fr 0.95fr', gap: '16px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-[10px]">
            
            {/* 1. Personal Information */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm px-4 py-4">
              <SectionBadge num={1} title="Personal Information" />
              <div className="grid grid-cols-3 gap-[12px]">
                <InputField label="First Name" required value={formData.student_name || ""} onChange={(e: any) => handleInputChange("student_name", e.target.value)} error={formErrors.student_name} />
                <InputField label="Last Name" required value={formData.last_name || ""} onChange={(e: any) => handleInputChange("last_name", e.target.value)} />
                <InputField label="Registration ID" required value={formData.student_registration_id || ""} onChange={(e: any) => handleInputChange("student_registration_id", e.target.value)} />
                
                <InputField label="User ID" value={formData.user_id || ""} onChange={(e: any) => handleInputChange("user_id", e.target.value)} />
                <SelectField label="Nationality" required value={formData.nationality || ""} onChange={(e: any) => handleInputChange("nationality", e.target.value)} options={[{label: "India", value: "India"}, {label: "Other", value: "Other"}]} error={formErrors.nationality} />
                <SelectField label="Gender" required value={formData.gender || ""} onChange={(e: any) => handleInputChange("gender", e.target.value)} options={[{label: "Male", value: "Male"}, {label: "Female", value: "Female"}]} />
                
                <InputField label="Date Of Birth" required type="date" value={formData.date_of_birth || ""} onChange={(e: any) => handleInputChange("date_of_birth", e.target.value)} />
                <InputField label="Course Enrolled" required value={formData.course || ""} onChange={(e: any) => handleInputChange("course", e.target.value)} />
                <SelectField label="Enrollment Type" required value={formData.student_type || ""} onChange={(e: any) => handleInputChange("student_type", e.target.value)} options={[{label: "Regular", value: "Regular"}]} error={formErrors.student_type} />
                
                <InputField label="College / Institution" required value={formData.college || ""} onChange={(e: any) => handleInputChange("college", e.target.value)} error={formErrors.college} />
                <SelectField label="Meal Choice" value={formData.meal_type || ""} onChange={(e: any) => handleInputChange("meal_type", e.target.value)} options={[{label: "Vegetarian", value: "Veg"}, {label: "Non-Vegetarian", value: "Non-Veg"}]} />
                <SelectField label="Assigned Residence" required value={formData.hostel_id || ""} onChange={(e: any) => handleInputChange("hostel_id", e.target.value)} options={hostelOptions} />
              </div>
            </div>

            {/* 2. Permanent Address */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm px-4 py-4">
              <SectionBadge num={2} title="Permanent Address" />
              <InputField label="Full Address" required value={formData.address || ""} onChange={(e: any) => handleInputChange("address", e.target.value)} />
            </div>

            {/* 3. Contact Information */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm px-4 py-4">
              <SectionBadge num={3} title="Contact Information" />
              
              <div className="text-[13px] font-[700] text-[#0F172A] mb-3 mt-1">Student Contact</div>
              <div className="grid grid-cols-3 gap-[12px] mb-4">
                <InputField label="Student Email Address" required value={formData.student_email || ""} onChange={(e: any) => handleInputChange("student_email", e.target.value)} error={formErrors.student_email} />
                <InputField label="Student Mobile No" required value={formData.contact || ""} onChange={(e: any) => handleInputChange("contact", e.target.value)} />
                <InputField label="Local Mobile No" value={formData.local_mobile_no || ""} onChange={(e: any) => handleInputChange("local_mobile_no", e.target.value)} />
              </div>
              
              <div className="text-[13px] font-[700] text-[#0F172A] mb-3">Guardian Contact</div>
              <div className="grid grid-cols-3 gap-[12px]">
                <InputField label="Parent Email Address" required value={formData.parent_email || ""} onChange={(e: any) => handleInputChange("parent_email", e.target.value)} error={formErrors.parent_email} />
                <InputField label="Parent Emergency Mobile No" required value={formData.parent_emergency_contact || ""} onChange={(e: any) => handleInputChange("parent_emergency_contact", e.target.value)} />
                <InputField label="Alternative Mobile No" value={formData.alternative_contact || ""} onChange={(e: any) => handleInputChange("alternative_contact", e.target.value)} />
              </div>
            </div>

            {/* 4. Identity Documents */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm px-4 py-4">
              <SectionBadge num={4} title="Identity Documents" />
              <div className="grid grid-cols-4 gap-[12px]">
                <InputField label="Passport Number" required value={formData.passport_no || ""} onChange={(e: any) => handleInputChange("passport_no", e.target.value)} error={formErrors.passport_no} />
                <div className="border border-[#E2E8F0] rounded-[8px] p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={student.profile_pic ? getFileUrl(student.profile_pic) : `https://ui-avatars.com/api/?name=${student.student_name}&background=EEF2FF&color=5B3DF5`} className="w-[32px] h-[32px] rounded object-cover bg-slate-100" />
                    <div className="flex flex-col">
                      <span className="text-[12px] font-[600] text-[#0F172A]">Profile Photo <span className="text-red-500">*</span></span>
                      {student.profile_pic ? (
                        <span className="text-[10px] font-[600] text-[#16A34A]">Uploaded</span>
                      ) : (
                        <span className="text-[10px] font-[500] text-[#94A3B8]">Not Uploaded</span>
                      )}
                      <div className="flex gap-2 text-[10px] font-[600] mt-0.5">
                        <span 
                          className={`${student.profile_pic ? 'text-[#5B3DF5] cursor-pointer hover:underline' : 'text-[#94A3B8] cursor-not-allowed opacity-50'}`}
                          onClick={() => student.profile_pic && handleViewDocument(student.profile_pic, "Profile Photo")}
                        >
                          View
                        </span>
                        <span 
                          className="text-[#5B3DF5] cursor-pointer hover:underline"
                          onClick={() => handleReplaceClick("profile_pic")}
                        >
                          Replace
                        </span>
                      </div>
                    </div>
                  </div>
                  <Trash2 
                    size={14} 
                    className={`${student.profile_pic ? 'text-[#EF4444] hover:text-[#DC2626] cursor-pointer' : 'text-[#94A3B8] cursor-not-allowed opacity-50'}`}
                    onClick={() => student.profile_pic && handleDeleteDocument("profile_pic")}
                  />
                </div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-[32px] h-[32px] rounded flex items-center justify-center ${student.passport_image_1 ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}><FileText size={16}/></div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-[600] text-[#0F172A]">Passport Page 1 <span className="text-red-500">*</span></span>
                      {student.passport_image_1 ? (
                        <span className="text-[10px] font-[600] text-[#16A34A]">Uploaded</span>
                      ) : (
                        <span className="text-[10px] font-[500] text-[#94A3B8]">Not Uploaded</span>
                      )}
                      <div className="flex gap-2 text-[10px] font-[600] mt-0.5">
                        <span 
                          className={`${student.passport_image_1 ? 'text-[#5B3DF5] cursor-pointer hover:underline' : 'text-[#94A3B8] cursor-not-allowed opacity-50'}`}
                          onClick={() => student.passport_image_1 && handleViewDocument(student.passport_image_1, "Passport Page 1")}
                        >
                          View
                        </span>
                        <span 
                          className="text-[#5B3DF5] cursor-pointer hover:underline"
                          onClick={() => handleReplaceClick("passport_image_1")}
                        >
                          Replace
                        </span>
                      </div>
                    </div>
                  </div>
                  <Trash2 
                    size={14} 
                    className={`${student.passport_image_1 ? 'text-[#EF4444] hover:text-[#DC2626] cursor-pointer' : 'text-[#94A3B8] cursor-not-allowed opacity-50'}`}
                    onClick={() => student.passport_image_1 && handleDeleteDocument("passport_image_1")}
                  />
                </div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-[32px] h-[32px] rounded flex items-center justify-center ${student.passport_image_2 ? 'bg-[#FFEDD5] text-[#EA580C]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}><FileText size={16}/></div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-[600] text-[#0F172A]">Passport Page 2 <span className="text-red-500">*</span></span>
                      {student.passport_image_2 ? (
                        <span className="text-[10px] font-[600] text-[#16A34A]">Uploaded</span>
                      ) : (
                        <span className="text-[10px] font-[500] text-[#94A3B8]">Not Uploaded</span>
                      )}
                      <div className="flex gap-2 text-[10px] font-[600] mt-0.5">
                        <span 
                          className={`${student.passport_image_2 ? 'text-[#5B3DF5] cursor-pointer hover:underline' : 'text-[#94A3B8] cursor-not-allowed opacity-50'}`}
                          onClick={() => student.passport_image_2 && handleViewDocument(student.passport_image_2, "Passport Page 2")}
                        >
                          View
                        </span>
                        <span 
                          className="text-[#5B3DF5] cursor-pointer hover:underline"
                          onClick={() => handleReplaceClick("passport_image_2")}
                        >
                          Replace
                        </span>
                      </div>
                    </div>
                  </div>
                  <Trash2 
                    size={14} 
                    className={`${student.passport_image_2 ? 'text-[#EF4444] hover:text-[#DC2626] cursor-pointer' : 'text-[#94A3B8] cursor-not-allowed opacity-50'}`}
                    onClick={() => student.passport_image_2 && handleDeleteDocument("passport_image_2")}
                  />
                </div>
              </div>
            </div>

            {/* 5. Verification & Reviews */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm px-4 py-4">
              <SectionBadge num={5} title="Verification & Reviews" />
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[12px] font-[600] text-[#64748B] mb-2">Verification</div>
                    <div className="flex flex-wrap gap-2">
                      <StatusPill label="KYC Verified" active={student.kyc_verified} />
                      <StatusPill label="Mobile No Verified" active={student.student_mobile_verified} />
                      <StatusPill label="Email Verified" active={student.student_email_verified} />
                      <StatusPill label="Parent Mobile Verified" active={student.parent_mobile_verified} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] font-[600] text-[#64748B] mb-2">Document Reviews</div>
                    <div className="flex flex-wrap gap-2">
                      <StatusPill label="Passport Reviewed" active={student.passport_copy_reviewed} />
                      <StatusPill label="Passport Copy Reviewed" active={student.passport_copy_reviewed} />
                      <StatusPill label="Profile Pic Reviewed" active={student.profile_picture_reviewed} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-[12px] font-[600] text-[#64748B] mb-2">Other</div>
                  <div className="flex gap-4 items-end">
                    <div className="flex gap-4 mb-2">
                      <label className="flex items-center gap-2 text-[13px] font-[500] text-[#0F172A]"><input type="checkbox" checked={formData.home_town || false} onChange={(e: any) => handleInputChange("home_town", e.target.checked)} className="w-4 h-4 rounded border-[#E2E8F0]" /> Is Home Town</label>
                      <label className="flex items-center gap-2 text-[13px] font-[500] text-[#0F172A]"><input type="checkbox" checked={formData.no_notification || false} onChange={(e: any) => handleInputChange("no_notification", e.target.checked)} className="w-4 h-4 rounded border-[#E2E8F0]" /> Mute Notifications</label>
                    </div>
                    <div className="flex-1 max-w-[200px]">
                      <InputField label="Arrival Datetime" type="datetime-local" value={formData.arrival_datetime || ""} onChange={(e: any) => handleInputChange("arrival_datetime", e.target.value)} />
                    </div>
                    <div className="flex-1 max-w-[200px]">
                      <InputField label="Reviewed By Username" value={student.reviewed_by || ""} onChange={() => {}} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            
            {/* Student Summary */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-[15px] font-[700] text-[#0F172A]">
                  <Users size={16} className="text-[#5B3DF5]" /> Student Summary
                </div>
                <MoreVertical size={16} className="text-[#94A3B8]" />
              </div>
              
              <div className="flex flex-col items-center mb-5">
                <img src={student.profile_pic ? getFileUrl(student.profile_pic) : `https://ui-avatars.com/api/?name=${student.student_name}&background=EEF2FF&color=5B3DF5`} className="w-[80px] h-[80px] rounded-full object-cover border-[3px] border-[#EEF2FF] mb-2" />
                <h3 className="text-[16px] font-[700] text-[#0F172A] uppercase tracking-wide">{student.student_name} {student.last_name}</h3>
                <span className="text-[13px] font-[500] text-[#64748B] mt-0.5">{student.student_registration_id}</span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[13px] font-[500] text-[#64748B]"><Building2 size={14}/> Hostel</span>
                  <span className="form-label">{student.hostel?.hostel_name || "Unassigned"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[13px] font-[500] text-[#64748B]"><Layers size={14}/> Room</span>
                  <span className="form-label">{student.room?.room_no ? `Room ${student.room.room_no} - Floor ${student.room.floor?.floor_no || 1}` : "Unassigned"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[13px] font-[500] text-[#64748B]"><FileText size={14}/> Course</span>
                  <span className="form-label">{student.course}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[13px] font-[500] text-[#64748B]"><Users size={14}/> Enrollment</span>
                  <span className="form-label">{student.student_type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[13px] font-[500] text-[#64748B]"><FileText size={14}/> Meal Choice</span>
                  <span className="form-label">{student.meal_type === "Veg" ? "Vegetarian" : "Non-Vegetarian"}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="flex items-center gap-2 text-[13px] font-[500] text-[#64748B]"><ShieldCheck size={14}/> Status</span>
                  <div className="bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded text-[11px] font-[600]">Active Resident</div>
                </div>
              </div>
            </div>

            {/* Identity Documents */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm p-4">
              <div className="flex items-center gap-2 text-[15px] font-[700] text-[#0F172A] mb-4">
                <FileText size={16} className="text-[#5B3DF5]" /> Identity Documents
              </div>
              <div className="grid grid-cols-2 gap-3">
                <DocCard title="Passport" path={true} field="passport" />
                <DocCard title="Profile Photo" path={student.profile_pic} field="profile" />
                <DocCard title="Passport Page 1" path={student.passport_image_1} field="passport_page_1" />
                <DocCard title="Passport Page 2" path={student.passport_image_2} field="passport_page_2" />
              </div>
            </div>

            {/* Verification & Reviews */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm p-4">
              <div className="flex items-center gap-2 text-[15px] font-[700] text-[#0F172A] mb-4">
                <ShieldCheck size={16} className="text-[#5B3DF5]" /> Verification & Reviews
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label="KYC Verified" active={student.kyc_verified} />
                <StatusPill label="Mobile Verified" active={student.student_mobile_verified} />
                <StatusPill label="Email Verified" active={student.student_email_verified} />
                <StatusPill label="Parent Mobile Verified" active={student.parent_mobile_verified} />
                <StatusPill label="Parent Email Verified" active={student.parent_email_verified} />
                <StatusPill label="Passport Reviewed" active={student.passport_copy_reviewed} />
                <StatusPill label="Passport Copy Reviewed" active={student.passport_copy_reviewed} />
                <StatusPill label="Profile Pic Reviewed" active={student.profile_picture_reviewed} />
              </div>
            </div>

          </div>
        </div>

        {/* Hidden file input for document replacement */}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleFileSelected}
        />

        {/* Document Preview Modal */}
        <DocumentPreviewModal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal({ isOpen: false, url: '', name: '' })}
          fileUrl={previewModal.url}
          fileName={previewModal.name}
        />

      </div>
    </div>
  );
};
