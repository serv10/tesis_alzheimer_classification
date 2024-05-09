import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const examinePatient = async (
  formData: FormData,
  handleProgress: (value: number) => void
) => {
  try {
    return await axios.post(`${API_URL}/examinePatient/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        if (total) {
          const percentCompleted = Math.floor((loaded * 100) / total);
          handleProgress(percentCompleted);
        }
      },
    });
  } catch (error) {
    throw error;
  }
};
