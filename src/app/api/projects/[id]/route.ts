import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import { readProjectsFromFile } from "@/lib/project-store";

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
        console.error("MongoDB single project query error:", err);
      }
    }

    const projects = await readProjectsFromFile();
    const project = projects.find((p) => p.id === id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project, source: "file-sync" });
  } catch (error: any) {
    console.error("Public single project API error:", error);
    const { id } = await params;
    const projects = await readProjectsFromFile();
    const project = projects.find((p) => p.id === id);
    if (project) {
      return NextResponse.json({ project, source: "fallback" });
    }
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
}
