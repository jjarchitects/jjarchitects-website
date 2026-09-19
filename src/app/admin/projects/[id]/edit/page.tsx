"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectForm, { ProjectFormData } from "@/components/admin/ProjectForm";
import { RefreshCw, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/projects/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load project details");
        }

        setProject(data.project);
      } catch (err: any) {
        setError(err.message || "Could not load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-copper animate-spin" />
        <span className="text-xs uppercase tracking-widest text-carbon-400">
          Loading Project Data...
        </span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-light text-carbon">Project Not Found</h2>
        <p className="text-xs text-carbon-400">{error || "Could not find the requested project."}</p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 bg-copper text-white text-xs uppercase tracking-wider font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProjectForm initialData={project} isEdit={true} />
    </div>
  );
}
