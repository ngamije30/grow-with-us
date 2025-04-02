import mongoose, { Document, Schema } from 'mongoose';

export interface IMentorship extends Document {
  mentor: mongoose.Types.ObjectId;
  title: string;
  description: string;
  skills: string[];
  duration: number; // in weeks
  capacity: number;
  enrolled: mongoose.Types.ObjectId[];
  status: 'open' | 'closed' | 'completed';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const mentorshipSchema = new Schema<IMentorship>(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Mentorship title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Mentorship description is required'],
    },
    skills: [{
      type: String,
      required: [true, 'Skills to be taught in the mentorship are required'],
    }],
    duration: {
      type: Number,
      required: [true, 'Mentorship duration is required'],
      min: [1, 'Mentorship duration must be at least 1 week'],
    },
    capacity: {
      type: Number,
      required: [true, 'Mentorship capacity is required'],
      min: [1, 'Mentorship capacity must be at least 1'],
    },
    enrolled: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      enum: ['open', 'closed', 'completed'],
      default: 'open',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Mentorship = mongoose.model<IMentorship>('Mentorship', mentorshipSchema);

export default Mentorship;
