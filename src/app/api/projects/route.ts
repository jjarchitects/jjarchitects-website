import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import { readProjectsFromFile } from "@/lib/project-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const type = searchParams.get("type");
    const limit = searchParams.get("limit");

    const conn = await connectToDatabase();
    let projects: any[] = [];
    let isMongo = false;

    if (conn) {
      try {
        const query: any = {};
        if (featured === "true") {
          query.featured = true;
        } else if (featured === "false") {
          query.featured = false;
        }

        if (type && type !== "All") {
          query.type = type;
        }

        let dbQuery = ProjectModel.find(query).sort({ order: 1, updatedAt: -1, createdAt: -1 });

        if (limit) {
          dbQuery = dbQuery.limit(Number(limit));
        }

        const dbProjects = await dbQuery.lean();
        if (dbProjects.length > 0) {
          projects = dbProjects;
          isMongo = true;
        }
      } catch (err) {
        console.error("MongoDB query error:", err);
      }
    }

    if (!isMongo) {
      let list = await readProjectsFromFile();
      if (featured === "true") {
        list = list.filter((p) => p.featured);
      } else if (featured === "false") {
        list = list.filter((p) => !p.featured);
      }

      if (type && type !== "All") {
        list = list.filter((p) => p.type === type);
      }

      if (limit) {
        list = list.slice(0, Number(limit));
      }

      projects = list;
    }

    return NextResponse.json({
      projects,
      source: isMongo ? "mongodb" : "file-sync",
    });
  } catch (error: any) {
    console.error("Public projects API error:", error);
    let list = await readProjectsFromFile();
    const { searchParams } = new URL(req.url);
    if (searchParams.get("featured") === "true") {
      list = list.filter((p) => p.featured);
    }
    return NextResponse.json({
      projects: list,
      source: "fallback",
    });
  }
}
