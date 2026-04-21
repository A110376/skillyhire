import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import User from "./userSchema.js";

const Job = sequelize.define("Job", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Title is required" },
    },
  },
  jobType: {
    type: DataTypes.ENUM("Full-time", "Part-time", "Contract", "Internship"),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Location is required" },
    },
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Company name is required" },
    },
  },
  introduction: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  responsibilities: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Responsibilities are required" },
    },
  },
  qualifications: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Qualifications are required" },
    },
  },
  offers: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Salary is required" },
    },
  },
  hiringMultipleCandidates: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  personalWebsiteTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  personalWebsiteUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "Invalid URL format for personal website." },
    },
  },
  jobNiche: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Job niche is required" },
    },
  },
  newsLettersSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM("Open", "Closed", "Draft"),
    defaultValue: "Open",
  },
}, {
  tableName: "jobs",
  timestamps: true,
  paranoid: true,
  deletedAt: "deletedAt",
  createdAt: "jobPostedOn",
  updatedAt: "updatedAt",
  defaultScope: {
    attributes: { exclude: ["newsLettersSent"] }
  },
  indexes: [
    { fields: ['title'] },
    { fields: ['companyName'] },
    { fields: ['location'] },
  ],
});

// Relationship
Job.belongsTo(User, {
  foreignKey: {
    name: 'postedBy',
    allowNull: true,
  },
  as: 'poster',
});

export default Job;
