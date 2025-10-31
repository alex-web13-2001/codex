import { FiUpload, FiX } from 'react-icons/fi';
import styles from './FileUploader.module.scss';
import type { TaskFile } from '@/types/task';
import type { DropzoneState } from 'react-dropzone';
import Button from '@/components/common/Button';

interface FileUploaderProps {
  files: TaskFile[];
  dropzone: DropzoneState;
  onRemove: (id: string) => void;
}

const FileUploader = ({ files, dropzone, onRemove }: FileUploaderProps) => (
  <div className={styles.wrapper}>
    <div {...dropzone.getRootProps({ className: styles.dropzone })}>
      <input {...dropzone.getInputProps()} />
      <FiUpload size={20} />
      <p>Drag and drop files here, or click to select</p>
      <small>Supported formats: PDF, PNG, JPG, DOCX</small>
    </div>
    {files.length ? (
      <ul className={styles.list}>
        {files.map((file) => (
          <li key={file.id}>
            <div>
              <strong>{file.name}</strong>
              <span>{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            <div className={styles.progressBar}>
              <div style={{ width: `${file.progress ?? 0}%` }} />
            </div>
            <Button type="button" variant="ghost" onClick={() => onRemove(file.id)} aria-label="Remove file">
              <FiX />
            </Button>
          </li>
        ))}
      </ul>
    ) : null}
  </div>
);

export default FileUploader;
