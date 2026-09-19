import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "projectsData.json");

export async function readProjectsFromFile(): Promise<any[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read projectsData.json:", error);
    return [];
  }
}

export async function saveProjectsToFile(projects: any[]): Promise<boolean> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(projects, null, 4), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to save projectsData.json:", error);
    return false;
  }
}

export async function addProjectToFile(project: any): Promise<boolean> {
  try {
    const projects = await readProjectsFromFile();
    const index = projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...projects[index], ...project };
    } else {
      projects.unshift(project);
    }
    return await saveProjectsToFile(projects);
  } catch (e) {
    console.error("Error adding project to file:", e);
    return false;
  }
}

export async function updateProjectInFile(id: string, updates: any): Promise<boolean> {
  try {
    const projects = await readProjectsFromFile();
    const index = projects.findIndex((p) => p.id === id);
    if (index >= 0) {
      projects[index] = { ...projects[index], ...updates };
      return await saveProjectsToFile(projects);
    }
    return false;
  } catch (e) {
    console.error("Error updating project in file:", e);
    return false;
  }
}

export async function deleteProjectFromFile(id: string): Promise<boolean> {
  try {
    const projects = await readProjectsFromFile();
    const filtered = projects.filter((p) => p.id !== id);
    return await saveProjectsToFile(filtered);
  } catch (e) {
    console.error("Error deleting project from file:", e);
    return false;
  }
}

export async function toggleFeaturedInFile(id: string, featured?: boolean): Promise<boolean> {
  try {
    const projects = await readProjectsFromFile();
    const index = projects.findIndex((p) => p.id === id);
    if (index >= 0) {
      const nextFeatured = typeof featured === "boolean" ? featured : !projects[index].featured;
      projects[index].featured = nextFeatured;
      return await saveProjectsToFile(projects);
    }
    return false;
  } catch (e) {
    console.error("Error toggling featured in file:", e);
    return false;
  }
}
