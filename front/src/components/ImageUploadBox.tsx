import { useRef, type ChangeEvent } from "react";
import { ImageUploadIcon } from "@icons/ImageUploadIcon";

export interface Props {
  onSelectFile: (file: File) => void;
}

export const ImageUploadBox = ({ onSelectFile }: Props) => {
  const inputRef = useRef(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0)
      onSelectFile(event.target.files[0]);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center w-full border-2 border-slate-900/30 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}
      >
        <div className="flex flex-col items-center justify-center mx-4 h-96 text-gray-500 ">
          <ImageUploadIcon className="w-28 stroke-gray-700" />
          <p className="mb-2">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-sm">Supported formates JPEG, PNG, JPG</p>
        </div>
        <input
          ref={inputRef}
          id="dropzone-file"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};
