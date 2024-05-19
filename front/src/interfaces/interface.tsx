import { type Dispatch, type SetStateAction } from "react";

export type UploadStatus = "select" | "uploading" | "done";

export type TypeButton = "button" | "submit" | "reset";

export interface ImageUploadProps {
  selectedFile: File;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  uploadStatus: UploadStatus;
  setUploadStatus: React.Dispatch<React.SetStateAction<UploadStatus>>;
}
