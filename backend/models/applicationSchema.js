import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import User from './userSchema.js';
import Job from './jobSchema.js';

const Application = sequelize.define('Application', {
  jobSeekerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  jobSeekerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobSeekerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email.',
      },
    },
  },
  jobSeekerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobSeekerAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resumePublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Resume URL must be valid.',
      },
    },
  },
  jobSeekerCoverLetter: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  jobSeekerRole: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['Job Seeker']],
        msg: 'Role must be Job Seeker',
      },
    },
  },
  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  employerRole: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['Employer']],
        msg: 'Role must be Employer',
      },
    },
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Job,
      key: 'id',
    },
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deletedByJobSeeker: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedByEmployer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'applications',
  timestamps: true,
  createdAt: 'appliedAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['jobId', 'jobSeekerId'],
      name: 'unique_application_per_job',
    },
  ],
});

// 🔗 Associations
Application.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job',
});

Application.belongsTo(User, {
  foreignKey: 'jobSeekerId',
  as: 'jobSeeker',
});

Application.belongsTo(User, {
  foreignKey: 'employerId',
  as: 'employer',
});

// ✂️ Trim Hook for Clean Names
Application.beforeCreate(application => {
  if (application.jobSeekerName) {
    application.jobSeekerName = application.jobSeekerName.trim();
  }
});

Application.beforeUpdate(application => {
  if (application.jobSeekerName) {
    application.jobSeekerName = application.jobSeekerName.trim();
  }
});

export default Application;
