import axios from "axios";

export const API_URL = "http://localhost:4000/api";

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

export const getAlzheimerPatientCount = async () => {
  try {
    return await axios.get(`${API_URL}/getAlzheimerPatientCount`);
  } catch (error) {
    throw error;
  }
};

export const getAlzheimerPredictionCount = async () => {
  try {
    return await axios.get(`${API_URL}/getAlzheimerPredictionCount`);
  } catch (error) {
    throw error;
  }
};

export const getAlzheimerCountsByAgeAndType = async () => {
  try {
    return await axios.get(`${API_URL}/GetAlzheimerCountsByAgeAndType`);
  } catch (error) {
    throw error;
  }
};
