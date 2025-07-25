import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, AlertTriangle } from 'lucide-react';
import { validateFile, FileValidationOptions } from '@/lib/security';

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  validationOptions: FileValidationOptions;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export function SecureFileUpload({
  onFileSelect,
  validationOptions,
  maxFiles = 1,
  disabled = false,
  className = ''
}: SecureFileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    // Validate each file
    for (const file of acceptedFiles) {
      const validation = validateFile(file, validationOptions);
      if (!validation.isValid) {
        setError(validation.error || 'File validation failed');
        return;
      }
    }

    // Check max files limit
    if (selectedFiles.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    const newFiles = [...selectedFiles, ...acceptedFiles].slice(0, maxFiles);
    setSelectedFiles(newFiles);
    
    // Call the callback for each file
    acceptedFiles.forEach(file => onFileSelect(file));
  }, [onFileSelect, validationOptions, maxFiles, selectedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    multiple: maxFiles > 1,
    accept: validationOptions.allowedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>)
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setError(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-gray-500">
              Max size: {Math.round(validationOptions.maxSize / (1024 * 1024))}MB
            </p>
            <p className="text-sm text-gray-500">
              Allowed: {validationOptions.allowedExtensions.join(', ')}
            </p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}