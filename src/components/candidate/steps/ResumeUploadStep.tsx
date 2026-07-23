import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FileText, UploadCloud, X, CheckCircle2 } from "lucide-react";
import { CandidateProfileInput } from "@/lib/validations/candidate";
import { uploadCandidateResumeAction } from "@/actions/onboarding/save-candidate";

export function ResumeUploadStep({ form }: { form: UseFormReturn<CandidateProfileInput> }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentResume = form.watch("resume_url");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadCandidateResumeAction(formData);

      if (!res.success) {
        throw new Error(res.error || "Failed to upload resume.");
      }

      // res.filePath is now the public URL we returned
      form.setValue("resume_url", res.filePath, { shouldValidate: true });
    } catch (err: any) {
      setError(err.message || "Failed to upload resume.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeResume = () => {
    form.setValue("resume_url", "", { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-heading">Resume Upload</h2>
        <p className="text-muted-foreground font-medium">Upload your latest resume to make applying for jobs one-click easy.</p>
      </div>

      <div className="bg-muted/30 border-2 border-dashed border-border rounded-[2rem] p-10 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-muted/50 hover:border-primary">
        {!currentResume ? (
          <>
            <div className="w-20 h-20 bg-white rounded-full border border-border shadow-md flex items-center justify-center mb-6 text-primary">
              <UploadCloud size={40} />
            </div>
            <h3 className="font-bold text-xl mb-2">Upload your Resume</h3>
            <p className="text-muted-foreground font-medium mb-6">PDF files only. Max 10MB.</p>
            
            <label className="cursor-pointer relative">
              <span className={`inline-flex h-12 items-center justify-center px-8 border border-border shadow-md hover-lift rounded-xl font-bold bg-primary text-primary-foreground transition-all \${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
                {isUploading ? "Uploading..." : "Browse Files"}
              </span>
              <input 
                type="file" 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            {error && <p className="text-destructive font-bold mt-4">{error}</p>}
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full border border-border shadow-md flex items-center justify-center mb-6 text-green-600">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-foreground">Resume Uploaded Successfully</h3>
            
            <div className="bg-white border-2 border-border shadow-sm rounded-xl p-4 flex items-center gap-4 mt-4 max-w-sm w-full mx-auto">
              <FileText className="text-primary" size={24} />
              <div className="flex-1 text-left truncate">
                <p className="font-bold truncate text-sm">Resume.pdf</p>
                <p className="text-xs text-muted-foreground font-medium">Ready for applications</p>
              </div>
              <button 
                type="button" 
                onClick={removeResume}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
