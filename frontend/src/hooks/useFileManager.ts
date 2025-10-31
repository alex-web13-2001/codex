import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { TaskFile } from '@/types/task';

const createTempFile = (file: File): TaskFile => ({
  id: crypto.randomUUID(),
  name: file.name,
  size: file.size,
  progress: 0
});

const useFileManager = () => {
  const [files, setFiles] = useState<TaskFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const tempFiles = acceptedFiles.map(createTempFile);
    setFiles((prev) => [...tempFiles, ...prev]);
  }, []);

  const updateProgress = useCallback((id: string, progress: number) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, progress } : file)));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  const dropzone = useDropzone({ onDrop });

  return { files, dropzone, updateProgress, removeFile };
};

export default useFileManager;
