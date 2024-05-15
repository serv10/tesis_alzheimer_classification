declare module "bun" {
  interface Env {
    DB_HOST: string;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;
    DB_PORT: number;
    PORT: number;
    PATH_UPLOADED_IMAGES: string;
    PATH_MODEL_JSON: string;
  }
}

import express from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import mysql from "mysql2/promise";
import sizeOf from "image-size";
import * as tf from "@tensorflow/tfjs";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, process.env.PATH_UPLOADED_IMAGES);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const checkFileType = function (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const fileTypes = /jpeg|jpg|png/;

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Error: You can Only Upload Images!!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: checkFileType,
  limits: {
    fieldSize: 1000000,
  },
});

const app = express();
const port = process.env.PORT || 4001;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

app.use(cors());
app.use(morgan("dev"));

let model: tf.GraphModel;
(async () => {
  try {
    model = await tf.loadGraphModel(`file://${process.env.PATH_MODEL_JSON}`);
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error uploading model:", error);
  }
})();

app.post("/api/examinePatient", upload.single("image"), async (req, res) => {
  // 1. Extract file from request
  const { file } = req;
  // 2. Validate if existing file
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // 3. Use model to classify RMI file
  try {
    const dimensions = sizeOf(file.path);
    console.log(dimensions.width, dimensions.height);

    const output = {};
    try {
      // Preprocess image
      const image = fs.readFileSync(file.path);
      let tensor = tf.node.decodeImage(image);
      const resizedImage = tf.image.resizeNearestNeighbor(tensor, [128, 128]);
      const input = resizedImage.toFloat().div(tf.scalar(255));

      // Make predictions
      const predictions = await model.predict(input);

      console.log(predictions);

      // Send response
      res.status(200).json(output);
    } catch (error) {
      console.error("Error predicting:", error);
      res.status(500).json(output);
    }
  } catch (error) {
    console.error("Error classifying model:", error);
  }
  // 4. Save dataForm to database
  /* try {
    const { dni, name, lastName, password } = req.body;

    const [results, fields] = await pool.execute(
      "CALL ExaminePatient(?,?,?,?,?)",
      [dni, name, lastName, password, file.path]
    );

    // 5. Return response
    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: `[examinePatient]: ${error.message}`,
    });
  } */
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
