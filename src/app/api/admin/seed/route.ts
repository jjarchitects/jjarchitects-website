import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import initialProjects from "@/data/projectsData.json";

export async function POST() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        {
          error: "MongoDB is not configured. Please set MONGODB_URI in your .env file.",
        },
        { status: 503 }
      );
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of initialProjects) {
      const existing = await ProjectModel.findOne({ id: item.id });
      const projectPayload = {
        id: item.id,
        title: item.title,
        description: item.description || "",
        thumbnail: item.thumbnail,
        images: item.images || [],
        aboutProject: (item as any).aboutProject || "",
        location: item.location || "Bhuj, Gujarat",
        year: item.year || 2024,
        type: item.type || "Architecture",
        featured: Boolean(item.featured),
        tour360Link: item.tour360Link || null,
        vrTourLink: item.vrTourLink || null,
        area: item.area || "",
        status: (item as any).status || "completed",
        order: (item as any).order ?? 0,
      };

      if (existing) {
        await ProjectModel.updateOne({ id: item.id }, { $set: projectPayload });
        updatedCount++;
      } else {
        await ProjectModel.create(projectPayload);
        insertedCount++;
      }
    }

    const totalCount = await ProjectModel.countDocuments();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded projects into MongoDB. Inserted: ${insertedCount}, Updated: ${updatedCount}.`,
      insertedCount,
      updatedCount,
      totalCount,
    });
  } catch (error: any) {
    console.error("Error seeding initial projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed projects" },
      { status: 500 }
    );
  }
}
