
import React, { useState, useCallback } from 'react';
import { DocumentUploadData } from '../../types';

interface DocumentUploadStepProps {
  data: DocumentUploadData;
  onDataChange: (field: keyof DocumentUploadData, value: File | File[] | string | string[] | null) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ data, onDataChange }) => {
  
  const createPreview = (file: File, callback: (preview: string) => void) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      callback(`📄 ${file.name}`); // Show filename for non-images
    }
  };

  const handleFileChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>, 
    field: keyof Pick<DocumentUploadData, 'businessLicense' | 'taxCertificate'>,
    previewField: keyof Pick<DocumentUploadData, 'businessLicensePreview' | 'taxCertificatePreview'>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`File ${file.name} is too large. Max 5MB.`);
        event.target.value = ""; 
        onDataChange(field, null);
        onDataChange(previewField, null);
        return;
      }
      onDataChange(field, file);
      createPreview(file, (preview) => onDataChange(previewField, preview));
    } else {
      onDataChange(field, null);
      onDataChange(previewField, null);
    }
  }, [onDataChange]);

  const handleMultipleFilesChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const validFiles: File[] = [];
    const newPreviewsCallbackList: (() => void)[] = [];

    let currentFilesCount = (data.sustainabilityCertificates || []).length;

    files.forEach(file => {
      if (currentFilesCount + validFiles.length >= 5) {
        alert('You can upload a maximum of 5 sustainability certificates.');
        return; 
      }
      if (file.size > 5 * 1024 * 1024) { 
        alert(`File ${file.name} is too large. Max 5MB per file.`);
        return; 
      }
      validFiles.push(file);
      // Prepare callback to update parent state once preview is ready
      newPreviewsCallbackList.push(() => {
        createPreview(file, (preview) => {
          onDataChange('sustainabilityCertificatesPreviews', 
            [...(data.sustainabilityCertificatesPreviews || []), preview].slice(-5)
          );
        });
      });
    });
    
    const existingFiles = data.sustainabilityCertificates || [];
    const combinedFiles = [...existingFiles, ...validFiles].slice(-5); 
    onDataChange('sustainabilityCertificates', combinedFiles.length > 0 ? combinedFiles : null);
    
    // Execute preview generation callbacks
    // This is a simplified approach; for complex state updates, consider a local state for previews
    // and then batch update the parent.
    let tempPreviews = [...(data.sustainabilityCertificatesPreviews || [])];
    validFiles.forEach(vf => {
        createPreview(vf, (preview) => {
            tempPreviews = [...tempPreviews, preview].slice(-5);
            onDataChange('sustainabilityCertificatesPreviews', tempPreviews);
        });
    });


  }, [onDataChange, data.sustainabilityCertificates, data.sustainabilityCertificatesPreviews]);


  const renderPreview = (previewData: string | null | undefined, altText: string, onRemove: () => void) => {
    if (!previewData) return null;
    const isImage = previewData.startsWith('data:image/');
    return (
      <div className="mt-2 flex items-center space-x-2 p-1 border border-slate-200 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700/50 max-w-xs">
        {isImage ? (
          <img src={previewData} alt={altText} className="max-h-16 max-w-[64px] rounded object-contain" />
        ) : (
          <span className="text-2xl">📄</span>
        )}
        <span className="text-xs text-slate-600 dark:text-slate-300 truncate flex-grow" title={isImage ? altText : previewData.substring(2)}>
          {isImage ? altText : previewData.substring(2)}
        </span>
        <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-0.5 rounded-full" aria-label={`Remove ${altText}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    );
  };
  
  const commonInputClass = "w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-700 dark:file:text-sky-200 hover:file:bg-sky-100 dark:hover:file:bg-sky-600 transition";

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Upload clear copies of your documents. Max 5MB per file. Accepted formats: PDF, JPG, PNG, WEBP.
      </p>
      <div>
        <label htmlFor="businessLicense" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Business License / Registration <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="businessLicense"
          id="businessLicense"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(e) => handleFileChange(e, 'businessLicense', 'businessLicensePreview')}
          className={commonInputClass}
        />
        {renderPreview(data.businessLicensePreview, 'Business License Preview', () => {
            onDataChange('businessLicense', null);
            onDataChange('businessLicensePreview', null);
            const input = document.getElementById('businessLicense') as HTMLInputElement;
            if (input) input.value = "";
        })}
      </div>

      <div>
        <label htmlFor="taxCertificate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Tax ID Certificate (e.g., EIN confirmation)
        </label>
        <input
          type="file"
          name="taxCertificate"
          id="taxCertificate"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(e) => handleFileChange(e, 'taxCertificate', 'taxCertificatePreview')}
          className={commonInputClass}
        />
        {renderPreview(data.taxCertificatePreview, 'Tax Certificate Preview', () => {
            onDataChange('taxCertificate', null);
            onDataChange('taxCertificatePreview', null);
            const input = document.getElementById('taxCertificate') as HTMLInputElement;
            if (input) input.value = "";
        })}
      </div>

      <div>
        <label htmlFor="sustainabilityCertificates" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Sustainability Certifications (Optional, up to 5 files)
        </label>
        <input
          type="file"
          name="sustainabilityCertificates"
          id="sustainabilityCertificates"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          multiple
          onChange={handleMultipleFilesChange}
          className={commonInputClass}
        />
        {(data.sustainabilityCertificatesPreviews || []).map((preview, index) => 
            renderPreview(preview, `Sustainability Cert ${index + 1}`, () => {
                const currentFiles = data.sustainabilityCertificates ? [...data.sustainabilityCertificates] : [];
                const currentPreviews = data.sustainabilityCertificatesPreviews ? [...data.sustainabilityCertificatesPreviews] : [];
                currentFiles.splice(index, 1);
                currentPreviews.splice(index, 1);
                onDataChange('sustainabilityCertificates', currentFiles.length > 0 ? currentFiles : null);
                onDataChange('sustainabilityCertificatesPreviews', currentPreviews.length > 0 ? currentPreviews : null);
                 const input = document.getElementById('sustainabilityCertificates') as HTMLInputElement;
                 if (input) input.value = ""; 
            })
        )}
      </div>
       <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
        Note: Document upload and verification are simulated for this demo. No files are actually sent to a server.
      </p>
    </div>
  );
};

export default DocumentUploadStep;
