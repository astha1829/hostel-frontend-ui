"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Save, X, Building2, Users, Phone, ShieldCheck, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useStudentForm } from "../hooks/use-student-form";
import { showCancelConfirm } from "@/utils/swal";

export const StudentFormPage: React.FC = () => {
  const router = useRouter();

  const handleSuccess = (studentId: string) => {
    router.push(`/students/${studentId}`);
  };

  const handleCancel = () => {
    router.push("/students");
  };

  const {
    formData,
    hostels,
    isLoadingHostels,
    fieldErrors,
    apiError,
    isSubmitting,
    selectedFiles,
    handleInputChange,
    handleFileChange,
    handleSubmit,
  } = useStudentForm({ onSuccess: handleSuccess, onCancel: handleCancel });

  const isDirty = React.useMemo(() => {
    if (selectedFiles.profile_pic || selectedFiles.passport_image_1 || selectedFiles.passport_image_2) {
      return true;
    }
    const defaultFormState: Record<string, any> = {
      user_id: "",
      student_registration_id: "",
      student_name: "",
      last_name: "",
      college: "",
      course: "",
      student_type: "Regular",
      meal_type: "Veg",
      nationality: "",
      gender: "Male",
      date_of_birth: "",
      address: "",
      passport_no: "",
      student_email: "",
      parent_email: "",
      contact: "",
      parent_emergency_contact: "",
      local_mobile_no: "",
      alternative_contact: "",
      home_town: false,
      no_notification: false,
      arrival_datetime: "",
      passport_no_reviewed: false,
      passport_copy_reviewed: false,
      profile_picture_reviewed: false,
      student_mobile_verified: false,
      student_email_verified: false,
      parent_mobile_verified: false,
      parent_email_verified: false,
      kyc_verified: false,
      hostel_id: "",
    };

    for (const key of Object.keys(defaultFormState)) {
      const currentVal = (formData as any)[key] ?? "";
      const defaultVal = defaultFormState[key] ?? "";
      if (currentVal.toString() !== defaultVal.toString()) {
        return true;
      }
    }
    return false;
  }, [formData, selectedFiles]);

  const handleCancelClick = async () => {
    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) return;
    }
    handleCancel();
  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const hostelOptions = [
    { label: "No Hostel Assigned", value: "" },
    ...hostels.map((h) => ({
      label: h.hostel_name,
      value: h.id,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <PageHeader
        title="Register New Student"
        description="Add a new resident student profile, upload identity verifications, and record KYC review checks."
        backHref="/students"
        backText="Back to Students"
        actions={
          <div className="flex gap-3 items-center">
            <Button variant="secondary" size="md" type="button" onClick={handleCancelClick} disabled={isSubmitting}>
              <X size={16} />
              <span>Cancel</span>
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              <Save size={16} />
              <span>Save Student</span>
            </Button>
          </div>
        }
      />

      {/* Error Callout */}
      {apiError && (
        <div className="flex flex-col gap-1 p-4 bg-destructive/15 text-destructive border border-destructive/25 rounded-md text-sm font-semibold">
          <span>Registration failed:</span>
          <p className="m-0 font-medium opacity-90">{apiError}</p>
        </div>
      )}

      {/* Form sections */}
      <div className="flex flex-col gap-6">
        
        {/* Section 1: Personal & Institutional */}
        <SectionCard title="Personal & College Details" description="Primary identification information and college affiliations.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              label="Given Name *"
              value={formData.student_name}
              onChange={(e) => handleInputChange("student_name", e.target.value)}
              error={fieldErrors.student_name}
              disabled={isSubmitting}
            />
            <Input
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              label="Registration ID"
              placeholder="e.g. REG-12345"
              value={formData.student_registration_id}
              onChange={(e) => handleInputChange("student_registration_id", e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              label="User ID"
              placeholder="e.g. user_101"
              value={formData.user_id}
              onChange={(e) => handleInputChange("user_id", e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              label="College/Institution *"
              placeholder="e.g. Greenwood Tech"
              value={formData.college}
              onChange={(e) => handleInputChange("college", e.target.value)}
              error={fieldErrors.college}
              disabled={isSubmitting}
            />
            <Input
              label="Course Enrolled"
              placeholder="e.g. B.Sc Computer Science"
              value={formData.course}
              onChange={(e) => handleInputChange("course", e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              label="Nationality *"
              placeholder="e.g. British"
              value={formData.nationality}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              error={fieldErrors.nationality}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            <Select
              label="Meal Choice"
              value={formData.meal_type}
              onChange={(e) => handleInputChange("meal_type", e.target.value)}
              options={[
                { label: "Vegetarian", value: "Veg" },
                { label: "Non-Vegetarian", value: "Non-Veg" },
              ]}
              disabled={isSubmitting}
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              options={genderOptions}
              disabled={isSubmitting}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
              disabled={isSubmitting}
            />
            <Select
              label="Assigned Residence"
              value={formData.hostel_id || ""}
              onChange={(e) => handleInputChange("hostel_id", e.target.value)}
              options={hostelOptions}
              disabled={isSubmitting}
            />
          </div>
        </SectionCard>

        {/* Section 2: Address */}
        <SectionCard title="Permanent Address" description="Permanent street address details.">
          <Input
            label="Full Address"
            placeholder="e.g. 12 Baker Street, London"
            value={formData.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={isSubmitting}
          />
        </SectionCard>

        {/* Section 3: Contacts */}
        <SectionCard title="Contact Credentials" description="Student and parent emergency contact parameters.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              label="Student Email Address"
              type="email"
              placeholder="e.g. student@college.edu"
              value={formData.student_email}
              onChange={(e) => handleInputChange("student_email", e.target.value)}
              error={fieldErrors.student_email}
              disabled={isSubmitting}
            />
            <Input
              label="Student Mobile No"
              placeholder="e.g. +44 7911 123456"
              value={formData.contact}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              label="Local Mobile No"
              placeholder="e.g. +44 7911 654321"
              value={formData.local_mobile_no}
              onChange={(e) => handleInputChange("local_mobile_no", e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              label="Parent Email Address"
              type="email"
              placeholder="e.g. parent@example.com"
              value={formData.parent_email}
              onChange={(e) => handleInputChange("parent_email", e.target.value)}
              error={fieldErrors.parent_email}
              disabled={isSubmitting}
            />
            <Input
              label="Parent Emergency Mobile No"
              placeholder="e.g. +44 7911 987654"
              value={formData.parent_emergency_contact}
              onChange={(e) => handleInputChange("parent_emergency_contact", e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              label="Alternative Mobile No"
              placeholder="e.g. +44 7911 555666"
              value={formData.alternative_contact}
              onChange={(e) => handleInputChange("alternative_contact", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </SectionCard>

        {/* Section 4: Identity verification */}
        <SectionCard title="Passport Documentation" description="Passport details and scanned copy uploads.">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Passport Number *"
                placeholder="e.g. P12345678"
                value={formData.passport_no}
                onChange={(e) => handleInputChange("passport_no", e.target.value)}
                error={fieldErrors.passport_no}
                disabled={isSubmitting}
              />
              <Input
                label="Upload Profile Photo"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("profile_pic", e.target.files?.[0] || null)}
                disabled={isSubmitting}
              />
              <Input
                label="Upload Passport Photo (Page 1)"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("passport_image_1", e.target.files?.[0] || null)}
                disabled={isSubmitting}
              />
              <Input
                label="Upload Passport Photo (Page 2)"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("passport_image_2", e.target.files?.[0] || null)}
                disabled={isSubmitting}
              />
            </div>
            
            {/* selected files labels */}
            {(selectedFiles.profile_pic || selectedFiles.passport_image_1 || selectedFiles.passport_image_2) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-secondary/10 border border-border/60 rounded-lg text-sm text-muted-foreground">
                <div>Profile Photo selected: <strong className="text-foreground">{selectedFiles.profile_pic ? selectedFiles.profile_pic.name : "None"}</strong></div>
                <div>Passport Scan Page 1 selected: <strong className="text-foreground">{selectedFiles.passport_image_1 ? selectedFiles.passport_image_1.name : "None"}</strong></div>
                <div>Passport Scan Page 2 selected: <strong className="text-foreground">{selectedFiles.passport_image_2 ? selectedFiles.passport_image_2.name : "None"}</strong></div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Section 5: Verification & Review metadata */}
        <SectionCard title="KYC Verification Status" description="Record verified checklists and reviewed auditor tags.">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="kyc_verified"
                  checked={!!formData.kyc_verified}
                  onChange={(e) => handleInputChange("kyc_verified", e.target.checked)}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <Input
                label="Reviewed By Username"
                placeholder="e.g. auditor_john"
                value={formData.reviewed_by}
                onChange={(e) => handleInputChange("reviewed_by", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </form>
  );
};
