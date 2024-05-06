/* import { useState } from "react";
import type { SelectedImage } from "@interfaces/interface";

interface Props {
  selectedImage: SelectedImage;
}

export const ImageUploadShown = ({ selectedImage: selectedImage }: Props) => {
  const srcImageUploaded = () => {
    if (selectedImage) {
      console.log(selectedImage);
      return URL.createObjectURL(selectedImage);
    }
  };

  return (
    <div className="w-full border-2 border-slate-900/30 border-dashed rounded-lg bg-gray-50 h-96 p-1">
      <img
        className="size-full rounded-lg "
        src={srcImageUploaded()}
        alt="alzheimer"
      />
    </div>
  );
};
 */
