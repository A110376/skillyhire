import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { errorMiddleware } from "./middlewares/error.js";

config();

const app = express();

// middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  useTempFiles: false,
  limits: { fileSize: 5 * 1024 * 1024 },
}));

// routes
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

app.use(errorMiddleware);

export default app;
