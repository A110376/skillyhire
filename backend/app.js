import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connectDB } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";

// ✅ Load environment variables
config();

// ✅ Initialize app
const app = express();

// ✅ Connect to Localhost DB
const startDB = async () => {
  try {
    await connectDB();
    console.log("✅ DB Connected");
  } catch (err) {
    console.log("DB Error:", err.message);
  }
};

startDB();

// ✅ Enable CORS for localhost frontend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ File upload setup
app.use(
  fileUpload({
    useTempFiles: false, // ✅ memory use karega
    limits: { fileSize: 5 * 1024 * 1024 }, // optional
  })
);

// ✅ Health check route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// ✅ Cron jobs (newsletter etc.)
newsLetterCron();

// ✅ Main Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// ✅ Error handler (should be last)
app.use(errorMiddleware);

// ✅ Export app for index.js to use
export default app;
