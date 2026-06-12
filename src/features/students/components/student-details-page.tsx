"use client";

import React, { useState } from "react";
import {
  Edit2, Save, X, RefreshCw, CheckCircle2, Building2, Layers,
  Users, Mail, Phone, FileText, Image as ImageIcon, ExternalLink,
  Copy, Check, FileCheck, Calendar, ShieldCheck, MapPin, CreditCard, History
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useStudentDetails } from "../hooks/use-student-details";
import { showCancelConfirm } from "@/utils/swal";
import { StudentWalletTab } from "@/features/wallet/components/student-wallet-tab";

interface StudentDetailsPageProps {
  id: string;
}

export const StudentDetailsPage: React.FC<StudentDetailsPageProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [copied, setCopied] = useState<boolean>(false);

  const {
    student,
    hostels,
    isLoading,
    isSaving,
    error,
    isEditMode,
    formData,
    selectedFiles,
    formErrors,
    successMessage,
    toggleEditMode,
    handleInputChange,
    handleFileChange,
    saveChanges,
    reload,
  } = useStudentDetails(id);

  const isDirty = React.useMemo(() => {
    if (!student) return false;
    if (selectedFiles.profile_pic || selectedFiles.passport_image_1 || selectedFiles.passport_image_2) {
      return true;
    }
    const studentDob = student.date_of_birth ? student.date_of_birth.substring(0, 10) : "";
    const formDob = formData.date_of_birth || "";
    if (studentDob !== formDob) return true;

    const studentArrival = student.arrival_datetime ? new Date(student.arrival_datetime).toISOString().slice(0, 16) : "";
    const formArrival = formData.arrival_datetime || "";
    if (studentArrival !== formArrival) return true;

    const fieldsToCompare = [
      "user_id", "student_registration_id", "student_name", "last_name", "college", "course",
      "student_type", "meal_type", "nationality", "gender", "address", "passport_no",
      "student_email", "parent_email", "contact", "parent_emergency_contact", "local_mobile_no",
      "alternative_contact", "home_town", "no_notification", "passport_no_reviewed",
      "passport_copy_reviewed", "profile_picture_reviewed", "student_mobile_verified",
      "student_email_verified", "parent_mobile_verified", "parent_email_verified", "kyc_verified",
      "hostel_id"
    ];

    for (const field of fieldsToCompare) {
      const studentVal = (student as any)[field] ?? "";
      const formVal = (formData as any)[field] ?? "";
      if (studentVal.toString() !== formVal.toString()) {
        return true;
      }
    }
    return false;
  }, [student, formData, selectedFiles]);

  const handleCancelEdit = async () => {
    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) return;
    }
    toggleEditMode();
  };

  if (isLoading) {
    return <DetailFormSkeleton />;
  }

  if (error || !student) {
    return (
      <ErrorState
        title="Failed to Retrieve Student Details"
        message={error || "The requested student record could not be found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const getFileUrl = (path?: string | null): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
    const backendHost = apiBase.replace(/\/api\/?$/, "");
    return `${backendHost}/${path}`;
  };

  const handleCopyRegistration = () => {
    if (!student.student_registration_id) return;
    navigator.clipboard.writeText(student.student_registration_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getKycStatusBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="success">KYC Verified</Badge>
    ) : (
      <Badge variant="danger">KYC Pending</Badge>
    );
  };

  // Header Actions
  const headerActions = (
    <div className="flex gap-3 items-center">
      {isEditMode ? (
        <>
          <Button variant="secondary" size="md" onClick={handleCancelEdit} disabled={isSaving}>
            <X size={16} />
            <span>Cancel</span>
          </Button>
          <Button variant="primary" size="md" onClick={saveChanges} isLoading={isSaving}>
            <Save size={16} />
            <span>Save Changes</span>
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="md" onClick={reload} className="px-2" title="Reload details">
            <RefreshCw size={16} />
          </Button>
          <Button variant="primary" size="md" onClick={toggleEditMode}>
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </Button>
        </>
      )}
    </div>
  );

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const mealTypeOptions = [
    { label: "Vegetarian", value: "Veg" },
    { label: "Non-Vegetarian", value: "Non-Veg" },
  ];

  const hostelOptions = [
    { label: "No Hostel Assigned", value: "" },
    ...hostels.map((h) => ({
      label: h.hostel_name,
      value: h.id,
    })),
  ];

  // Helper component to render clean file attachments with thumbnail preview
  const FileAttachmentCard = ({ label, path }: { label: string; path?: string | null }) => {
    if (!path) {
      return (
        <div className="flex items-center gap-3 py-3 px-4 border border-dashed border-border rounded-md bg-secondary/10">
          <div className="w-9 h-9 rounded-sm bg-secondary flex items-center justify-center text-muted-foreground/80 shrink-0">
            <FileText size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
            <span className="text-xs text-muted-foreground/80 mt-0.5 italic">No file attached</span>
          </div>
        </div>
      );
    }

    const fileUrl = getFileUrl(path);
    const fileName = path.split("/").pop() || "download";

    return (
      <div 
        className="flex items-center justify-between py-3 px-4 border border-border rounded-md bg-card shadow-sm transition-all room-pill-hover hover:border-primary/40 hover:shadow-md"
      >
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className="w-9 h-9 rounded-sm overflow-hidden border border-border bg-secondary flex items-center justify-center shrink-0">
            <img 
              src={fileUrl} 
              alt={label} 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
                const parent = (e.target as HTMLElement).parentElement;
                if (parent && !parent.querySelector('.fallback-icon')) {
                  const icon = document.createElement('div');
                  icon.className = 'fallback-icon flex items-center justify-center text-primary';
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                  parent.appendChild(icon);
                }
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden flex-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-primary mt-0.5 truncate inline-block hover:underline hover-underline"
              title={fileName}
            >
              {fileName}
            </a>
          </div>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground p-2 rounded-sm inline-flex items-center justify-center bg-secondary shrink-0 transition-colors btn-ghost-edit hover:bg-primary hover:text-primary-foreground"
          title="Open in new window"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    );
  };

  // Helper component to render reviewed/verified indicator flags
  const VerificationIndicator = ({ label, isTrue }: { label: string; isTrue: boolean }) => (
    <div className={`flex items-center gap-2.5 py-2.5 px-3.5 rounded-md border transition-all ${
      isTrue 
        ? "border-success/15 bg-success/5" 
        : "border-border/60 bg-secondary/15"
    }`}>
      {isTrue ? (
        <CheckCircle2 size={16} className="text-success shrink-0" />
      ) : (
        <div className="w-4 h-4 rounded-full border border-dashed border-muted-foreground/60 shrink-0" />
      )}
      <span className={`text-[13px] font-semibold tracking-tight ${
        isTrue ? "text-foreground" : "text-muted-foreground"
      }`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-success/15 text-success border border-success/25 rounded-md text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title={student.student_name + (student.last_name ? ` ${student.last_name}` : "")}
        description={isEditMode ? "Modifying resident administrative details" : "Student master profile registry, contact credentials, and KYC status"}
        backHref="/students"
        backText="Back to Students"
        actions={headerActions}
        className="mb-1"
      />

      {/* Top Tabs */}
      <div className="flex border-b border-border gap-6 mb-2">
        {[
          { id: "basic", label: "Basic Details" },
          { id: "contracts", label: "Hostel Contract History" },
          { id: "noc", label: "NOC" },
          { id: "payments", label: "Hostel Payment" },
          { id: "wallet", label: "Student Wallet" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-1 py-3 text-[15px] font-semibold bg-transparent border-none border-b-2 cursor-pointer transition-all duration-200 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Details View / Edit */}
      {activeTab === "basic" && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Student Profile Summary Header Card */}
          {!isEditMode && (
            <Card className="p-8 bg-gradient-to-b from-card to-secondary/10 border-border rounded-xl flex flex-col gap-6 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute -top-[50px] -right-[50px] w-[200px] h-[200px] bg-primary/5 blur-[40px] rounded-full pointer-events-none" />
              
              <div className="flex gap-7 items-center flex-wrap z-10">
                {/* Profile Avatar */}
                <div className="relative">
                  {student.profile_pic ? (
                    <img 
                      src={getFileUrl(student.profile_pic)} 
                      alt={student.student_name}
                      className="w-[5.5rem] h-[5.5rem] rounded-full object-cover border-[3px] border-card shadow-[0_0_0_2px_hsl(var(--primary)/0.2),var(--shadow-md)]"
                    />
                  ) : (
                    <div className="w-[5.5rem] h-[5.5rem] rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl shadow-md uppercase">
                      {student.student_name.charAt(0) + (student.last_name ? student.last_name.charAt(0) : "")}
                    </div>
                  )}
                </div>

                {/* Name & Quick Details */}
                <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-extrabold tracking-tight text-foreground m-0">
                      {student.student_name} {student.last_name || ""}
                    </h2>
                    {getKycStatusBadge(student.kyc_verified)}
                    <Badge variant="secondary">{student.student_type}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground m-0 font-semibold flex items-center gap-2">
                    <Building2 size={14} className="text-primary" />
                    <span className="text-foreground">{student.college}</span>
                    {student.course && (
                      <>
                        <span className="text-border">•</span>
                        <span>{student.course}</span>
                      </>
                    )}
                  </p>

                  {/* Reg ID Copy Strip */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reg ID:</span>
                    <code className="text-[13px] font-mono px-2 py-0.5 bg-secondary border border-border/80 rounded-sm text-foreground font-semibold">
                      {student.student_registration_id || "UNASSIGNED"}
                    </code>
                    {student.student_registration_id && (
                      <button 
                        onClick={handleCopyRegistration} 
                        className="bg-transparent border-none text-primary cursor-pointer p-1 inline-flex rounded-sm transition-colors hover:bg-primary/10"
                        title="Copy Registration ID"
                      >
                        {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/60" />

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 z-10">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Residence</span>
                  <span className="text-[15px] font-bold text-primary">
                    {student.hostel?.hostel_name || "No Hostel Assigned"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nationality</span>
                  <span className="text-[15px] font-bold text-foreground">{student.nationality}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Meal Preference</span>
                  <span className="text-[15px] font-bold text-foreground">
                    {student.meal_type === "Veg" ? "Vegetarian (Veg)" : student.meal_type === "Non-Veg" ? "Non-Vegetarian (Non-Veg)" : student.meal_type || "Veg"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender & DOB</span>
                  <span className="text-[15px] font-bold text-foreground">
                    {student.gender || "—"} {student.date_of_birth ? `(${new Date(student.date_of_birth).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })})` : ""}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Form Content */}
          {isEditMode ? (
            <div className="flex flex-col gap-6">
              
              {/* SECTION: Basic Details */}
              <SectionCard title="Edit Personal & College Details" description="Fill in standard identification details and institutional affiliations.">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Input
                    label="Given Name *"
                    value={formData.student_name || ""}
                    onChange={(e) => handleInputChange("student_name", e.target.value)}
                    error={formErrors.student_name}
                    disabled={isSaving}
                  />
                  <Input
                    label="Last Name"
                    value={formData.last_name || ""}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    disabled={isSaving}
                  />
                  <Input
                    label="Registration ID"
                    value={formData.student_registration_id || ""}
                    onChange={(e) => handleInputChange("student_registration_id", e.target.value)}
                    disabled={isSaving}
                  />
                  <Input
                    label="User ID"
                    value={formData.user_id || ""}
                    onChange={(e) => handleInputChange("user_id", e.target.value)}
                    disabled={isSaving}
                  />
                  <Input
                    label="College/Institution *"
                    value={formData.college || ""}
                    onChange={(e) => handleInputChange("college", e.target.value)}
                    error={formErrors.college}
                    disabled={isSaving}
                  />
                  <Input
                    label="Course Enrolled"
                    value={formData.course || ""}
                    onChange={(e) => handleInputChange("course", e.target.value)}
                    disabled={isSaving}
                  />
                  <Input
                    label="Nationality *"
                    value={formData.nationality || ""}
                    onChange={(e) => handleInputChange("nationality", e.target.value)}
                    error={formErrors.nationality}
                    disabled={isSaving}
                  />
                  <Select
                    label="Enrollment Type *"
                    value={formData.student_type}
                    onChange={(e) => handleInputChange("student_type", e.target.value)}
                    options={[
                      { label: "Regular", value: "Regular" },
                      { label: "International", value: "International" },
                      { label: "Scholar", value: "Scholar" },
                    ]}
                    disabled={isSaving}
                  />
                  <Select
                    label="Meal Choice"
                    value={formData.meal_type || ""}
                    onChange={(e) => handleInputChange("meal_type", e.target.value)}
                    options={[
                      { label: "Vegetarian", value: "Veg" },
                      { label: "Non-Vegetarian", value: "Non-Veg" },
                    ]}
                    disabled={isSaving}
                  />
                  <Select
                    label="Gender"
                    value={formData.gender || ""}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    options={genderOptions}
                    disabled={isSaving}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.date_of_birth || ""}
                    onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                    disabled={isSaving}
                  />
                  <Select
                    label="Assigned Residence"
                    value={formData.hostel_id || ""}
                    onChange={(e) => handleInputChange("hostel_id", e.target.value)}
                    options={hostelOptions}
                    disabled={isSaving}
                  />
                </div>
              </SectionCard>

              {/* SECTION: Address */}
              <SectionCard title="Edit Permanent Address" description="Permanent street address details.">
                <Input
                  label="Full Address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={isSaving}
                />
              </SectionCard>

              {/* SECTION: Contact Details */}
              <SectionCard title="Edit Contact Details" description="Student and parent emergency contact parameters.">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Input
                    label="Student Email Address"
                    type="email"
                    value={formData.student_email || ""}
                    onChange={(e) => handleInputChange("student_email", e.target.value)}
                    error={formErrors.student_email}
                    disabled={isSaving}
                  />
                  <Input
                    label="Student Mobile No"
                    value={formData.contact || ""}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    disabled={isSaving}
                  />
                  <Input
                    label="Local Mobile No"
                    value={formData.local_mobile_no || ""}
                    onChange={(e) => handleInputChange("local_mobile_no", e.target.value)}
                    disabled={isSaving}
                  />
                  <Input
                    label="Parent Email Address"
                    type="email"
                    value={formData.parent_email || ""}
                    onChange={(e) => handleInputChange("parent_email", e.target.value)}
                    error={formErrors.parent_email}
                    disabled={isSaving}
                  />
                  <Input
                    label="Parent Emergency Mobile No"
                    value={formData.parent_emergency_contact || ""}
                    onChange={(e) => handleInputChange("parent_emergency_contact", e.target.value)}
                    disabled={isSaving}
                  />
                  <Input
                    label="Alternative Mobile No"
                    value={formData.alternative_contact || ""}
                    onChange={(e) => handleInputChange("alternative_contact", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </SectionCard>

              {/* SECTION: Identity & File Uploads */}
              <SectionCard title="Edit Identity Documents" description="Upload student verification documentation, including profile pictures and passport copies.">
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Passport Number *"
                      value={formData.passport_no || ""}
                      onChange={(e) => handleInputChange("passport_no", e.target.value)}
                      error={formErrors.passport_no}
                      disabled={isSaving}
                    />
                    <Input
                      label="Upload Profile Photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("profile_pic", e.target.files?.[0] || null)}
                      disabled={isSaving}
                    />
                    <Input
                      label="Upload Passport Photo (Page 1)"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("passport_image_1", e.target.files?.[0] || null)}
                      disabled={isSaving}
                    />
                    <Input
                      label="Upload Passport Photo (Page 2)"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("passport_image_2", e.target.files?.[0] || null)}
                      disabled={isSaving}
                    />
                  </div>
                  {/* Current attachments details block */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-secondary/30 border border-border/60 rounded-md text-[13px] text-muted-foreground">
                    <div>Profile Photo: {selectedFiles.profile_pic ? <strong className="text-foreground">{selectedFiles.profile_pic.name}</strong> : student.profile_pic ? "Original exists" : "None"}</div>
                    <div>Passport Page 1: {selectedFiles.passport_image_1 ? <strong className="text-foreground">{selectedFiles.passport_image_1.name}</strong> : student.passport_image_1 ? "Original exists" : "None"}</div>
                    <div>Passport Page 2: {selectedFiles.passport_image_2 ? <strong className="text-foreground">{selectedFiles.passport_image_2.name}</strong> : student.passport_image_2 ? "Original exists" : "None"}</div>
                  </div>
                </div>
              </SectionCard>

              {/* SECTION: KYC Toggles */}
              <SectionCard title="Student KYC Reviews" description="Manage verification, verification status flags, and reviews metadata.">
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    
                    {/* Checkbox fields */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="kyc_verified"
                        checked={!!formData.kyc_verified}
                        onChange={(e) => handleInputChange("kyc_verified", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="kyc_verified" className="text-sm font-semibold">KYC Verified</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="passport_no_reviewed"
                        checked={!!formData.passport_no_reviewed}
                        onChange={(e) => handleInputChange("passport_no_reviewed", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="passport_no_reviewed" className="text-sm font-semibold">Passport No Reviewed</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="passport_copy_reviewed"
                        checked={!!formData.passport_copy_reviewed}
                        onChange={(e) => handleInputChange("passport_copy_reviewed", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="passport_copy_reviewed" className="text-sm font-semibold">Passport Copy Reviewed</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="profile_picture_reviewed"
                        checked={!!formData.profile_picture_reviewed}
                        onChange={(e) => handleInputChange("profile_picture_reviewed", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="profile_picture_reviewed" className="text-sm font-semibold">Profile Pic Reviewed</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="student_mobile_verified"
                        checked={!!formData.student_mobile_verified}
                        onChange={(e) => handleInputChange("student_mobile_verified", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="student_mobile_verified" className="text-sm font-semibold">Mobile No Verified</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="student_email_verified"
                        checked={!!formData.student_email_verified}
                        onChange={(e) => handleInputChange("student_email_verified", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="student_email_verified" className="text-sm font-semibold">Email Verified</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="parent_mobile_verified"
                        checked={!!formData.parent_mobile_verified}
                        onChange={(e) => handleInputChange("parent_mobile_verified", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="parent_mobile_verified" className="text-sm font-semibold">Parent Mobile Verified</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="parent_email_verified"
                        checked={!!formData.parent_email_verified}
                        onChange={(e) => handleInputChange("parent_email_verified", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="parent_email_verified" className="text-sm font-semibold">Parent Email Verified</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="home_town"
                        checked={!!formData.home_town}
                        onChange={(e) => handleInputChange("home_town", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="home_town" className="text-sm font-semibold">Is Home Town</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="no_notification"
                        checked={!!formData.no_notification}
                        onChange={(e) => handleInputChange("no_notification", e.target.checked)}
                        disabled={isSaving}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="no_notification" className="text-sm font-semibold">Mute Notifications</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    <Input
                      label="Arrival Datetime"
                      type="datetime-local"
                      value={formData.arrival_datetime || ""}
                      onChange={(e) => handleInputChange("arrival_datetime", e.target.value)}
                      disabled={isSaving}
                    />
                    <Input
                      label="Reviewed By Username"
                      value={formData.reviewed_by || ""}
                      onChange={(e) => handleInputChange("reviewed_by", e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </SectionCard>
            </div>
          ) : (
            // VIEW MODE: Grouped sections with premium typography
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                
                {/* Left Column: Student metadata */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Personal & College details */}
                  <SectionCard title="Academic & Enrollment Profile" description="Institutional credentials, user identifiers, and registration categories.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Given Name</span>
                        <span className="text-[15px] font-semibold text-foreground">{student.student_name}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Last Name</span>
                        <span className="text-[15px] font-semibold text-foreground">{student.last_name || "—"}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">User ID Identifier</span>
                        <span className="text-[13px] font-mono px-2 py-0.5 bg-secondary border border-border/80 rounded-sm text-foreground font-semibold self-start mt-0.5">{student.user_id || "—"}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">College / Institution</span>
                        <span className="text-[15px] font-semibold text-foreground">{student.college}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Course Enrolled</span>
                        <span className="text-[15px] font-semibold text-foreground">{student.course || "—"}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Enrollment Type Category</span>
                        <span className="text-[15px] font-semibold text-foreground">{student.student_type}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nationality</span>
                        <span className="text-[15px] font-semibold text-foreground">{student.nationality}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender Designation</span>
                        <span className="text-[15px] font-semibold text-foreground">{student.gender || "—"}</span>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Contact & Address info combined */}
                  <SectionCard title="Contact & Residency Credentials" description="Communication touchpoints for notifications, emergency contacts, and home town records.">
                    <div className="flex flex-col gap-7">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-primary mb-4 flex items-center gap-2">
                          <Phone size={14} />
                          <span>Contact Channels & Emergencies</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">
                          <div className="pb-2 border-b border-border/50">
                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Student Email</span>
                            {student.student_email ? (
                              <a href={`mailto:${student.student_email}`} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary mt-1 hover:underline">
                                <Mail size={14} />
                                <span>{student.student_email}</span>
                              </a>
                            ) : (
                              <span className="block text-[15px] font-semibold text-muted-foreground mt-1">—</span>
                            )}
                          </div>
                          <div className="pb-2 border-b border-border/50">
                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Student Mobile</span>
                            <span className="block text-[15px] font-semibold text-foreground mt-1">{student.contact || "—"}</span>
                          </div>
                          <div className="pb-2 border-b border-border/50">
                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Local Mobile No</span>
                            <span className="block text-[15px] font-semibold text-foreground mt-1">{student.local_mobile_no || "—"}</span>
                          </div>
                          <div className="pb-2 border-b border-border/50">
                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Parent Email</span>
                            {student.parent_email ? (
                              <a href={`mailto:${student.parent_email}`} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary mt-1 hover:underline">
                                <Mail size={14} />
                                <span>{student.parent_email}</span>
                              </a>
                            ) : (
                              <span className="block text-[15px] font-semibold text-muted-foreground mt-1">—</span>
                            )}
                          </div>
                          <div className="pb-2 border-b border-border/50">
                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Parent Emergency Contact</span>
                            <span className="block text-[15px] font-semibold text-foreground mt-1">{student.parent_emergency_contact || "—"}</span>
                          </div>
                          <div className="pb-2 border-b border-border/50">
                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Alternative Contact</span>
                            <span className="block text-[15px] font-semibold text-foreground mt-1">{student.alternative_contact || "—"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-border/50" />

                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-primary mb-3 flex items-center gap-2">
                          <MapPin size={14} />
                          <span>Permanent Address Registry</span>
                        </h4>
                        <div className="flex items-start gap-3 p-4 bg-secondary/10 border border-border/60 rounded-md">
                          <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Street Location Address</span>
                            <span className="text-[15px] font-semibold text-foreground mt-1 leading-relaxed">
                              {student.address || "No address listed on student profile."}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SectionCard>
                </div>

                {/* Right Column: Identity attachments & KYC verified flags */}
                <div className="flex flex-col gap-6">
                  
                  {/* Identity attachments display */}
                  <SectionCard title="Identity Details" description="Verified documentation credentials and file attachments.">
                    <div className="flex flex-col gap-5">
                      <div className="p-4 bg-secondary/10 border border-border/60 rounded-md flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Passport Number</span>
                          <span className="block text-lg font-bold text-foreground mt-1 font-mono">
                            {student.passport_no}
                          </span>
                        </div>
                        <ShieldCheck size={24} className="text-primary opacity-80" />
                      </div>
                      
                      {/* Files items */}
                      <div className="flex flex-col gap-3">
                        <FileAttachmentCard label="Resident Profile Photo" path={student.profile_pic} />
                        <FileAttachmentCard label="Passport ID Scan (Page 1)" path={student.passport_image_1} />
                        <FileAttachmentCard label="Passport Address Scan (Page 2)" path={student.passport_image_2} />
                      </div>
                    </div>
                  </SectionCard>

                  {/* KYC verified checkboxes indicators */}
                  <SectionCard title="KYC Verification Status" description="System verified checklist parameters and auditor review tags.">
                    <div className="flex flex-col gap-5">
                      
                      {/* Grid of indicators */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        <VerificationIndicator label="KYC Approved" isTrue={student.kyc_verified} />
                        <VerificationIndicator label="Passport No" isTrue={student.passport_no_reviewed} />
                        <VerificationIndicator label="Passport Copy" isTrue={student.passport_copy_reviewed} />
                        <VerificationIndicator label="Profile Pic" isTrue={student.profile_picture_reviewed} />
                        <VerificationIndicator label="Mobile Verified" isTrue={student.student_mobile_verified} />
                        <VerificationIndicator label="Email Verified" isTrue={student.student_email_verified} />
                        <VerificationIndicator label="Parent Phone" isTrue={student.parent_mobile_verified} />
                        <VerificationIndicator label="Parent Email" isTrue={student.parent_email_verified} />
                        <VerificationIndicator label="Local Home" isTrue={student.home_town} />
                        <VerificationIndicator label="Notifs Active" isTrue={!student.no_notification} />
                      </div>

                      {/* Review details */}
                      <div className="p-4 bg-secondary/15 rounded-md border border-border/60 text-[13px] flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {(student.reviewed_by || "SA").substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Audited By</span>
                            <span className="font-semibold text-foreground">{student.reviewed_by || "System Auditor"}</span>
                          </div>
                        </div>
                        
                        <div className="h-px bg-border/50" />

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="block text-xs text-muted-foreground">Audited On</span>
                            <span className="block font-semibold text-foreground mt-0.5">
                              {student.reviewed_on ? new Date(student.reviewed_on).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : student.updated_at ? new Date(student.updated_at).toLocaleDateString() : "-"}
                            </span>
                          </div>
                          {student.arrival_datetime && (
                            <div>
                              <span className="block text-xs text-muted-foreground">Arrival Scheduled</span>
                              <span className="block font-semibold text-foreground mt-0.5">
                                {new Date(student.arrival_datetime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </SectionCard>
                </div>

              </div>
            )}

        </div>
      )}

      {/* Contract History Tab Placeholder */}
      {activeTab === "contracts" && (
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-12 text-center">
            <History size={40} className="text-muted-foreground mb-4 mx-auto" />
            <h3 className="text-lg font-bold m-0">No Active Contracts Found</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[420px] mx-auto leading-relaxed">
              This student does not have any active or past hostel residence contracts. All tenancy agreements will appear here after allotment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* NOC Tab Placeholder */}
      {activeTab === "noc" && (
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-12 text-center">
            <FileText size={40} className="text-muted-foreground mb-4 mx-auto" />
            <h3 className="text-lg font-bold m-0">No Objection Certificates (NOC)</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[420px] mx-auto leading-relaxed">
              No certificates on file. NOC requests, status approvals, and verification letters will list here once compiled.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payments Tab Placeholder */}
      {activeTab === "payments" && (
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-12 text-center">
            <CreditCard size={40} className="text-muted-foreground mb-4 mx-auto" />
            <h3 className="text-lg font-bold m-0">Hostel Payment Ledger</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[420px] mx-auto leading-relaxed">
              No payments ledger transactions recorded. Monthly rent statements, security deposit receipts, and utility bills will appear here after allotment billing.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Wallet / Advance Settlement Tab */}
      {activeTab === "wallet" && (
        <StudentWalletTab studentId={student.id} student={student} />
      )}

    </div>
  );
};
