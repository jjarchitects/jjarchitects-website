"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Sparkles,
  Trash2,
  Plus,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Image as ImageIcon,
  Compass,
  MapPin,
  Calendar,
  Layers,
  Maximize2,
} from "lucide-react";
import Link from "next/link";

export interface ProjectFormData {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  aboutProject: string;
  location: string;
  year: number;
  type: string;
  featured: boolean;
  tour360Link: string;
  vrTourLink: string;
  area: string;
  status: string;
}

interface ProjectFormProps {
  initialData?: ProjectFormData;
  isEdit?: boolean;
}

export default function ProjectForm({
  initialData,
  isEdit = false,
}: ProjectFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectFormData>({
    id: initialData?.id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    thumbnail: initialData?.thumbnail || "",
    images: initialData?.images || [],
    aboutProject: initialData?.aboutProject || "",
    location: initialData?.location || "Bhuj, Gujarat",
    year: initialData?.year || new Date().getFullYear(),
    type: initialData?.type || "Architecture",
    featured: initialData?.featured ?? false,
    tour360Link: initialData?.tour360Link || "",
    vrTourLink: initialData?.vrTourLink || "",
    area: initialData?.area || "",
    status: initialData?.status || "completed",
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-generate slug if not editing
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!isEdit && !prev.id) {
        // Only auto-slug if ID was empty or auto-generated
        updated.id = val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-");
      }
      return updated;
    });
  };

  // Upload file to S3
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "projects");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }
    return data.url;
  };

  // Delete file from S3 helper
  const deleteFileFromS3 = async (url: string) => {
    if (!url) return;
    try {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.warn("Could not delete image from S3:", data.error);
      }
    } catch (err) {
      console.error("Failed to delete image from S3:", err);
    }
  };

  // Thumbnail upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingThumbnail(true);
      setErrorMsg(null);
      const oldThumbnail = formData.thumbnail;
      const url = await handleFileUpload(file);
      if (url) {
        setFormData((prev) => ({ ...prev, thumbnail: url }));
        setSuccessMsg("Thumbnail uploaded to AWS S3 successfully.");

        // If replacing an existing S3 thumbnail, clean up previous one
        if (oldThumbnail && oldThumbnail !== url) {
          deleteFileFromS3(oldThumbnail);
        }
      }
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          "Could not upload image to S3. Check AWS credentials in .env or paste a direct image URL."
      );
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Remove thumbnail and delete from S3
  const handleRemoveThumbnail = async () => {
    const thumbUrl = formData.thumbnail;
    if (!thumbUrl) return;

    setFormData((prev) => ({ ...prev, thumbnail: "" }));
    await deleteFileFromS3(thumbUrl);
    setSuccessMsg("Thumbnail removed and deleted from AWS S3.");
  };

  // Gallery multi-file upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingGallery(true);
      setErrorMsg(null);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const url = await handleFileUpload(files[i]);
        if (url) uploadedUrls.push(url);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      setSuccessMsg(`Uploaded ${uploadedUrls.length} image(s) to AWS S3.`);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          "Could not upload some gallery images to S3. Check AWS credentials in .env or paste direct URLs."
      );
    } finally {
      setUploadingGallery(false);
    }
  };

  // Add image by manual URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }));
    setNewImageUrl("");
  };

  // Remove gallery image and delete from S3
  const handleRemoveImage = async (indexToRemove: number) => {
    const imgUrl = formData.images[indexToRemove];
    if (!imgUrl) return;

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));

    await deleteFileFromS3(imgUrl);
    setSuccessMsg("Gallery image removed and deleted from AWS S3.");
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.title.trim()) {
      setErrorMsg("Please provide a project title.");
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg("Please provide a short description.");
      return;
    }
    if (!formData.thumbnail.trim()) {
      setErrorMsg("Please upload or provide a thumbnail image URL.");
      return;
    }

    try {
      setSubmitting(true);
      const url = isEdit
        ? `/api/admin/projects/${formData.id}`
        : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save project");
      }

      setSuccessMsg(
        isEdit
          ? "Project updated successfully!"
          : "Project created successfully! Redirecting to projects list..."
      );

      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving the project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe-300 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 border border-taupe-300 bg-white hover:border-copper hover:text-copper transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-copper font-medium">
                {isEdit ? "Edit Project" : "New Entry"}
              </span>
              {formData.featured && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-copper/10 text-copper px-2 py-0.5 rounded font-medium border border-copper/30">
                  <Sparkles className="w-3 h-3" /> Featured on Homepage
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-carbon">
              {formData.title || (isEdit ? "Edit Project" : "New Architecture Project")}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 text-xs uppercase tracking-wider font-medium text-carbon-400 hover:text-carbon border border-taupe-300 bg-white hover:bg-taupe-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-copper hover:bg-copper-600 text-white text-xs uppercase tracking-wider font-medium transition-all shadow hover:shadow-md disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? "Saving..." : isEdit ? "Update Project" : "Save Project"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Notification</p>
            <p className="text-rose-700">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Success</p>
            <p className="text-emerald-700">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Project Info (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Basic Info */}
          <div className="bg-white border border-taupe-300 p-6 shadow-sm space-y-5">
            <div className="border-b border-taupe-200 pb-3">
              <h2 className="text-base uppercase tracking-wider font-medium text-carbon flex items-center gap-2">
                <Layers className="w-4 h-4 text-copper" />
                Project Essentials
              </h2>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium">
                Project Title <span className="text-copper">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Modern Minimalist Villa"
                className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm transition-all"
              />
            </div>

            {/* Slug / ID and Category in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium">
                  Slug / Unique ID <span className="text-copper">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value.trim() })
                  }
                  placeholder="e.g. modern-minimalist-villa"
                  className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm font-mono transition-all"
                />
                <span className="text-[11px] text-carbon-300 mt-1 block">
                  Used in URL: /projects/{formData.id || "slug"}
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium">
                  Category / Discipline <span className="text-copper">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm transition-all"
                >
                  <option value="Architecture">Architecture</option>
                  <option value="Interior">Interior</option>
                  <option value="3D">3D</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium">
                Short Description (Cards & Hero Carousel){" "}
                <span className="text-copper">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="A concise, editorial summary of the project architecture and materials..."
                className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm transition-all leading-relaxed"
              />
            </div>

            {/* Detailed Story / About Project */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium">
                Detailed Narrative / About Project
              </label>
              <textarea
                rows={5}
                value={formData.aboutProject}
                onChange={(e) =>
                  setFormData({ ...formData, aboutProject: e.target.value })
                }
                placeholder="In-depth design philosophy, spatial planning, client brief, structural composition, and materiality..."
                className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm transition-all leading-relaxed"
              />
            </div>
          </div>

          {/* Card: Architectural Specifications */}
          <div className="bg-white border border-taupe-300 p-6 shadow-sm space-y-5">
            <div className="border-b border-taupe-200 pb-3">
              <h2 className="text-base uppercase tracking-wider font-medium text-carbon flex items-center gap-2">
                <Compass className="w-4 h-4 text-copper" />
                Specifications & Location
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-copper" /> Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Bhuj, Gujarat"
                  className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-copper" /> Completion Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: Number(e.target.value) })
                  }
                  placeholder="2025"
                  className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-copper" /> Built-up Area
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="e.g. 2400 sq ft"
                  className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium">
                  Project Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm"
                >
                  <option value="completed">Completed</option>
                  <option value="ongoing">Under Construction</option>
                  <option value="concept">Design Concept</option>
                </select>
              </div>
            </div>

            {/* Virtual & 360 Tour Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-taupe-200">
              <div>
                <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-copper" /> 360° Tour URL
                </label>
                <input
                  type="url"
                  value={formData.tour360Link}
                  onChange={(e) =>
                    setFormData({ ...formData, tour360Link: e.target.value })
                  }
                  placeholder="https://jjarchitects-360-tour-01.netlify.app/"
                  className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-carbon-400 mb-1.5 font-medium flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-copper" /> VR Tour URL
                </label>
                <input
                  type="url"
                  value={formData.vrTourLink}
                  onChange={(e) =>
                    setFormData({ ...formData, vrTourLink: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Toggle & S3 Media (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* FEATURED TOGGLE CARD */}
          <div
            className={`border p-6 transition-all duration-300 ${
              formData.featured
                ? "bg-copper/5 border-copper shadow-md ring-1 ring-copper/20"
                : "bg-white border-taupe-300 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles
                    className={`w-4 h-4 ${
                      formData.featured ? "text-copper" : "text-carbon-300"
                    }`}
                  />
                  <span className="text-xs uppercase tracking-widest font-bold text-copper">
                    Homepage Showcase
                  </span>
                </div>
                <h3 className="text-base font-medium text-carbon">
                  Feature on Homepage Hero
                </h3>
                <p className="text-xs text-carbon-400 mt-1 leading-relaxed">
                  When enabled, this project will be dynamically presented in the
                  interactive hero carousel on the studio homepage.
                </p>
              </div>

              {/* Styled Switch Button */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, featured: !prev.featured }))
                }
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-copper focus:ring-offset-2 ${
                  formData.featured ? "bg-copper" : "bg-zinc-300"
                }`}
                role="switch"
                aria-checked={formData.featured}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.featured ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {formData.featured && (
              <div className="mt-4 pt-3 border-t border-copper/20 flex items-center gap-2 text-xs text-copper font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Active: Shown on Homepage Hero Carousel</span>
              </div>
            )}
          </div>

          {/* THUMBNAIL IMAGE (S3 Storage) */}
          <div className="bg-white border border-taupe-300 p-6 shadow-sm space-y-4">
            <div className="border-b border-taupe-200 pb-3 flex items-center justify-between">
              <h2 className="text-base uppercase tracking-wider font-medium text-carbon flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-copper" />
                Thumbnail Photography <span className="text-copper">*</span>
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-carbon-400 bg-taupe-200 px-2 py-0.5 rounded">
                AWS S3
              </span>
            </div>

            {/* Thumbnail Preview if exists */}
            {formData.thumbnail ? (
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full bg-carbon-800 border border-taupe-300 overflow-hidden group">
                  <Image
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="px-3 py-1.5 bg-rose-600 text-white text-xs uppercase tracking-wider font-medium rounded shadow hover:bg-rose-700 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-[11px] text-carbon-400 truncate font-mono bg-taupe-100 p-2 border border-taupe-200">
                  {formData.thumbnail}
                </div>
              </div>
            ) : (
              /* S3 Upload Box */
              <label className="border-2 border-dashed border-taupe-300 hover:border-copper bg-taupe-100/30 hover:bg-taupe-100/60 p-6 text-center cursor-pointer block transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  disabled={uploadingThumbnail}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-copper/10 text-copper flex items-center justify-center">
                    <Upload
                      className={`w-5 h-5 ${
                        uploadingThumbnail ? "animate-bounce" : ""
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium text-carbon">
                    {uploadingThumbnail
                      ? "Uploading to AWS S3..."
                      : "Upload Thumbnail to AWS S3"}
                  </span>
                  <span className="text-[11px] text-carbon-400">
                    PNG, JPG, WebP up to 20MB
                  </span>
                </div>
              </label>
            )}

            {/* Direct URL entry fallback */}
            <div className="pt-2">
              <label className="block text-[11px] uppercase tracking-wider text-carbon-400 mb-1 font-medium">
                Or paste direct Image URL (e.g. Cloudinary or CDN)
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value.trim() })
                }
                placeholder="https://..."
                className="w-full px-3 py-2 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-xs font-mono"
              />
            </div>
          </div>

          {/* GALLERY IMAGES (S3 Storage) */}
          <div className="bg-white border border-taupe-300 p-6 shadow-sm space-y-4">
            <div className="border-b border-taupe-200 pb-3 flex items-center justify-between">
              <h2 className="text-base uppercase tracking-wider font-medium text-carbon flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-copper" />
                Gallery Photography ({formData.images.length})
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-carbon-400 bg-taupe-200 px-2 py-0.5 rounded">
                AWS S3
              </span>
            </div>

            {/* Existing Gallery Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {formData.images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-carbon-800 border border-taupe-200 group overflow-hidden"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* S3 Multi-file Upload Box */}
            <label className="border-2 border-dashed border-taupe-300 hover:border-copper bg-taupe-100/30 hover:bg-taupe-100/60 p-5 text-center cursor-pointer block transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-copper/10 text-copper flex items-center justify-center">
                  <Upload
                    className={`w-4 h-4 ${
                      uploadingGallery ? "animate-bounce" : ""
                    }`}
                  />
                </div>
                <span className="text-xs font-medium text-carbon">
                  {uploadingGallery
                    ? "Uploading photos to AWS S3..."
                    : "Add Gallery Photos to AWS S3"}
                </span>
                <span className="text-[11px] text-carbon-400">
                  Select multiple files at once
                </span>
              </div>
            </label>

            {/* Add single image by URL */}
            <div className="pt-2">
              <label className="block text-[11px] uppercase tracking-wider text-carbon-400 mb-1 font-medium">
                Add Image via URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="flex-1 px-3 py-2 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-2 bg-carbon text-white hover:bg-copper text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Submit Action Button */}
          <div className="bg-white border border-taupe-300 p-4 shadow-sm flex items-center justify-between">
            <span className="text-xs text-carbon-400">
              {formData.featured
                ? "★ Will be showcased on homepage"
                : "Standard project entry"}
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-copper hover:bg-copper-600 text-white text-xs uppercase tracking-wider font-medium transition-all shadow hover:shadow-md disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>
                {submitting
                  ? "Saving..."
                  : isEdit
                  ? "Update Project"
                  : "Save Project"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
