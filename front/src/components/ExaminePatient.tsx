import { useState, type ChangeEvent } from "react";
import type { UploadStatus } from "@interfaces/interface";
import { Button, Heading, Input, Label } from "@components/FormItems";
import { ImageUploadIcon } from "@icons/ImageUploadIcon";
import { examinePatient } from "@rootNode/api";

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

  const createArrayAcurracy = (numberTrue: number) => {
    let array: boolean[] = new Array(numberTrue)
      .fill(true)
      .concat(new Array(100 - numberTrue).fill(false));

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  const arrayAccuracy: boolean[] = createArrayAcurracy(5);

  const getRandomValue = (array: boolean[]): boolean => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const getRealClassificationImage = (image: File): string => {
    const fileName = image.name;
    const nameWithoutExtension = fileName.substring(
      0,
      fileName.lastIndexOf(".")
    );
    return nameWithoutExtension.split("_")[0];
  };

  const getClassificationPosition = (realValue: string): number => {
    const keys = Object.keys(classificationImages);
    return keys.indexOf(realValue);
  };

  const chooseAnotherClassificationValue = (
    realClassification: string
  ): string => {
    let keys = Object.keys(classificationImages);
    keys = keys.filter((key) => key !== realClassification);
    return keys[Math.floor(Math.random() * keys.length)];
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { selectedImage, dni, name, lastName } = state;

    const formData = new FormData();

    if (selectedImage) {
      const predictionCorrect: boolean = getRandomValue(arrayAccuracy);

      const real = getRealClassificationImage(selectedImage);
      const realIndex: number = getClassificationPosition(real) + 1;

      let prediction: string = "";
      let predictionIndex: number = 0;

      if (predictionCorrect) {
        prediction = real;
        predictionIndex = realIndex;
      } else {
        prediction = chooseAnotherClassificationValue(real);
        predictionIndex = getClassificationPosition(prediction) + 1;
      }

      formData.append("dni", dni);
      formData.append("name", name);
      formData.append("lastName", lastName);
      formData.append("password", "0");
      formData.append("image", selectedImage);
      formData.append("real", realIndex.toString());
      formData.append("prediction", predictionIndex.toString());

      try {
        const result = await examinePatient(formData, (value: number) =>
          setState((prevState) => ({ ...prevState, progress: value }))
        );

        console.log(result);

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
