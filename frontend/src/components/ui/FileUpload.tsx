
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File as FileIcon, Loader2 } from 'lucide-react';
import { Button } from './button';
import axios from 'axios';
import api from '../../services/api';

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    label?: string;
    accept?: Record<string, string[]>;
    maxSize?: number; // bytes
}

export const FileUpload = ({ onUploadComplete, label = "Upload File", accept, maxSize = 10485760 }: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        // Preview
        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        } else {
             setPreview(null);
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Using direct axios or api instance. api instance might need 'Content-Type': 'multipart/form-data' explicitly 
            // or let axios set it. Usually axios sets it automatically if data is FormData.
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onUploadComplete(response.data.data.url);
        } catch (err: any) {
            console.error('Upload failed', err);
            setError(err.response?.data?.message || 'Upload failed');
            setPreview(null); // Clear preview on error
        } finally {
            setUploading(false);
        }
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: accept || {
            'image/*': [], 
            'application/pdf': []
        },
        maxSize,
        multiple: false
    });

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        // onUploadComplete(''); // Optional: clear URL in parent?
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-slate-200">{label}</label>}
            
            <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50'}
                    ${error ? 'border-red-500' : ''}
                `}
            >
                <input {...getInputProps()} />
                
                {uploading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
                        <p className="text-sm text-slate-400">Uploading...</p>
                    </div>
                ) : preview ? (
                    <div className="relative inline-block">
                        <img src={preview} alt="Preview" className="max-h-48 rounded-md" />
                        <button 
                            onClick={clearFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="w-8 h-8 text-slate-500 mb-2" />
                        <p className="text-sm text-slate-300 font-medium">
                            {isDragActive ? "Drop file here" : "Click to upload or drag & drop"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Images, PDF (max 10MB)
                        </p>
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
    );
};
