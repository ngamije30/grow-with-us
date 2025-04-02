import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  requirements: string[];
  skills: string[];
  applicationUrl?: string;
  contactEmail?: string;
  logo?: string;
  postedBy: mongoose.Types.ObjectId;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    requirements: [{
      type: String,
      required: [true, 'Job requirements are required'],
    }],
    skills: [{
      type: String,
      required: [true, 'Skills required for the job are required'],
    }],
    applicationUrl: {
      type: String,
    },
    contactEmail: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    logo: {
      type: String,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job;
