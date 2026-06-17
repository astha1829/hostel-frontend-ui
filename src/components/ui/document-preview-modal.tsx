import React from 'react';
import { X, Download } from 'lucide-react';
import { Button } from './button';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-slate-50">
          <h3 className="font-semibold text-slate-900 truncate max-w-[70%]">{fileName}</h3>
          <div className="flex items-center gap-2">
            <a href={fileUrl} download={fileName} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="h-8">
                <Download size={14} className="mr-1.5" /> Download
              </Button>
            </a>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-100" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-50/50 flex items-center justify-center min-h-[300px]">
          <img 
            src={fileUrl} 
            alt={fileName} 
            className="max-w-full max-h-[70vh] object-contain rounded-md shadow-sm border border-slate-200" 
          />
        </div>
      </div>
    </div>
  );
};
