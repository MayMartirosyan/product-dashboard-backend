import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import profileRoutes from "./routes/profile";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

dotenv.config();

const app = express();

const uploadDir = path.join(__dirname, "../Uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use("/Uploads", express.static(uploadDir));


if (!process.env.NODE_ENV) {
  console.warn("NODE_ENV is not set. Defaulting to development.");
  process.env.NODE_ENV = "development";
}

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to PostgreSQL");

    app.use("/api/auth", authRoutes);
    app.use("/api/products", upload.single("picture"), productRoutes);
    app.use("/api/profile", upload.single("picture"), profileRoutes);

    const port = process.env.SERVER_PORT || 8000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to PostgreSQL:", error);
  });