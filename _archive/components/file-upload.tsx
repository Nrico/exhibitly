'use client';

import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setMessage('');
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    setMessage('Uploading...');

    try {
      // 1. Get presigned URL from your API route
      const response = await fetch(`/api/upload?fileName=${file.name}&fileType=${file.type}`);
      if (!response.ok) {
        throw new Error('Failed to get presigned URL');
      }
      const { url } = await response.json();

      // 2. Upload file directly to R2 using the presigned URL
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to R2');
      }

      setMessage('File uploaded successfully!');
      setFile(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-3">Upload File to R2</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-auth-accent file:text-white
                   hover:file:bg-[#333]"
        disabled={uploading}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-4 w-full py-2 px-4 bg-auth-accent text-white font-semibold rounded-md hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload to R2'}
      </button>
      {message && (
        <p className={`mt-3 text-sm ${message.includes('failed') ? 'text-auth-error' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
