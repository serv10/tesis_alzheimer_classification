import { useState, type ChangeEvent } from "react";
import type { UploadStatus } from "@interfaces/interface";
import { Button, Heading, Input, Label } from "@components/FormItems";
import { ImageUploadIcon } from "@icons/ImageUploadIcon";
import { examinePatient } from "@rootNode/api";
import MessagePrediction from "@modals/MessagePrediction";

interface FormState {
  selectedImage: File | null;
  progress: number;
  uploadStatus: UploadStatus;
  srcImageUpload: string;
  dni: string;
  name: string;
  lastName: string;
}

const initialState = {
  selectedImage: null,
  progress: 0,
  uploadStatus: "SELECT" as UploadStatus,
  srcImageUpload: "",
  dni: "",
  name: "",
  lastName: "",
};

const classificationImages: { [key: string]: string } = {
  non: "Non Demented",
  verymild: "Very Mild Demented",
  mild: "Mild Demented",
  moderate: "Moderate Demented",
};

export const ExaminePatient = () => {
  const [state, setState] = useState<FormState>(initialState);
  const [openModal, setOpenModal] = useState(false);
  const [prediction, setPrediction] = useState("");

  const getRealClassificationImage = (image: File): string => {
    const fileName = image.name;
    const nameWithoutExtension = fileName.substring(
      0,
      fileName.lastIndexOf(".")
    );
    return nameWithoutExtension.split("_")[0];
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setState((prevState) => ({
        ...prevState,
        selectedImage: selectedFile,
        srcImageUpload: URL.createObjectURL(selectedFile),
      }));
    }
  };

  const handleProgress = (value: number) => {
    setState((prevState) => ({
      ...prevState,
      progress: value,
    }));
  };

  const handleUploadStatus = (status: UploadStatus) => {
    setState((prevState) => ({
      ...prevState,
      uploadStatus: status,
    }));
  };

  const handleToggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { selectedImage, dni, name, lastName } = state;

    const formData = new FormData();

    if (selectedImage) {
      const real = getRealClassificationImage(selectedImage);

      formData.append("dni", dni);
      formData.append("name", name);
      formData.append("lastName", lastName);
      formData.append("password", "0");
      formData.append("image", selectedImage);
      formData.append("real", real);

      try {
        const response = await examinePatient(formData, (value: number) =>
          setState((prevState) => ({ ...prevState, progress: value }))
        );

        const { prediction: predictionBack } = response.data;

        setPrediction(classificationImages[predictionBack]);
        setOpenModal(true);

        console.log(real);
        console.log(prediction);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleChange = (name: string, value: string) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isInputsCompleted = (): boolean => {
    return (
      Boolean(state.selectedImage) &&
      state.dni !== "" &&
      state.name !== "" &&
      state.lastName !== ""
    );
  };

  return (
    <>
      {prediction && (
        <MessagePrediction
          modelName="EfficientNetV2B0"
          prediction={prediction}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}

      <form
        className="max-w-md px-5 w-5/12 py-3"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="mb-5">
          <Heading title="Patient Data" />
        </div>
        <div className="mb-5">
          <Label label="DNI" id="dni" />
          <Input
            placeholder="Enter DNI"
            id="dni"
            type="text"
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <Label label="Name" id="name" />
          <Input
            placeholder="Enter Name"
            id="name"
            type="text"
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <Label label="Last Name" id="lastName" />
          <Input
            placeholder="Enter Last Name"
            id="lastName"
            type="text"
            onChange={handleChange}
          />
        </div>
        <div className="text-center">
          {!prediction ? (
            <Button
              type="submit"
              title="Examine"
              className={
                isInputsCompleted()
                  ? "bg-blue-950 hover:bg-blue-950/80 cursor-pointer"
                  : "bg-blue-950 opacity-60"
              }
              disabled={!isInputsCompleted()}
            />
          ) : (
            <Button
              onClick={handleToggleModal}
              title="Show Results"
              className={"bg-blue-950 hover:bg-blue-950/80 cursor-pointer"}
              disabled={false}
              type="button"
            />
          )}
        </div>
      </form>
      <div className="w-[55%] flex flex-col justify-center items-center px-5 py-3 gap-5">
        <h4 className="text-gray-900 text-xl font-bold">Upload</h4>

        {!state.selectedImage ? (
          <div className="w-full h-96 border-2 border-slate-900/30 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100">
            <label htmlFor="dropzone-file" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center mx-4 text-gray-500 h-full">
                <ImageUploadIcon className="w-28 stroke-gray-700" />
                <p className="mb-2">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-sm">Supported formates JPEG, PNG, JPG</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="w-full border-2 border-slate-900/30 border-dashed rounded-lg bg-gray-50 h-96 p-0.5">
            <img
              className="size-full rounded-lg "
              src={state.srcImageUpload}
              alt="alzheimer"
            />
          </div>
        )}
      </div>
    </>
  );
};
