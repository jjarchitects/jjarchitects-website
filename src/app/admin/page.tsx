"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Database,
  CheckCircle2,
  AlertCircle,
  Building2,
  Home as HomeIcon,
  Box,
  Layers,
  ArrowUpRight,
  RefreshCw,
  UploadCloud,
} from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images?: string[];
  location?: string;
  year?: number;
  type: string;
  featured: boolean;
  area?: string;
  updatedAt?: string;
}

interface StatsData {
  total: number;
  featured: number;
  architecture: number;
  interior: number;
  threeD: number;
}

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    featured: 0,
    architecture: 0,
    interior: 0,
    threeD: 0,
  });
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "standard">("all");

  // Notification states
  const [notice, setNotice] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Seeding state
  const [seeding, setSeeding] = useState(false);

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch projects and stats
  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedType !== "All") params.set("type", selectedType);
      if (featuredFilter === "featured") params.set("featured", "true");
      if (featuredFilter === "standard") params.set("featured", "false");

      const res = await fetch(`/api/admin/projects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        if (data.stats) setStats(data.stats);
        setIsFallback(Boolean(data.isFallback));
      }
    } catch (e) {
      console.error("Error loading projects:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [selectedType, featuredFilter]);

  // Handle Search Debounce / Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects();
  };

  // Toggle Featured status live
  const handleToggleFeatured = async (project: ProjectItem) => {
    const nextFeatured = !project.featured;

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: nextFeatured } : p))
    );
    setStats((prev) => ({
      ...prev,
      featured: nextFeatured ? prev.featured + 1 : Math.max(0, prev.featured - 1),
    }));

    try {
      const res = await fetch(`/api/admin/projects/${project.id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextFeatured }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Revert on error
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, featured: project.featured } : p))
        );
        setStats((prev) => ({
          ...prev,
          featured: project.featured ? prev.featured + 1 : Math.max(0, prev.featured - 1),
        }));
        setNotice({
          type: "error",
          message: data.error || "Failed to update featured status.",
        });
      } else {
        setNotice({
          type: "success",
          message: data.message || `Project "${project.title}" featured status updated.`,
        });
      }
    } catch (err: any) {
      // Revert on error
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: project.featured } : p))
      );
      setNotice({
        type: "error",
        message: "Failed to connect to backend server.",
      });
    }
  };

  // One-click Seed Initial Projects
  const handleSeedProjects = async () => {
    try {
      setSeeding(true);
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setNotice({
          type: "error",
          message: data.error || "Failed to seed initial projects.",
        });
      } else {
        setNotice({
          type: "success",
          message: data.message || "Successfully imported projects to MongoDB.",
        });
        loadProjects();
      }
    } catch (err: any) {
      setNotice({
        type: "error",
        message: err.message || "Could not complete project sync.",
      });
    } finally {
      setSeeding(false);
    }
  };

  // Delete project
  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/projects/${projectToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          type: "error",
          message: data.error || "Failed to delete project.",
        });
      } else {
        setNotice({
          type: "success",
          message: data.message || "Project deleted successfully.",
        });
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
        setStats((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          featured: projectToDelete.featured ? Math.max(0, prev.featured - 1) : prev.featured,
        }));
      }
    } catch (e: any) {
      setNotice({
        type: "error",
        message: "Could not delete project.",
      });
    } finally {
      setDeleting(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & New Project Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe-300 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-px bg-copper" />
            <span className="text-xs uppercase tracking-[0.25em] text-copper font-medium">
              PORTFOLIO MANAGEMENT
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-carbon">
            Studio Projects
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProjects}
            title="Refresh list"
            className="p-2.5 bg-white border border-taupe-300 hover:border-copper hover:text-copper transition-colors text-carbon-400"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-copper hover:bg-copper-600 text-white text-xs uppercase tracking-wider font-medium transition-all shadow hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {notice && (
        <div
          className={`p-4 border-l-4 text-sm flex items-start justify-between gap-3 ${
            notice.type === "success"
              ? "bg-emerald-50 border-emerald-500 text-emerald-900"
              : notice.type === "error"
              ? "bg-rose-50 border-rose-500 text-rose-900"
              : "bg-sky-50 border-sky-500 text-sky-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-xs font-semibold uppercase opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Fallback Banner / Seed Action */}
      {isFallback && (
        <div className="bg-amber-50/80 border border-amber-300/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Static Data Mode (projectsData.json)
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                MongoDB is not yet connected or has not been synced with the initial
                studio portfolio. Once you configure <code>MONGODB_URI</code>, you can
                import all 18 existing projects with one click.
              </p>
            </div>
          </div>
          <button
            onClick={handleSeedProjects}
            disabled={seeding}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-carbon hover:bg-copper text-white text-xs uppercase tracking-wider font-medium transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{seeding ? "Syncing to Mongo..." : "Sync Projects to MongoDB"}</span>
          </button>
        </div>
      )}

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Projects */}
        <div className="bg-white border border-taupe-300 p-4 shadow-sm">
          <div className="flex items-center justify-between text-carbon-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-medium">
              Total Projects
            </span>
            <Layers className="w-4 h-4 text-copper" />
          </div>
          <p className="text-2xl font-light text-carbon">{stats.total}</p>
          <span className="text-[11px] text-carbon-300 mt-1 block">In portfolio</span>
        </div>

        {/* Featured Projects */}
        <div className="bg-white border border-copper/40 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-copper/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-copper mb-2">
            <span className="text-[11px] uppercase tracking-wider font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Homepage Hero
            </span>
          </div>
          <p className="text-2xl font-light text-copper">{stats.featured}</p>
          <span className="text-[11px] text-carbon-400 mt-1 block">
            Featured on slider
          </span>
        </div>

        {/* Architecture */}
        <div className="bg-white border border-taupe-300 p-4 shadow-sm">
          <div className="flex items-center justify-between text-carbon-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-medium">
              Architecture
            </span>
            <Building2 className="w-4 h-4 text-carbon-300" />
          </div>
          <p className="text-2xl font-light text-carbon">{stats.architecture}</p>
          <span className="text-[11px] text-carbon-300 mt-1 block">Projects</span>
        </div>

        {/* Interior */}
        <div className="bg-white border border-taupe-300 p-4 shadow-sm">
          <div className="flex items-center justify-between text-carbon-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-medium">
              Interior
            </span>
            <HomeIcon className="w-4 h-4 text-carbon-300" />
          </div>
          <p className="text-2xl font-light text-carbon">{stats.interior}</p>
          <span className="text-[11px] text-carbon-300 mt-1 block">Projects</span>
        </div>

        {/* 3D Visuals */}
        <div className="bg-white border border-taupe-300 p-4 shadow-sm">
          <div className="flex items-center justify-between text-carbon-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-medium">
              3D & Visuals
            </span>
            <Box className="w-4 h-4 text-carbon-300" />
          </div>
          <p className="text-2xl font-light text-carbon">{stats.threeD}</p>
          <span className="text-[11px] text-carbon-300 mt-1 block">Projects</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-taupe-300 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-md flex items-center"
        >
          <Search className="w-4 h-4 text-carbon-300 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, location..."
            className="w-full pl-9 pr-20 py-2 text-xs bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1 px-3 py-1 bg-carbon hover:bg-copper text-white text-[11px] uppercase tracking-wider font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center bg-taupe-100 p-1 border border-taupe-200 text-xs">
            {["All", "Architecture", "Interior", "3D"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 text-xs transition-colors font-medium ${
                  selectedType === type
                    ? "bg-carbon text-white shadow-sm"
                    : "text-carbon-400 hover:text-carbon"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Featured Filter */}
          <div className="flex items-center bg-taupe-100 p-1 border border-taupe-200 text-xs">
            <button
              onClick={() => setFeaturedFilter("all")}
              className={`px-3 py-1 text-xs transition-colors font-medium ${
                featuredFilter === "all"
                  ? "bg-carbon text-white shadow-sm"
                  : "text-carbon-400 hover:text-carbon"
              }`}
            >
              All Visibilities
            </button>
            <button
              onClick={() => setFeaturedFilter("featured")}
              className={`px-3 py-1 text-xs transition-colors font-medium flex items-center gap-1 ${
                featuredFilter === "featured"
                  ? "bg-copper text-white shadow-sm"
                  : "text-carbon-400 hover:text-copper"
              }`}
            >
              <Sparkles className="w-3 h-3" /> Featured Only
            </button>
          </div>
        </div>
      </div>

      {/* Projects Table View */}
      <div className="bg-white border border-taupe-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-6 h-6 text-copper animate-spin" />
            <span className="text-xs uppercase tracking-widest text-carbon-400">
              Loading Projects...
            </span>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Building2 className="w-10 h-10 text-carbon-200 mx-auto" />
            <p className="text-lg font-light text-carbon">No projects found.</p>
            <p className="text-xs text-carbon-400 max-w-sm mx-auto">
              No projects match your current filter or search criteria.
            </p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2 bg-copper hover:bg-copper-600 text-white text-xs uppercase tracking-wider font-medium"
            >
              <Plus className="w-4 h-4" /> Create New Project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-carbon border-collapse">
              <thead>
                <tr className="border-b border-taupe-300 bg-taupe-100/50 uppercase tracking-wider text-[11px] text-carbon-400 font-medium">
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location / Year</th>
                  <th className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-copper">
                      <Sparkles className="w-3 h-3" /> Featured on Hero
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-taupe-200">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className={`hover:bg-taupe-100/40 transition-colors ${
                      project.featured ? "bg-copper/5" : ""
                    }`}
                  >
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-10 bg-carbon-800 shrink-0 border border-taupe-300 overflow-hidden">
                          {project.thumbnail ? (
                            <Image
                              src={project.thumbnail}
                              alt={project.title}
                              fill
                              className="object-cover"
                              sizes="60px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-taupe-400">
                              <Building2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="font-medium text-carbon hover:text-copper transition-colors truncate block text-sm"
                          >
                            {project.title}
                          </Link>
                          <span className="text-[11px] text-carbon-300 font-mono block truncate">
                            /{project.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 text-[11px] uppercase tracking-wider bg-taupe-200 text-carbon-500 font-medium rounded-sm">
                        {project.type}
                      </span>
                    </td>

                    {/* Location & Year */}
                    <td className="py-3.5 px-4 text-carbon-400">
                      <div>{project.location || "Bhuj, Gujarat"}</div>
                      <div className="text-[11px] text-carbon-300">
                        {project.year || "—"} {project.area ? `• ${project.area}` : ""}
                      </div>
                    </td>

                    {/* Featured Toggle Switch (Live Click!) */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            project.featured ? "bg-copper" : "bg-zinc-300"
                          }`}
                          role="switch"
                          aria-checked={project.featured}
                          title={
                            project.featured
                              ? "Click to remove from homepage hero slider"
                              : "Click to feature on homepage hero slider"
                          }
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              project.featured ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-[10px] mt-1 font-medium ${
                            project.featured ? "text-copper" : "text-carbon-300"
                          }`}
                        >
                          {project.featured ? "Featured" : "Standard"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Live site link */}
                        <Link
                          href={`/projects/${project.id}`}
                          target="_blank"
                          title="View on public site"
                          className="p-1.5 text-carbon-400 hover:text-copper hover:bg-taupe-200 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Edit link */}
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          title="Edit project"
                          className="p-1.5 text-carbon-400 hover:text-carbon hover:bg-taupe-200 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          title="Delete project"
                          className="p-1.5 text-carbon-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-carbon-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-taupe-300 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium text-carbon">Delete Project</h3>
            </div>

            <p className="text-sm text-carbon-400 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-carbon font-semibold">
                "{projectToDelete.title}"
              </strong>
              ? This action will remove the project from MongoDB and the website.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-taupe-200">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 border border-taupe-300 text-xs uppercase tracking-wider font-medium text-carbon-400 hover:text-carbon bg-white hover:bg-taupe-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProject}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5"
              >
                <span>{deleting ? "Deleting..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
