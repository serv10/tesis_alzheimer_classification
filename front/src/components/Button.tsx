/* import { useContext } from "react";
import type {
  ImageUploadProps,
  SelectedImage,
  UploadStatus,
} from "../interface/interface";
import axios from "axios";
import { examinePatient } from "../api";

interface Props {
  className?: string;
  disabled: boolean;
  selectedFile: SelectedImage;
  handleProgress: (value: number) => void;
  handleUploadStatus: (status: UploadStatus) => void;
  uploadStatus: string;
  handledSrcImageUpload: (src: string) => void;
}

export const Button = ({
  className,
  disabled = false,
  selectedFile,
  handleProgress,
  uploadStatus,
  handleUploadStatus,
  handledSrcImageUpload,
}: Props) => {
  const handleUpload = async () => {
    if (uploadStatus === "done") {
      //limpiamos todo
      return;
    }

    try {
      handleUploadStatus("uploading");

      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
        await examinePatient(formData, handleProgress);
        handledSrcImageUpload(URL.createObjectURL(selectedFile));
        handleUploadStatus("done");
      } else {
        console.log("file is null");
      }
    } catch (error) {
      handleUploadStatus("select");
    }
  };

  return (
    <button
      className={`text-sm px-6 py-3 rounded-lg w-full transition duration-200 font-semi bold uppercase ${className}`}
      type="button"
      disabled={disabled}
      onClick={handleUpload}
    >
      {uploadStatus === "uploading"
        ? "uploading file..."
        : uploadStatus === "select"
        ? "upload file"
        : "uploaded"}
    </button>
  );
};
 */
