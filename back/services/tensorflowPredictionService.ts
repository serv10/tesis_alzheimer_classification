import * as tf from "@tensorflow/tfjs";
import { createCanvas, loadImage } from "canvas";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import type { AlzheimerPrediction } from "../interface";

let model: tf.GraphModel | null = null;

// Custom IO Handler for loading model from local filesystem
class LocalFileHandler {
  constructor(private modelPath: string) {}

  async load(): Promise<tf.io.ModelArtifacts> {
    // Read model.json
    const modelJsonPath = this.modelPath;
    const modelJson = JSON.parse(readFileSync(modelJsonPath, "utf-8"));

    // Read weight files
    const modelDir = dirname(modelJsonPath);
    const weightSpecs = modelJson.weightsManifest[0];
    const weightPaths = weightSpecs.paths;

    const weightData: ArrayBuffer[] = [];
    for (const weightPath of weightPaths) {
      const fullPath = join(modelDir, weightPath);
      const buffer = readFileSync(fullPath);
      weightData.push(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    }

    // Concatenate all weight data
    const totalBytes = weightData.reduce((sum, buf) => sum + buf.byteLength, 0);
    const concatenated = new Uint8Array(totalBytes);
    let offset = 0;
    for (const buf of weightData) {
      concatenated.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }

    return {
      modelTopology: modelJson.modelTopology,
      weightSpecs: weightSpecs.weights,
      weightData: concatenated.buffer,
      format: modelJson.format,
      generatedBy: modelJson.generatedBy,
      convertedBy: modelJson.convertedBy,
    };
  }
}

// Load model on startup
export const loadModel = async (): Promise<void> => {
  try {
    const modelPath = process.env.PATH_MODEL_JSON || "./model/model.json";
    console.log("Loading TensorFlow.js model from:", modelPath);

    const handler = new LocalFileHandler(modelPath);
    model = await tf.loadGraphModel(handler);

    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
};

// Preprocess image for model prediction
const preprocessImage = async (imagePath: string): Promise<tf.Tensor> => {
  // Load image using canvas
  const image = await loadImage(imagePath);

  // Create canvas and draw image
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  // Convert to tensor
  const imageTensor = tf.browser.fromPixels(canvas);

  // Convert to grayscale (model expects 1 channel)
  const grayscale = imageTensor.mean(2).expandDims(2);

  // Resize to model input size: 128x128
  const resized = tf.image.resizeBilinear(grayscale, [128, 128]);

  // Normalize pixel values to [0, 1]
  const normalized = resized.div(255.0);

  // Add batch dimension
  const batched = normalized.expandDims(0);

  // Clean up intermediate tensors
  imageTensor.dispose();
  grayscale.dispose();
  resized.dispose();
  normalized.dispose();

  return batched;
};

// Get prediction from image
export const getTensorflowPrediction = async (
  imagePath: string
): Promise<[Error?, AlzheimerPrediction?]> => {
  try {
    if (!model) {
      return [new Error("Model not loaded. Please restart the server.")];
    }

    // Preprocess image
    const inputTensor = await preprocessImage(imagePath);

    // Make prediction
    const prediction = model.predict(inputTensor) as tf.Tensor;

    // Get prediction values
    const predictionData = await prediction.data();

    // Find class with highest probability
    const maxIndex = predictionData.indexOf(Math.max(...Array.from(predictionData)));

    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();

    return [undefined, { result: maxIndex }];
  } catch (error) {
    if (error instanceof Error) {
      return [error];
    }
    return [new Error(String(error))];
  }
};
