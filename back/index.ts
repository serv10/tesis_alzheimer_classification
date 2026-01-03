import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import sql, { config, IProcedureResult, ISqlType } from "mssql";
import {
  getClassificationKeyByIndex,
  getClassificationKeyPosition,
} from "./predictImage";
import type { ResultType } from "./interface";
import {
  loadModel,
  getTensorflowPrediction,
} from "./services/tensorflowPredictionService";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, process.env.PATH_UPLOADED_IMAGES || "./uploads");
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
  limits: { fieldSize: 1000000 },
});

const app = express();
const port = process.env.PORT || 4001;

const sqlConfig: config = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST || "localhost",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(sqlConfig);

pool.connect((err) => {
  if (err) {
    console.error("Connection error", err);
    return;
  }
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Connection Pool Error", err);
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Load TensorFlow.js model on startup
(async () => {
  try {
    await loadModel();
  } catch (error) {
    console.error("Error loading TensorFlow.js model:", error);
  }
})();

// Helper function to execute stored procedures
const executeStoredProcedure = async <T>(
  procedureName: string,
  inputs?: { name: string; type?: (() => ISqlType) | ISqlType; value: unknown }[]
): Promise<IProcedureResult<T>> => {
  const request = new sql.Request(pool);

  if (inputs) {
    for (const input of inputs) {
      if (input.type) {
        request.input(input.name, input.type, input.value);
      } else {
        request.input(input.name, input.value);
      }
    }
  }

  return request.execute<T>(procedureName);
};

// ============================================
// PATIENTS ENDPOINTS
// ============================================

// POST /api/patients/examine - Examine patient with MRI image
app.post("/api/patients/examine", upload.single("image"), async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { real } = req.body;
    const realIndex = real ? getClassificationKeyPosition(real) : -1;
    const realValue = realIndex >= 0 ? realIndex + 1 : null;

    // Get prediction using TensorFlow.js
    const [err, response] = await getTensorflowPrediction(file.path);

    if (err) {
      console.log("Prediction failed:", err.message);
      return res.status(400).json({ message: err.message });
    }

    if (!response) {
      return res.status(500).json({ message: "No prediction response received" });
    }

    const { result: predictionIndex } = response;
    const predictionKey = getClassificationKeyByIndex(predictionIndex);
    const { dni, name, lastName, birthDate, gender } = req.body;

    const result = await executeStoredProcedure<ResultType>("ExaminePatient", [
      { name: "dni", value: dni },
      { name: "name", value: name },
      { name: "last_name", value: lastName },
      { name: "password", type: sql.VarChar, value: null },
      { name: "image_path", value: file.path },
      { name: "real_prediction", value: realValue },
      { name: "value_prediction", value: predictionIndex + 1 },
      { name: "birth_date", value: birthDate },
      { name: "id_gender", value: gender },
    ]);

    const dbResult = result.recordsets?.[result.recordsets.length - 1]?.[0];
    if (!dbResult) {
      return res.status(500).json({ message: "No result from database" });
    }

    return res.status(200).json({
      result: dbResult.result,
      prediction: predictionKey,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: `[POST /patients/examine]: ${message}` });
  }
});

// GET /api/patients - Get all patients
app.get("/api/patients", async (_req, res) => {
  try {
    const result = await executeStoredProcedure("GetAllPatients");
    return res.status(200).json(result.recordset);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: `[GET /patients]: ${message}` });
  }
});

// GET /api/patients/:dni - Get patient by DNI
app.get("/api/patients/:dni", async (req, res) => {
  try {
    const { dni } = req.params;
    const result = await executeStoredProcedure("GetPatientByDni", [
      { name: "dni", value: dni },
    ]);

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ exists: false, message: "Patient not found" });
    }

    return res.status(200).json({ exists: true, patient: result.recordset[0] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: `[GET /patients/:dni]: ${message}` });
  }
});

// GET /api/patients/:dni/images - Get patient images
app.get("/api/patients/:dni/images", async (req, res) => {
  try {
    const { dni } = req.params;
    const result = await executeStoredProcedure("GetPatientImages", [
      { name: "dni", value: dni },
    ]);
    return res.status(200).json(result.recordset);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: `[GET /patients/:dni/images]: ${message}` });
  }
});

// ============================================
// IMAGES ENDPOINTS
// ============================================

// PATCH /api/images/:id/classification - Update image real classification
app.patch("/api/images/:id/classification", async (req, res) => {
  try {
    const { id } = req.params;
    const { realValue } = req.body;

    if (!realValue || realValue < 1 || realValue > 4) {
      return res.status(400).json({ message: "Invalid classification value (must be 1-4)" });
    }

    await executeStoredProcedure("UpdateImageRealValue", [
      { name: "imagePatientId", value: parseInt(id) },
      { name: "realValue", value: realValue },
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: `[PATCH /images/:id/classification]: ${message}` });
  }
});

// ============================================
// STATISTICS ENDPOINTS
// ============================================

// GET /api/statistics/classifications - Get classification counts
app.get("/api/statistics/classifications", async (_req, res) => {
  try {
    const result = await executeStoredProcedure("GetClassifications");
    return res.status(200).json(result.recordset);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: `[GET /statistics/classifications]: ${message}` });
  }
});

// GET /api/statistics/age-distribution - Get age distribution
app.get("/api/statistics/age-distribution", async (_req, res) => {
  try {
    const result = await executeStoredProcedure("GetAgeDistribution");
    return res.status(200).json(result.recordset);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: `[GET /statistics/age-distribution]: ${message}` });
  }
});

// GET /api/statistics/confusion-matrix - Get confusion matrix data
app.get("/api/statistics/confusion-matrix", async (_req, res) => {
  try {
    const result = await executeStoredProcedure("GetConfusionMatrixData");
    return res.status(200).json(result.recordset);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: `[GET /statistics/confusion-matrix]: ${message}` });
  }
});

// Serve uploaded images
app.use("/uploads", express.static(process.env.PATH_UPLOADED_IMAGES || "./uploads"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
