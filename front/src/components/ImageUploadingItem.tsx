/* import { CheckedIcon } from "@icons/CheckedIcon";
import { CloseIcon } from "@icons/CloseIcon";
import { ImageIcon } from "@icons/ImageIcon";
import type { SelectedImage, UploadStatus } from "@interfaces/interface";

interface Props {
  selectedImage: SelectedImage;
  uploadStatus: UploadStatus;
  progress: number;
}

export const ImageUploadingItem = ({
  selectedImage,
  uploadStatus,
  progress,
}: Props) => {
  return (
    <div className="mt-4 py-3 px-4 rounded-md  bg-white border border-gray-400/35 flex items-center justify-center gap-5">
      <ImageIcon className="size-7 stroke-slate-900" />

      <div className="flex-1">
        <p className="text-gray-600 text-sm mb-1 truncate ">
          {selectedImage?.name} {progress}
        </p>
        <div className="h-1 bg-slate-900/30 rounded-lg">
          <div
            className={`h-full bg-slate-900 rounded-lg transition-[width] duration-500 w-[${progress}%]`}
          ></div>
        </div>
      </div>

      {uploadStatus === "select" ? (
        <div className="flex justify-between items-center ">
          <CloseIcon className="size-6 text-gray-600 cursor-pointer hover:scale-105 transition duration-200" />
        </div>
      ) : uploadStatus === "uploading" ? (
        <div className="rounded-full size-9 border-2 border-gray-600 flex justify-center items-center ">
          <p className="text-xs text-center font-semibold text-slate-800/80">
            {progress}%
          </p>
        </div>
      ) : (
        <CheckedIcon className="size-9 stroke-green-500 cursor-pointer hover:scale-105 transition duration-200" />
      )}
    </div>
  );
};
 */
