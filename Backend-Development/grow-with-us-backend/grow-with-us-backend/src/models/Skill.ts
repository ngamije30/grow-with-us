import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'technical' | 'soft' | 'business' | 'other';
  description: string;
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'course' | 'book' | 'other';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: ['technical', 'soft', 'business', 'other'],
    },
    description: {
      type: String,
      required: [true, 'Skill description is required'],
    },
    resources: [{
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['article', 'video', 'course', 'book', 'other'],
        default: 'other',
      },
    }],
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model<ISkill>('Skill', skillSchema);

export default Skill;
