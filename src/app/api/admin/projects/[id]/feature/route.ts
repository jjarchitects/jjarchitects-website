import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import { readProjectsFromFile, toggleFeaturedInFile } from "@/lib/project-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    let targetFeaturedState: boolean;

    if (typeof body.featured === "boolean") {
      targetFeaturedState = body.featured;
    } else {
      // Find current state
      const projects = await readProjectsFromFile();
      const current = projects.find((p) => p.id === id);
      targetFeaturedState = current ? !current.featured : true;
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
        await ProjectModel.findOneAndUpdate(
          { id },
          { $set: { featured: targetFeaturedState } }
        );
      } catch (err) {
        console.error("MongoDB feature toggle error:", err);
      }
    }

    // Always toggle in file
    await toggleFeaturedInFile(id, targetFeaturedState);

    return NextResponse.json({
      success: true,
      featured: targetFeaturedState,
      id,
      message: `Project featured status updated to ${
        targetFeaturedState ? "FEATURED (Visible on Homepage Hero)" : "Standard"
      }.`,
    });
  } catch (error: any) {
    console.error("Error toggling featured status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to toggle featured status" },
      { status: 500 }
    );
  }
}
