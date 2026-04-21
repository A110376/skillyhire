import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// ONLY for manual testing (not auto-run)
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected");
  } catch (error) {
    console.error("❌ DB Error:", error.message);
  }
};
