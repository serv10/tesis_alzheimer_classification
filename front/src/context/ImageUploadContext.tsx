/* import { useState, createContext } from "react";
import { FileUpload } from "@components/FileUpload";

import type { SelectedFile, FileUploadProps } from "@interface/interface";

export const UploadFileContext = createContext<FileUploadProps | null>(null);

export const UploadFileProvider = () => {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select"); // select, uploading, done

  const clearFileInput = () => {
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus("select");
  };

  return (
    <UploadFileContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
        progress,
        setProgress,
        uploadStatus,
        setUploadStatus,
      }}
    >
      <FileUpload />
    </UploadFileContext.Provider>
  );
}; */
