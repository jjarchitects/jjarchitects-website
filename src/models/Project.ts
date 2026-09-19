import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  aboutProject?: string;
  location?: string;
  year?: number;
  type: string;
  featured: boolean;
  tour360Link?: string | null;
  vrTourLink?: string | null;
  area?: string;
  status?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: {
      type: String,
      required: [true, "Project slug/id is required"],
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail image URL is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    aboutProject: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "Bhuj, Gujarat",
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    type: {
      type: String,
      required: [true, "Project type/category is required"],
      enum: ["Architecture", "Interior", "3D", "Other"],
      default: "Architecture",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    tour360Link: {
      type: String,
      default: null,
    },
    vrTourLink: {
      type: String,
      default: null,
    },
    area: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "completed",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling model in Next.js development Turbopack reloads
export const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default ProjectModel;
