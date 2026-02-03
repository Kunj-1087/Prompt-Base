import React, { useState } from 'react';
import { Camera, User, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate: (newUrl: string) => Promise<void>;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  onAvatarUpdate,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);

  // In a real app, this would upload to S3/Cloudinary and get a URL back.
  // For this demo/MVP, we'll prompt the user for a URL or assume the file is valid.
  // But per the plan, I will simulate an upload or just ask for a URL for now?
  // User request said "Avatar upload with preview".
  // Implementation Plan said: "UI to handle file selection/preview, but backend accept avatarUrl string".
  // So I'll implement a file picker that *simulates* upload by reading as DataURL (base64) for small images,
  // or just keeps it as a preview and expects the parent to handle the "upload" to get a URL.
  // Given the backend expects a URL string, sending a huge Base64 might fail if not configured.
  // However, for this task, I will enable a simple "Enter URL" mode AND a "File Pick" mode (that warns/mocks).
  // Actually, to make it usable, let's just use an Input for URL and a File Picker that generates a Preview but
  // maybe we can just send the Base64 if the string length is reasonable, or just stick to URL input for robustness
  // effectively meeting the "backend requires string" constraint.
  // PROPOSAL: supporting *only* URL input for now is safer for backend, but "Avatar Upload" implies files.
  // I will assume for now we use a simple URL input for the MVP to be safe,
  // OR I can use a `FileReader` to get base64 and try to send that. MongoDB BSON limit is 16MB.
  // Let's go with Base64 for the "Upload" feel, but strict size limit.

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size too large (max 5MB)');
      return;
    }

    setIsUploading(true);
    setError(null);

    // Convert to Base64 to simulate "Upload" and get a string URL (DataURI)
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      
      try {
        await onAvatarUpdate(base64String);
      } catch (err) {
        setError('Failed to update avatar');
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-slate-500" />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
        
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg"
        >
          <Camera className="h-4 w-4" />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
