import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not set in environment or .env file.");
  process.exit(1);
}

// Minimal inline schema matching ProjectModel to keep script standalone
const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    thumbnail: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    aboutProject: { type: String, default: "" },
    location: { type: String, default: "Bhuj, Gujarat" },
    year: { type: Number, default: () => new Date().getFullYear() },
    type: {
      type: String,
      required: true,
      enum: ["Architecture", "Interior", "3D", "Other"],
      default: "Architecture",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    tour360Link: { type: String, default: null },
    vrTourLink: { type: String, default: null },
    area: { type: String, default: "" },
    status: { type: String, default: "completed" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

async function seed() {
  console.log("🚀 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    maxPoolSize: 10,
  });
  console.log(`✅ Connected to database: "${mongoose.connection.name}"`);

  const dataFilePath = path.resolve(__dirname, "../src/data/projectsData.json");
  console.log(`📖 Reading projects from: ${dataFilePath}`);
  const rawData = await fs.readFile(dataFilePath, "utf8");
  const projects = JSON.parse(rawData);

  if (!Array.isArray(projects) || projects.length === 0) {
    console.warn("⚠️ No projects found in JSON file.");
    await mongoose.disconnect();
    return;
  }

  console.log(`📦 Found ${projects.length} projects to seed.`);

  let insertedCount = 0;
  let updatedCount = 0;

  for (const item of projects) {
    const payload = {
      id: item.id,
      title: item.title,
      description: item.description || "",
      thumbnail: item.thumbnail,
      images: Array.isArray(item.images) ? item.images : [],
      aboutProject: item.aboutProject || "",
      location: item.location || "Bhuj, Gujarat",
      year: item.year ? Number(item.year) : 2024,
      type: item.type || "Architecture",
      featured: Boolean(item.featured),
      tour360Link: item.tour360Link || null,
      vrTourLink: item.vrTourLink || null,
      area: item.area || "",
      status: item.status || "completed",
      order: typeof item.order === "number" ? item.order : 0,
    };

    const existing = await Project.findOne({ id: item.id });
    if (existing) {
      await Project.updateOne({ id: item.id }, { $set: payload });
      console.log(` 🔄 Updated: "${item.title}" (${item.id})`);
      updatedCount++;
    } else {
      await Project.create(payload);
      console.log(` ➕ Inserted: "${item.title}" (${item.id})`);
      insertedCount++;
    }
  }

  const totalInDb = await Project.countDocuments();
  console.log("\n========================================");
  console.log("✨ Seeding Complete!");
  console.log(`   ➕ Inserted: ${insertedCount}`);
  console.log(`   🔄 Updated:  ${updatedCount}`);
  console.log(`   📊 Total in MongoDB: ${totalInDb}`);
  console.log("========================================\n");

  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB.");
}

seed().catch(async (err) => {
  console.error("❌ Seeding failed with error:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
