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
import mysql from "mysql2";
import type {
  RowDataPacket,
  PoolOptions,
  ProcedureCallPacket,
  ResultSetHeader,
} from "mysql2";
import { classifyImage, getClassificationPosition } from "./predictImage";

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

const access: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
};

const pool = mysql.createPool(access);

app.use(cors());
app.use(morgan("dev"));

/* let model: tf.GraphModel;
(async () => {
  try {
    model = await tf.loadGraphModel(`file://${process.env.PATH_MODEL_JSON}`);
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error uploading model:", error);
  }
})(); */

app.post("/api/examinePatient", upload.single("image"), async (req, res) => {
  // 1. Extract file from request
  const { file } = req;
  // 2. Validate if existing file
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // 3. Use model to classify RMI file
  const { real } = req.body;

  const realIndex = getClassificationPosition(real) + 1;
  const prediction = classifyImage(real);
  const predictionIndex = getClassificationPosition(prediction) + 1;

  // 4. Save dataForm to database
  try {
    const { dni, name, lastName, password, birthDate } = req.body;

    pool.execute<ProcedureCallPacket<ResultSetHeader>>(
      "CALL ExaminePatient(?,?,?,?,?,?,?,?)",
      [
        dni,
        name,
        lastName,
        password,
        file.path,
        realIndex,
        predictionIndex,
        birthDate,
      ],
      (_err: any, _result: ResultSetHeader) => {
        return res.status(200).json({
          message: "File uploaded successfully",
          prediction: classifyImage(prediction),
        });
      }
    );
  } catch (error: any) {
    return res.status(500).json({
      message: `[examinePatient]: ${error.message}`,
    });
  }
});

app.get("/api/getAlzheimerPatientCount", (_req, res) => {
  try {
    pool.execute<ProcedureCallPacket<[RowDataPacket[], ResultSetHeader]>>(
      "CALL GetAlzheimerCountsByClass()",
      (_err: any, result: [RowDataPacket[], ResultSetHeader]) => {
        const [rowDataPackets, _resultSetHeader] = result;
        return res.status(200).json(rowDataPackets);
      }
    );
  } catch (error: any) {
    return res.status(500).json({
      message: `[getAlzheimerPatientCount]: ${error.message}`,
    });
  }
});

app.get("/api/getAlzheimerPredictionCount", (_req, res) => {
  try {
    pool.execute<ProcedureCallPacket<[RowDataPacket[], ResultSetHeader]>>(
      "CALL GetPredictionCountsByClass()",
      (_err: any, result: [RowDataPacket[], ResultSetHeader]) => {
        const [rowDataPackets, _resultSetHeader] = result;
        return res.status(200).json(rowDataPackets);
      }
    );
  } catch (error: any) {
    return res.status(500).json({
      message: `[getAlzheimerPredictionCount]: ${error.message}`,
    });
  }
});

app.get("/api/GetAlzheimerCountsByAgeAndType", (_req, res) => {
  try {
    pool.execute<ProcedureCallPacket<[RowDataPacket[], ResultSetHeader]>>(
      "CALL GetAlzheimerCountsByAgeAndType()",
      (_err: any, result: [RowDataPacket[], ResultSetHeader]) => {
        const [rowDataPackets, _resultSetHeader] = result;
        return res.status(200).json(rowDataPackets);
      }
    );
  } catch (error: any) {
    return res.status(500).json({
      message: `[GetAlzheimerCountsByAgeAndType]: ${error.message}`,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
