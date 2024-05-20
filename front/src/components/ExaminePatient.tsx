import { useState, type ChangeEvent } from "react";
import type { FormState, UploadStatus } from "@interfaces/interface";
import { Button, Heading, Input, Label } from "@components/FormItems";
import { ImageUploadIcon } from "@icons/ImageUploadIcon";
import { examinePatient } from "src/api";
import MessagePrediction from "@modals/MessagePrediction";
import { Icon } from "@iconify/react";
import { Datepicker } from "flowbite-react";
import { imageClassification } from "@constants/imageClassification";

const initialState = {
  selectedImage: null,
  progress: 0,
  uploadStatus: "SELECT" as UploadStatus,
  srcImageUpload: "",
  dni: "",
  name: "",
  lastName: "",
  birthDate: new Date(),
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

  const convertDateToString = (date: Date): string => {
    return date.toISOString().split("T")[0];
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

  const cleanImage = () => {
    setState((prevState) => ({
      ...prevState,
      selectedImage: null,
      srcImageUpload: "",
    }));
  };

  const cleanForm = () => {
    setState(initialState);
    setPrediction("");
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
      formData.append("birthDate", convertDateToString(state.birthDate));

      try {
        const response = await examinePatient(formData, (value: number) =>
          setState((prevState) => ({ ...prevState, progress: value }))
        );

        const { prediction: predictionBack } = response.data;

        setPrediction(imageClassification[predictionBack]);
        setOpenModal(true);
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
            value={state.dni}
          />
        </div>
        <div className="mb-5">
          <Label label="Name" id="name" />
          <Input
            placeholder="Enter Name"
            id="name"
            type="text"
            onChange={handleChange}
            value={state.name}
          />
        </div>
        <div className="mb-5">
          <Label label="Last Name" id="lastName" />
          <Input
            placeholder="Enter Last Name"
            id="lastName"
            type="text"
            onChange={handleChange}
            value={state.lastName}
          />
        </div>
        <div className="mb-5">
          <Label label="BirthDate" id="birtDate" />
          <Datepicker
            minDate={new Date(1900, 0, 1)}
            maxDate={new Date()}
            value={convertDateToString(state.birthDate)}
            onSelectedDateChanged={(date) => {
              setState((prevState) => ({
                ...prevState,
                birthDate: date,
              }));
            }}
          />
        </div>
        {!prediction ? (
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
        ) : (
          <div className="flex justify-around">
            <Button
              onClick={handleToggleModal}
              title="Show Results"
              className={"bg-blue-950 hover:bg-blue-950/80 cursor-pointer"}
              disabled={false}
              type="button"
            />
            <Button
              onClick={cleanForm}
              title="Clean Form"
              className={
                "bg-zinc-50 border border-slate-900 cursor-pointer !text-slate-900 hover:bg-gray-200/50"
              }
              disabled={false}
              type="button"
            />
          </div>
        )}
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
          <div className="relative w-full border-2 border-slate-900/30 border-dashed rounded-lg bg-gray-50 h-96 p-0.5">
            <img
              className="size-full rounded-lg "
              src={state.srcImageUpload}
              alt="alzheimer"
            />
            {!prediction && (
              <Icon
                className="absolute bottom-2.5 right-2.5 cursor-pointer hover:scale-[1.2] transition duration-[250ms] text-white text-3xl"
                icon="mdi:trash-can-empty"
                onClick={cleanImage}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};
