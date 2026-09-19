import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import {
  readProjectsFromFile,
  updateProjectInFile,
  deleteProjectFromFile,
} from "@/lib/project-store";
import { deleteMultipleFromS3 } from "@/lib/s3";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (conn) {
      try {
        const project = await ProjectModel.findOne({ id }).lean();
        if (project) {
          return NextResponse.json({ project, source: "mongodb" });
        }
      } catch (err) {
        console.error("MongoDB get error:", err);
      }
    }

    const projects = await readProjectsFromFile();
    const fallback = projects.find((p) => p.id === id);
    if (!fallback) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ project: fallback, source: "json-store" });
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatePayload: any = {
      title: body.title?.trim(),
      description: body.description?.trim(),
      thumbnail: body.thumbnail?.trim(),
      images: Array.isArray(body.images) ? body.images : [],
      aboutProject: body.aboutProject?.trim() || "",
      location: body.location?.trim() || "Bhuj, Gujarat",
      year: body.year ? Number(body.year) : new Date().getFullYear(),
      type: body.type || "Architecture",
      featured: Boolean(body.featured),
      tour360Link: body.tour360Link || null,
      vrTourLink: body.vrTourLink || null,
      area: body.area?.trim() || "",
      status: body.status || "completed",
    };

    if (typeof body.order === "number") {
      updatePayload.order = body.order;
    }

    const conn = await connectToDatabase();
    let updated: any = null;

    if (conn) {
      try {
        updated = await ProjectModel.findOneAndUpdate(
          { id },
          { $set: updatePayload },
          { new: true, runValidators: true }
        ).lean();
      } catch (err) {
        console.error("MongoDB update error:", err);
      }
    }

    // Always update file so live site immediately sees the updates
    await updateProjectInFile(id, updatePayload);

    return NextResponse.json({
      success: true,
      project: updated || { id, ...updatePayload },
      message: "Project updated and synchronized with the live website.",
    });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    let projectToDelete: any = null;

    if (conn) {
      try {
        projectToDelete = await ProjectModel.findOne({ id }).lean();
        await ProjectModel.findOneAndDelete({ id });
      } catch (err) {
        console.error("MongoDB delete error:", err);
      }
    }

    if (!projectToDelete) {
      const fileProjects = await readProjectsFromFile();
      projectToDelete = fileProjects.find((p) => p.id === id);
    }

    // Clean up associated S3 images if any
    if (projectToDelete) {
      const imagesToDelete: string[] = [];
      if (projectToDelete.thumbnail) imagesToDelete.push(projectToDelete.thumbnail);
      if (Array.isArray(projectToDelete.images)) {
        imagesToDelete.push(...projectToDelete.images);
      }
      if (imagesToDelete.length > 0) {
        try {
          await deleteMultipleFromS3(imagesToDelete);
        } catch (s3Err) {
          console.error("Failed to clean up S3 images for project:", s3Err);
        }
      }
    }

    // Always delete from file as well
    await deleteProjectFromFile(id);

    return NextResponse.json({
      success: true,
      message: `Project "${id}" deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}
