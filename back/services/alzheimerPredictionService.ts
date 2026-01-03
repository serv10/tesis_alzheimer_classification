import axios from "axios";
import type { AlzheimerPrediction } from "../interface";

export const getAlzheimerPrediction = async (
  imagePath: string
): Promise<[Error?, AlzheimerPrediction?]> => {
  try {
    console.log(encodeURIComponent(imagePath));
    const response = await axios.get(
      `${process.env.PYTHON_API_URL}/api/predict`,
      {
        params: {
          image_path: encodeURIComponent(imagePath),
        },
      }
    );

    if (response.statusText !== "OK") {
      return [
        new Error(`Error get alzheimer prediction: ${response.statusText}`),
      ];
    }

    return [undefined, response.data];
  } catch (error) {
    if (error instanceof Error) {
      return [error];
    } else if (axios.isAxiosError(error)) {
      return [new Error(error.response?.data.message)];
    } else {
      return [new Error(String(error))];
    }
  }
};
