import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import serverless from "serverless-http";

// Cloudinary only
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ❌ REMOVE sequelize.sync completely

export default serverless(app);
