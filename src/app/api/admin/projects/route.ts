import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import { readProjectsFromFile, addProjectToFile } from "@/lib/project-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const featured = searchParams.get("featured");

    const conn = await connectToDatabase();
    let projects: any[] = [];
    let isMongo = false;

    if (conn) {
      try {
        const query: any = {};
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ];
        }
        if (type && type !== "All") {
          query.type = type;
        }
        if (featured !== null && featured !== undefined && featured !== "") {
          query.featured = featured === "true";
        }

        projects = await ProjectModel.find(query).sort({ updatedAt: -1, createdAt: -1 }).lean();
        if (projects.length > 0) {
          isMongo = true;
        }
      } catch (err) {
        console.error("MongoDB query error, falling back to file:", err);
      }
    }

    if (!isMongo) {
      // Read directly from file
      let list = await readProjectsFromFile();
      if (search) {
        list = list.filter((p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.location?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (type && type !== "All") {
        list = list.filter((p) => p.type === type);
      }
      if (featured !== null && featured !== undefined && featured !== "") {
        list = list.filter((p) => String(p.featured) === featured);
      }
      projects = list;
    }

    const allProjects = isMongo ? await ProjectModel.find().lean() : await readProjectsFromFile();
    const total = allProjects.length;
    const featuredCount = allProjects.filter((p) => p.featured).length;
    const architectureCount = allProjects.filter((p) => p.type === "Architecture").length;
    const interiorCount = allProjects.filter((p) => p.type === "Interior").length;
    const threeDCount = allProjects.filter((p) => p.type === "3D").length;

    return NextResponse.json({
      projects,
      stats: {
        total,
        featured: featuredCount,
        architecture: architectureCount,
        interior: interiorCount,
        threeD: threeDCount,
      },
      source: isMongo ? "mongodb" : "json-store",
    });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      thumbnail,
      images,
      aboutProject,
      location,
      year,
      type,
      featured,
      tour360Link,
      vrTourLink,
      area,
      status,
    } = body;

    if (!title || !description || !thumbnail || !type) {
      return NextResponse.json(
        { error: "Title, description, thumbnail, and category type are required." },
        { status: 400 }
      );
    }

    // Generate slug/id
    let id = body.id ? slugify(body.id) : slugify(title);
    if (!id) {
      id = `project-${Date.now()}`;
    }

    const projectPayload = {
      id,
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim(),
      images: Array.isArray(images) ? images : [],
      aboutProject: aboutProject?.trim() || "",
      location: location?.trim() || "Bhuj, Gujarat",
      year: year ? Number(year) : new Date().getFullYear(),
      type,
      featured: Boolean(featured),
      tour360Link: tour360Link?.trim() || null,
      vrTourLink: vrTourLink?.trim() || null,
      area: area?.trim() || "",
      status: status || "completed",
    };

    let mongoCreated = null;
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const existing = await ProjectModel.findOne({ id });
        if (existing) {
          projectPayload.id = `${id}-${Date.now().toString().slice(-4)}`;
        }
        mongoCreated = await ProjectModel.create(projectPayload);
      } catch (mongoErr) {
        console.error("MongoDB save error:", mongoErr);
      }
    }

    // Always sync to file so live site immediately sees the project
    await addProjectToFile(mongoCreated ? mongoCreated.toObject() : projectPayload);

    return NextResponse.json(
      {
        success: true,
        project: mongoCreated || projectPayload,
        message: "Project created and synchronized with the live website.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
