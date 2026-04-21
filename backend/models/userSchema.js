import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../database/connection.js";
import jwt from "jsonwebtoken";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "Name must be between 3 and 30 characters.",
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // ✅ Enforced DB-level unique constraint
      validate: {
        isEmail: {
          msg: "Please provide a valid email!",
        },
      },
    },

    phone: {
      type: DataTypes.STRING, // ✅ Changed from BIGINT to STRING
      allowNull: false,
      validate: {
        is: {
          args: /^\d{10,15}$/,
          msg: "Phone number must be 10 to 15 digits and contain only numbers.",
        },
      },
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    resume: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        notEmptyForJobSeeker(value) {
          if (this.role === "Job Seeker" && (!value || value.trim() === "")) {
            throw new Error("Cover letter is required for Job Seekers.");
          }
        },
      },
    },

    niches: {
      type: DataTypes.JSONB,
      allowNull: true,
      validate: {
        isValidNiches(value) {
          if (value) {
            const { firstNiche, secondNiche, thirdNiche } = value;
            const all = [firstNiche, secondNiche, thirdNiche];

            if (all.includes("") || all.includes(undefined)) {
              throw new Error("All 3 niches must be selected.");
            }

            const unique = new Set(all);
            if (unique.size !== 3) {
              throw new Error("Please select 3 different niches.");
            }
          }
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidLength(value) {
          const isHashed = value.startsWith("$2"); // ✅ Better check for bcrypt hash
          if (!isHashed && (value.length < 8 || value.length > 15)) {
            throw new Error("Password must be between 8 and 15 characters.");
          }
        },
      },
    },

    role: {
      type: DataTypes.ENUM("Job Seeker", "Employer"),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    hooks: {
      beforeCreate: async (user) => {
        user.email = user.email?.toLowerCase().trim();
        user.name = user.name?.trim();
        user.address = user.address?.trim();

        if (user.password && !user.password.startsWith("$2")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },

      beforeUpdate: async (user) => {
        user.email = user.email?.toLowerCase().trim();
        user.name = user.name?.trim();
        user.address = user.address?.trim();

        if (user.changed("password") && !user.password.startsWith("$2")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

// ✅ Instance methods
User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.getJWTToken = function () {
  return jwt.sign(
    { id: this.id, role: this.role }, // ✅ Include role for client decoding
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export default User;
