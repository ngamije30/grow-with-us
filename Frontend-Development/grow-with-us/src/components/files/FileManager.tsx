import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
}

export const FileManager = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: files, isLoading } = useQuery<File[]>(['files'], async () => {
    const response = await fetch('/api/files', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  });

  const uploadMutation = useMutation(async (formData: FormData) => {
    const response = await fetch('/api/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return response.json();
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    await uploadMutation.mutateAsync(formData);
  };

  return (
    <div className="file-manager">
      <div className="file-upload">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          accept="image/*,video/*,application/pdf"
        />
        {uploadMutation.isLoading && <p>Uploading...</p>}
      </div>

      <div className="file-list">
        {isLoading ? (
          <p>Loading files...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files?.map((file) => (
                <tr key={file.id}>
                  <td>{file.name}</td>
                  <td>{file.type}</td>
                  <td>{(file.size / 1024).toFixed(2)} KB</td>
                  <td>
                    <button onClick={() => window.open(file.url)}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};