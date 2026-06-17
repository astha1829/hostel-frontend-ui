import React from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewTitle?: string;
  editTitle?: string;
  deleteTitle?: string;
  deleteConfirmMessage?: string;
  align?: "left" | "center" | "right";
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
  viewTitle = "View Details",
  editTitle = "Edit Details",
  deleteTitle = "Delete",
  deleteConfirmMessage = "Are you sure you want to delete this item?",
  align = "center",
}) => {
  const justification = align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";

  const baseButtonClass = "flex items-center justify-center w-[36px] h-[36px] rounded-[10px] bg-[#FFFFFF] border border-[#E2E8F0] transition-all duration-200 ease-in-out shadow-sm";
  const defaultIconClass = "text-[#64748B]";
  const hoverDefaultClass = "hover:bg-[#F8FAFC] hover:border-[#CBD5E1] hover:text-[#0F172A] hover:-translate-y-[1px]";
  
  const deleteIconClass = "text-[#EF4444]";
  const hoverDeleteClass = "hover:bg-[#FEF2F2] hover:border-[#FCA5A5] hover:text-[#DC2626] hover:-translate-y-[1px]";

  return (
    <div className={`flex items-center ${justification} gap-[8px]`}>
      {onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className={`${baseButtonClass} ${defaultIconClass} ${hoverDefaultClass}`}
          title={viewTitle}
        >
          <Eye size={18} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className={`${baseButtonClass} ${defaultIconClass} ${hoverDefaultClass}`}
          title={editTitle}
        >
          <Edit2 size={18} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`${baseButtonClass} ${deleteIconClass} ${hoverDeleteClass}`}
          title={deleteTitle}
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};
