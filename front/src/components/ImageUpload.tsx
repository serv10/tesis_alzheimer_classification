/* import { useState } from "react";
import { Button } from "@components/Button";
import { ImageUploadBox } from "@components/ImageUploadBox";
import type { UploadStatus, SelectedImage } from "@interfaces/interface";
import { ImageUploadShown } from "@components/ImageUploadShown";
import ImageUploading from "@components/ImageUploading.astro";

interface Props {
  selectedImage: SelectedImage;
}

export const ImageUpload = ({ selectedImage }: Props) => {
  const [progress, setProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("select");
  const [srcImageUpload, setSrcImageUpload] = useState<string>("");

  const handleImageSelect = (image: SelectedImage) => {
    setSelectedImage(image);
  };

  const handleProgress = (value: number) => {
    setProgress(value);
  };

  const handleUploadStatus = (status: UploadStatus) => {
    setUploadStatus(status);
  };

  return (
    <div className="w-3/5 flex flex-col justify-center items-center px-5 py-3 gap-5">
      <h4 className="text-gray-900 text-xl font-bold">Upload</h4>

      {!selectedImage ? (
        <ImageUploadBox onSelectFile={handleImageSelect} />
      ) : (
        <>
          <ImageUploadShown selectedImage={selectedImage} />
        </>
      )}
    </div>
  );
};
 */
