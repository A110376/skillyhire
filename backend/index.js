import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import sequelize from "./database/connection.js";
import serverless from "serverless-http";

// DB connect
sequelize.sync({ alter: true })
  .then(() => console.log("📦 DB synced"))
  .catch(err => console.log("DB Error:", err));

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ❌ NO app.listen anywhere

export default serverless(app);