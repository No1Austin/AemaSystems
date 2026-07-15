import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clipboard,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  Loader2,
  Palette,
  Pencil,
  Save,
  ShieldCheck,
  Upload,
} from "lucide-react";

import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ComplianceHostingStudio() {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id") || "";
  const workspaceIdFromUrl =
    searchParams.get("workspace_id") || "";

  const [workspaceId, setWorkspaceId] =
    useState(workspaceIdFromUrl);
  const [workspace, setWorkspace] =
    useState(null);
  const [documents, setDocuments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [publishing, setPublishing] =
    useState(false);
  const [error, setError] =
    useState("");
  const [message, setMessage] =
    useState("");
  const [copied, setCopied] =
    useState(false);

  const [form, setForm] = useState({
    businessName: "",
    headline:
      "Trust, privacy, and security at our business",
    description:
      "Learn how our business approaches privacy, security, responsible AI, accessibility, and governance.",
    businessWebsite: "",
    contactEmail: "",
    logoUrl: "",
    primaryColor: "#10b981",
    accentColor: "#22d3ee",
    appearance: "dark",
    isPublished: false,
  });

  useEffect(() => {
    initializeStudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, workspaceIdFromUrl]);

  async function initializeStudio() {
    setLoading(true);
    setError("");

    try {
      let resolvedWorkspaceId =
        workspaceIdFromUrl;

      if (sessionId) {
        const verifyResponse = await fetch(
          `${API_URL}/api/compliance/payments/hosting/session/${encodeURIComponent(
            sessionId
          )}`
        );

        const verifyData =
          await readJsonResponse(
            verifyResponse,
            "The hosting verification server returned an invalid response."
          );

        if (
          !verifyResponse.ok ||
          !verifyData.success
        ) {
          throw new Error(
            verifyData.error?.message ||
              verifyData.message ||
              "Unable to verify the hosting subscription."
          );
        }

        resolvedWorkspaceId =
          verifyData.workspaceId || "";

        if (!resolvedWorkspaceId) {
          throw new Error(
            "The hosting subscription was verified, but no workspace was returned."
          );
        }

        setWorkspaceId(
          resolvedWorkspaceId
        );

        rememberWorkspaceId(
          resolvedWorkspaceId
        );
      }

      if (!resolvedWorkspaceId) {
        resolvedWorkspaceId =
          localStorage.getItem(
            "aema_compliance_workspace_id"
          ) || "";
      }

      if (!resolvedWorkspaceId) {
        throw new Error(
          "No compliance workspace reference was found."
        );
      }

      await Promise.all([
        loadWorkspace(
          resolvedWorkspaceId
        ),
        loadDocuments(
          resolvedWorkspaceId
        ),
      ]);
    } catch (initializationError) {
      console.error(
        "Hosting studio initialization failed:",
        initializationError
      );

      setError(
        initializationError?.message ||
          "Unable to open the hosted compliance studio."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadWorkspace(
    targetWorkspaceId
  ) {
    const response = await fetch(
      `${API_URL}/api/compliance/workspace/${encodeURIComponent(
        targetWorkspaceId
      )}`
    );

    const data =
      await readJsonResponse(
        response,
        "The workspace server returned an invalid response."
      );

    if (!response.ok || !data.success) {
      throw new Error(
        data.error?.message ||
          data.message ||
          "Unable to load the compliance workspace."
      );
    }

    const item = data.workspace;

    setWorkspace(item);

    setForm({
      businessName:
        item.business_name || "",
      headline:
        item.headline ||
        "Trust, privacy, and security at our business",
      description:
        item.description ||
        "Learn how our business approaches privacy, security, responsible AI, accessibility, and governance.",
      businessWebsite:
        item.business_website || "",
      contactEmail:
        item.contact_email || "",
      logoUrl:
        item.logo_url || "",
      primaryColor:
        item.primary_color ||
        "#10b981",
      accentColor:
        item.accent_color ||
        "#22d3ee",
      appearance:
        item.appearance || "dark",
      isPublished: Boolean(
        item.is_published
      ),
    });
  }

  async function loadDocuments(
    targetWorkspaceId
  ) {
    const response = await fetch(
      `${API_URL}/api/compliance/workspace/${encodeURIComponent(
        targetWorkspaceId
      )}/documents`
    );

    const data =
      await readJsonResponse(
        response,
        "The document server returned an invalid response."
      );

    if (!response.ok || !data.success) {
      throw new Error(
        data.error?.message ||
          data.message ||
          "Unable to load generated documents."
      );
    }

    setDocuments(
      data.documents || []
    );
  }

  function updateField(
    name,
    value
  ) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveWorkspace({
    publish = false,
  } = {}) {
    if (!workspaceId) return;

    if (publish) {
      setPublishing(true);
    } else {
      setSaving(true);
    }

    setMessage("");

    try {
      const payload = {
        ...form,
        isPublished: publish
          ? true
          : form.isPublished,
      };

      const response = await fetch(
        `${API_URL}/api/compliance/workspace/${encodeURIComponent(
          workspaceId
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await readJsonResponse(
          response,
          "The workspace server returned an invalid response."
        );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "Unable to save the Trust Center."
        );
      }

      setWorkspace(
        data.workspace
      );

      setForm((current) => ({
        ...current,
        isPublished: Boolean(
          data.workspace
            .is_published
        ),
      }));

      setMessage(
        publish
          ? "Your Trust Center is now published."
          : "Your Trust Center changes were saved."
      );
    } catch (saveError) {
      console.error(
        "Trust Center save failed:",
        saveError
      );

      setMessage(
        saveError?.message ||
          "Unable to save the Trust Center."
      );
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  }

  async function updateDocument(
    document,
    updates
  ) {
    try {
      const response = await fetch(
        `${API_URL}/api/compliance/workspace/${encodeURIComponent(
          workspaceId
        )}/documents/${encodeURIComponent(
          document.id
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            updates
          ),
        }
      );

      const data =
        await readJsonResponse(
          response,
          "The document server returned an invalid response."
        );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "Unable to update the document."
        );
      }

      setDocuments((current) =>
        current.map((item) =>
          item.id ===
          data.document.id
            ? {
                ...item,
                ...data.document,
              }
            : item
        )
      );

      return data.document;
    } catch (documentError) {
      console.error(
        "Document update failed:",
        documentError
      );

      setMessage(
        documentError?.message ||
          "Unable to update the document."
      );

      return null;
    }
  }

  async function toggleDocumentPublic(
    document
  ) {
    const nextPublicValue =
      !document.is_public;

    const nextStatus =
      nextPublicValue &&
      document.status !==
        "Approved"
        ? "Approved"
        : document.status;

    await updateDocument(
      document,
      {
        isPublic:
          nextPublicValue,
        status: nextStatus,
      }
    );
  }

  function downloadDocument(
    document
  ) {
    const safeName = String(
      document.title ||
        "compliance-document"
    )
      .trim()
      .replace(
        /[^a-z0-9]+/gi,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )
      .toLowerCase();

    const content = [
      `# ${document.title}`,
      "",
      `Category: ${
        document.category ||
        "Governance"
      }`,
      `Status: ${
        document.status ||
        "Draft"
      }`,
      `Version: ${
        document.version ||
        "1.0"
      }`,
      "",
      document.content || "",
    ].join("\n");

    const blob = new Blob(
      [content],
      {
        type: "text/markdown;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      window.document.createElement(
        "a"
      );

    anchor.href = url;
    anchor.download =
      `${safeName || "document"}.md`;

    window.document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  function downloadAllDocuments() {
    const content = documents
      .map(
        (document) =>
          [
            `# ${document.title}`,
            "",
            `Category: ${
              document.category ||
              "Governance"
            }`,
            `Status: ${
              document.status ||
              "Draft"
            }`,
            `Version: ${
              document.version ||
              "1.0"
            }`,
            "",
            document.content || "",
            "",
            "---",
            "",
          ].join("\n")
      )
      .join("\n");

    const blob = new Blob(
      [content],
      {
        type: "text/markdown;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      window.document.createElement(
        "a"
      );

    anchor.href = url;
    anchor.download =
      `${slugify(
        form.businessName ||
          "compliance-package"
      )}-documents.md`;

    window.document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  const publicUrl =
    useMemo(() => {
      if (!workspace?.slug) {
        return "";
      }

      return `${window.location.origin}/compliance/${workspace.slug}`;
    }, [workspace?.slug]);

  const publicDocumentCount =
    documents.filter(
      (document) =>
        document.is_public
    ).length;

  const approvedDocumentCount =
    documents.filter(
      (document) =>
        document.status ===
        "Approved"
    ).length;

  async function copyPublicUrl() {
    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(
        publicUrl
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-300" />
      </main>
    );
  }

  if (
    error ||
    !workspace
  ) {
    return (
      <main className="min-h-screen bg-[#050816] text-white">
        <Navbar />

        <section className="mx-auto flex min-h-[75vh] max-w-xl items-center px-6 pt-24">
          <div className="w-full rounded-3xl border border-red-500/20 bg-gradient-to-r from-emerald-400 to-cyan-300/10 p-8 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-rose-300" />

            <h1 className="mt-5 text-2xl font-black">
              Hosting studio unavailable
            </h1>

            <p className="mt-3 text-sm leading-7 text-rose-100">
              {error}
            </p>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <section className="mx-auto max-w-[1500px] px-4 pb-20 pt-24 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-cyan-400/15 bg-[#07101b] shadow-[0_40px_140px_rgba(0,0,0,0.55)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_72%)]" />
            <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-emerald-400/[0.07] blur-[110px]" />
            <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-[120px]" />
          </div>

          <div className="relative">
          <header className="flex flex-col gap-5 border-b border-white/10 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                AEMA Hosted Compliance Studio
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Trust Center Dashboard
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                Customize your public compliance page, choose visible documents,
                publish your link, and download your package.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  saveWorkspace()
                }
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white transition hover:bg-white/[0.08] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save changes
              </button>

              <button
                type="button"
                onClick={() =>
                  saveWorkspace({
                    publish: true,
                  })
                }
                disabled={publishing}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-4 py-3 text-xs font-black text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.14)] transition hover:brightness-110 disabled:opacity-60"
              >
                {publishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Globe2 className="h-4 w-4" />
                )}
                Publish page
              </button>
            </div>
          </header>

          <div className="grid lg:grid-cols-[76px_minmax(0,1fr)]">
            <aside className="hidden border-r border-white/10 bg-[#050816]/60 lg:flex lg:flex-col lg:items-center lg:gap-4 lg:py-5">
              {[
                ShieldCheck,
                Palette,
                FileText,
                Globe2,
              ].map(
                (Icon, index) => (
                  <span
                    key={index}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                      index === 0
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.14)]"
                        : "border-white/10 bg-white/[0.03] text-slate-500"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                )
              )}
            </aside>

            <div className="min-w-0">
              <section className="grid gap-px border-b border-white/10 bg-white/10 md:grid-cols-4">
                <StatBlock
                  label="Hosted plan"
                  value="Active"
                  helper="$19.99 CAD/month"
                />

                <StatBlock
                  label="Documents"
                  value={documents.length}
                  helper={`${approvedDocumentCount} approved`}
                />

                <StatBlock
                  label="Public files"
                  value={publicDocumentCount}
                  helper="Visible after publish"
                />

                <StatBlock
                  label="Page status"
                  value={
                    form.isPublished
                      ? "Published"
                      : "Draft"
                  }
                  helper={
                    workspace.slug
                  }
                />
              </section>

              <section className="grid gap-0 xl:grid-cols-[0.86fr_1.14fr]">
                <div className="border-b border-white/10 p-5 xl:border-b-0 xl:border-r">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                        Page identity
                      </p>

                      <h2 className="mt-2 text-xl font-black">
                        Edit your brand
                      </h2>
                    </div>

                    <Pencil className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div className="mt-6 space-y-5">
                    <Field
                      label="Business name"
                      value={
                        form.businessName
                      }
                      onChange={(value) =>
                        updateField(
                          "businessName",
                          value
                        )
                      }
                    />

                    <Field
                      label="Headline"
                      value={
                        form.headline
                      }
                      onChange={(value) =>
                        updateField(
                          "headline",
                          value
                        )
                      }
                    />

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                        Description
                      </span>

                      <textarea
                        value={
                          form.description
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "description",
                            event.target.value
                          )
                        }
                        className="mt-2 min-h-32 w-full rounded-xl border border-white/10 bg-[#050816]/75 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/40"
                      />
                    </label>

                    <Field
                      label="Website"
                      value={
                        form.businessWebsite
                      }
                      onChange={(value) =>
                        updateField(
                          "businessWebsite",
                          value
                        )
                      }
                      placeholder="https://yourbusiness.com"
                    />

                    <Field
                      label="Contact email"
                      value={
                        form.contactEmail
                      }
                      onChange={(value) =>
                        updateField(
                          "contactEmail",
                          value
                        )
                      }
                    />

                    <Field
                      label="Logo URL"
                      value={
                        form.logoUrl
                      }
                      onChange={(value) =>
                        updateField(
                          "logoUrl",
                          value
                        )
                      }
                      placeholder="https://..."
                      icon={Upload}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <ColorField
                        label="Primary colour"
                        value={
                          form.primaryColor
                        }
                        onChange={(
                          value
                        ) =>
                          updateField(
                            "primaryColor",
                            value
                          )
                        }
                      />

                      <ColorField
                        label="Accent colour"
                        value={
                          form.accentColor
                        }
                        onChange={(
                          value
                        ) =>
                          updateField(
                            "accentColor",
                            value
                          )
                        }
                      />
                    </div>

                    {message && (
                      <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-300">
                        {message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                        Live public preview
                      </p>

                      <h2 className="mt-2 text-xl font-black">
                        Your public page
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={
                          copyPublicUrl
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
                      >
                        <Clipboard className="h-4 w-4" />
                        {copied
                          ? "Copied"
                          : "Copy link"}
                      </button>

                      <a
                        href={
                          publicUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open page
                      </a>
                    </div>
                  </div>

                  <div
                    className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 p-6 sm:p-8"
                    style={{
                      background: `linear-gradient(145deg, ${form.primaryColor}24, ${form.accentColor}10, rgba(7,16,27,1))`,
                    }}
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-2xl">
                        {form.logoUrl ? (
                          <img
                            src={
                              form.logoUrl
                            }
                            alt=""
                            className="h-16 w-16 rounded-2xl object-cover"
                          />
                        ) : (
                          <span
                            className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black"
                            style={{
                              backgroundColor: `${form.primaryColor}30`,
                              border: `1px solid ${form.primaryColor}60`,
                            }}
                          >
                            {String(
                              form.businessName ||
                                "B"
                            )
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        )}

                        <p
                          className="mt-6 text-xs font-bold uppercase tracking-[0.18em]"
                          style={{
                            color:
                              form.accentColor,
                          }}
                        >
                          {
                            form.businessName
                          }
                        </p>

                        <h3 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                          {form.headline}
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-slate-400">
                          {
                            form.description
                          }
                        </p>
                      </div>

                      <span
                        className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em]"
                        style={{
                          borderColor: `${form.primaryColor}55`,
                          backgroundColor: `${form.primaryColor}18`,
                          color:
                            form.primaryColor,
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Verified workspace
                      </span>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {documents
                        .filter(
                          (document) =>
                            document.is_public
                        )
                        .slice(0, 6)
                        .map(
                          (document) => (
                            <article
                              key={
                                document.id
                              }
                              className="rounded-2xl border border-white/10 bg-black/25 p-4"
                            >
                              <FileText
                                className="h-5 w-5"
                                style={{
                                  color:
                                    form.primaryColor,
                                }}
                              />

                              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                {document.category ||
                                  "Governance"}
                              </p>

                              <h4 className="mt-1 text-sm font-black">
                                {
                                  document.title
                                }
                              </h4>
                            </article>
                          )
                        )}
                    </div>

                    {publicDocumentCount ===
                      0 && (
                      <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-6 text-center">
                        <Eye className="mx-auto h-6 w-6 text-slate-600" />

                        <p className="mt-3 text-sm font-bold text-slate-400">
                          No public documents selected yet
                        </p>

                        <p className="mt-2 text-xs leading-6 text-slate-600">
                          Use the table below to choose the documents visitors will see.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-[#050816]/75 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                      Public URL
                    </p>

                    <p className="mt-2 break-all text-xs font-semibold text-white">
                      {publicUrl}
                    </p>
                  </div>
                </div>
              </section>

              <section className="border-t border-white/10 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      Documents
                    </p>

                    <h2 className="mt-2 text-xl font-black">
                      Publish and download files
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={
                      downloadAllDocuments
                    }
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white transition hover:bg-white/[0.08]"
                  >
                    <Download className="h-4 w-4" />
                    Download all documents
                  </button>
                </div>

                <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
                  <table className="min-w-full border-collapse text-left">
                    <thead className="bg-white/[0.03]">
                      <tr className="text-[10px] uppercase tracking-[0.14em] text-slate-600">
                        <th className="px-4 py-4">
                          Document
                        </th>

                        <th className="px-4 py-4">
                          Category
                        </th>

                        <th className="px-4 py-4">
                          Status
                        </th>

                        <th className="px-4 py-4">
                          Public
                        </th>

                        <th className="px-4 py-4 text-right">
                          Download
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {documents.map(
                        (document) => (
                          <tr
                            key={
                              document.id
                            }
                            className="border-t border-white/10 text-sm"
                          >
                            <td className="px-4 py-4 font-bold text-white">
                              {
                                document.title
                              }
                            </td>

                            <td className="px-4 py-4 text-xs text-slate-500">
                              {document.category ||
                                "Governance"}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                                  document.status ===
                                  "Approved"
                                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                    : "border-white/10 bg-white/[0.04] text-slate-500"
                                }`}
                              >
                                {document.status ||
                                  "Draft"}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDocumentPublic(
                                    document
                                  )
                                }
                                className={`relative h-6 w-11 rounded-full transition ${
                                  document.is_public
                                    ? "bg-gradient-to-r from-emerald-400 to-cyan-300"
                                    : "bg-white/10"
                                }`}
                              >
                                <span
                                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                    document.is_public
                                      ? "left-6"
                                      : "left-1"
                                  }`}
                                />
                              </button>
                            </td>

                            <td className="px-4 py-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  downloadDocument(
                                    document
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StatBlock({
  label,
  value,
  helper,
}) {
  return (
    <article className="bg-[#07101b] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {helper}
      </p>
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  icon: Icon,
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </span>

      <div className="relative mt-2">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
        )}

        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          className={`w-full rounded-xl border border-white/10 bg-[#050816]/75 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-400/40 ${
            Icon
              ? "pl-11 pr-4"
              : "px-4"
          }`}
        />
      </div>
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </span>

      <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-[#050816]/75 p-3">
        <input
          type="color"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="h-10 w-12 rounded border-0 bg-transparent"
        />

        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
        />
      </div>
    </label>
  );
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

async function readJsonResponse(
  response,
  fallbackMessage
) {
  try {
    return await response.json();
  } catch {
    throw new Error(
      fallbackMessage
    );
  }
}

function rememberWorkspaceId(id) {
  try {
    localStorage.setItem(
      "aema_compliance_workspace_id",
      id
    );
  } catch {
    // Browser storage may be unavailable.
  }
}
