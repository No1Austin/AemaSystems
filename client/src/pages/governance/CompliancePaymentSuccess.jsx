import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Clock3,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  FileCheck2,
  FileText,
  Fingerprint,
  Globe2,
  Loader2,
  LockKeyhole,
  RefreshCcw,
  Save,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";

import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const STORAGE_KEYS = {
  assessmentId: "aema_compliance_assessment_id",
  workspaceId: "aema_compliance_workspace_id",
  paymentStatus: "aema_compliance_payment_status",
  answers: "aema_compliance_completed_answers",
  result: "aema_compliance_evaluation_result",
};

const MAX_AUTOMATIC_CHECKS = 10;
const CHECK_INTERVAL_MS = 3000;

export default function CompliancePaymentSuccess() {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const assessmentIdFromUrl =
    searchParams.get("assessment_id");

  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState(
    "Confirming your payment with Stripe..."
  );

  const [assessmentId, setAssessmentId] = useState(
    assessmentIdFromUrl || ""
  );

  const [workspaceId, setWorkspaceId] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [documentsGenerated, setDocumentsGenerated] =
    useState(false);
  const [paymentStatus, setPaymentStatus] =
    useState("pending");
  const [checking, setChecking] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] =
    useState(false);
  const [documentsError, setDocumentsError] =
    useState("");

  const [selectedDocument, setSelectedDocument] =
    useState(null);
  const [selectedDocumentContent, setSelectedDocumentContent] =
    useState("");
  const [documentLoading, setDocumentLoading] =
    useState(false);
  const [documentSaving, setDocumentSaving] =
    useState(false);
  const [documentMessage, setDocumentMessage] =
    useState("");

  const [startingHosting, setStartingHosting] =
    useState(false);
  const [hostingMessage, setHostingMessage] =
    useState("");

  const checkCountRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (assessmentIdFromUrl) {
      rememberAssessmentId(assessmentIdFromUrl);
    }

    if (!sessionId && !assessmentIdFromUrl) {
      setStatus("error");
      setMessage(
        "No Stripe session or assessment reference was provided."
      );

      return undefined;
    }

    verifyPayment();

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, assessmentIdFromUrl]);

  useEffect(() => {
    if (
      documentsGenerated &&
      workspaceId
    ) {
      loadDocuments(workspaceId);
    }
  }, [documentsGenerated, workspaceId]);

  async function verifyPayment({
    manual = false,
  } = {}) {
    if (checking) return;

    setChecking(true);

    if (manual) {
      setStatus("checking");
      setMessage(
        "Checking the latest payment and document status..."
      );
    }

    try {
      if (!sessionId) {
        if (assessmentIdFromUrl) {
          setAssessmentId(
            assessmentIdFromUrl
          );
          rememberAssessmentId(
            assessmentIdFromUrl
          );

          setStatus("success");
          setPaymentStatus("paid");
          rememberPaymentStatus("paid");
          setMessage(
            "This assessment has already been paid. Your compliance package is available."
          );

          await resolveWorkspaceFromAssessment(
            assessmentIdFromUrl
          );

          return;
        }

        throw new Error(
          "The Stripe session ID is missing."
        );
      }

      const response = await fetch(
        `${API_URL}/api/compliance/payments/session/${encodeURIComponent(
          sessionId
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await readJsonResponse(
        response,
        "The payment verification server returned an invalid response."
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "Unable to verify the Stripe payment."
        );
      }

      const resolvedAssessmentId =
        data.assessmentId ||
        assessmentIdFromUrl ||
        "";

      if (resolvedAssessmentId) {
        setAssessmentId(
          resolvedAssessmentId
        );
        rememberAssessmentId(
          resolvedAssessmentId
        );
      }

      let resolvedWorkspaceId =
        data.workspaceId || "";

      let resolvedWorkspaceSlug =
        data.workspaceSlug || "";

      if (
        !resolvedWorkspaceId &&
        resolvedAssessmentId &&
        data.paid
      ) {
        const resolvedWorkspace =
          await resolveWorkspaceFromAssessment(
            resolvedAssessmentId,
            {
              silent: true,
            }
          );

        resolvedWorkspaceId =
          resolvedWorkspace?.id || "";

        resolvedWorkspaceSlug =
          resolvedWorkspace?.slug || "";
      }

      if (resolvedWorkspaceId) {
        setWorkspaceId(
          resolvedWorkspaceId
        );
        rememberWorkspaceId(
          resolvedWorkspaceId
        );
      }

      if (resolvedWorkspaceSlug) {
        setWorkspaceSlug(
          resolvedWorkspaceSlug
        );
      }

      setCustomerEmail(
        data.customerEmail || ""
      );

      const resolvedPaymentStatus =
        data.paymentStatus ||
        data.stripePaymentStatus ||
        "pending";

      setPaymentStatus(
        resolvedPaymentStatus
      );

      rememberPaymentStatus(
        resolvedPaymentStatus
      );

      setDocumentsGenerated(
        Boolean(data.documentsGenerated)
      );

      if (data.paid) {
        clearCompletedAssessmentDraft();

        if (data.documentsGenerated) {
          setStatus("success");
          setMessage(
            "Payment confirmed. Your personalized compliance package has been generated successfully."
          );
        } else {
          setStatus("processing");
          setMessage(
            "Payment confirmed. Your compliance documents are now being generated."
          );

          scheduleAnotherCheck();
        }

        return;
      }

      const normalizedPaymentStatus = String(
        resolvedPaymentStatus
      ).toLowerCase();

      if (
        normalizedPaymentStatus === "failed" ||
        normalizedPaymentStatus === "unpaid"
      ) {
        setStatus("error");
        setMessage(
          "The payment has not been completed. You can return to the assessment and try again."
        );

        return;
      }

      setStatus("processing");
      setMessage(
        "Stripe is still confirming the payment. This normally takes only a few moments."
      );

      scheduleAnotherCheck();
    } catch (error) {
      console.error(
        "Compliance payment verification failed:",
        error
      );

      setStatus("error");
      setMessage(
        error?.message ||
          "Unable to confirm the payment right now."
      );
    } finally {
      setChecking(false);
    }
  }

  async function resolveWorkspaceFromAssessment(
    targetAssessmentId,
    { silent = false } = {}
  ) {
    try {
      const response = await fetch(
        `${API_URL}/api/compliance/workspace/by-assessment/${encodeURIComponent(
          targetAssessmentId
        )}`
      );

      const data = await readJsonResponse(
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

      const workspace =
        data.workspace || null;

      if (workspace?.id) {
        setWorkspaceId(workspace.id);
        rememberWorkspaceId(
          workspace.id
        );
      }

      if (workspace?.slug) {
        setWorkspaceSlug(
          workspace.slug
        );
      }

      if (
        data.assessment
          ?.documents_generated
      ) {
        setDocumentsGenerated(true);
      }

      return workspace;
    } catch (error) {
      if (!silent) {
        console.error(
          "Workspace resolution failed:",
          error
        );

        setMessage(
          error?.message ||
            "Unable to connect your workspace."
        );
      }

      return null;
    }
  }

  async function loadDocuments(
    targetWorkspaceId
  ) {
    if (!targetWorkspaceId) return;

    setDocumentsLoading(true);
    setDocumentsError("");

    try {
      const response = await fetch(
        `${API_URL}/api/compliance/workspace/${encodeURIComponent(
          targetWorkspaceId
        )}/documents`
      );

      const data = await readJsonResponse(
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
    } catch (error) {
      console.error(
        "Generated document list failed:",
        error
      );

      setDocumentsError(
        error?.message ||
          "Unable to load generated documents."
      );
    } finally {
      setDocumentsLoading(false);
    }
  }

  async function openDocument(document) {
    if (!workspaceId || !document?.slug) {
      return;
    }

    setSelectedDocument(document);
    setSelectedDocumentContent("");
    setDocumentMessage("");
    setDocumentLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/compliance/workspace/${encodeURIComponent(
          workspaceId
        )}/documents/${encodeURIComponent(
          document.slug
        )}`
      );

      const data = await readJsonResponse(
        response,
        "The document server returned an invalid response."
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "Unable to open this document."
        );
      }

      setSelectedDocument(
        data.document
      );

      setSelectedDocumentContent(
        data.document?.content || ""
      );
    } catch (error) {
      console.error(
        "Generated document failed to open:",
        error
      );

      setDocumentMessage(
        error?.message ||
          "Unable to open this document."
      );
    } finally {
      setDocumentLoading(false);
    }
  }

  async function saveSelectedDocument(
    nextStatus
  ) {
    if (
      !workspaceId ||
      !selectedDocument?.id
    ) {
      return;
    }

    setDocumentSaving(true);
    setDocumentMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/compliance/workspace/${encodeURIComponent(
          workspaceId
        )}/documents/${encodeURIComponent(
          selectedDocument.id
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            content:
              selectedDocumentContent,
            status:
              nextStatus ||
              selectedDocument.status ||
              "Draft",
          }),
        }
      );

      const data = await readJsonResponse(
        response,
        "The document server returned an invalid response."
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "Unable to save this document."
        );
      }

      setSelectedDocument(
        data.document
      );

      setSelectedDocumentContent(
        data.document?.content || ""
      );

      setDocuments((current) =>
        current.map((item) =>
          item.id === data.document.id
            ? {
                ...item,
                status:
                  data.document.status,
                updated_at:
                  data.document.updated_at,
              }
            : item
        )
      );

      setDocumentMessage(
        nextStatus === "Approved"
          ? "Document approved successfully."
          : "Document saved successfully."
      );
    } catch (error) {
      console.error(
        "Generated document save failed:",
        error
      );

      setDocumentMessage(
        error?.message ||
          "Unable to save this document."
      );
    } finally {
      setDocumentSaving(false);
    }
  }

  async function copySelectedDocument() {
    try {
      await navigator.clipboard.writeText(
        selectedDocumentContent
      );

      setDocumentMessage(
        "Document copied to your clipboard."
      );
    } catch {
      setDocumentMessage(
        "Your browser could not copy the document."
      );
    }
  }

  async function startHostingCheckout() {
    if (!workspaceId) {
      setHostingMessage(
        "Your compliance workspace is not available yet. Refresh the package status and try again."
      );

      return;
    }

    if (!documentsGenerated) {
      setHostingMessage(
        "Your documents are still being prepared. Hosting becomes available after generation finishes."
      );

      return;
    }

    setStartingHosting(true);
    setHostingMessage("");

    try {
      const response = await fetch(
  `${API_URL}/api/compliance/hosting/create-checkout-session`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assessmentId,
      workspaceId,
      customerEmail,
    }),
  }
);

      const data = await readJsonResponse(
        response,
        "The hosting checkout server returned an invalid response."
      );

      if (
        !response.ok ||
        !data.success ||
        !data.url
      ) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "Unable to open hosting checkout."
        );
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error(
        "Compliance hosting checkout failed:",
        error
      );

      setHostingMessage(
        error?.message ||
          "Unable to start the hosting subscription right now."
      );
    } finally {
      setStartingHosting(false);
    }
  }

  function scheduleAnotherCheck() {
    if (
      checkCountRef.current >=
      MAX_AUTOMATIC_CHECKS
    ) {
      setStatus("processing");
      setMessage(
        "Payment was received, but document preparation is taking longer than expected. Use the refresh button below to check again."
      );

      return;
    }

    checkCountRef.current += 1;

    if (timerRef.current) {
      window.clearTimeout(
        timerRef.current
      );
    }

    timerRef.current =
      window.setTimeout(
        () => verifyPayment(),
        CHECK_INTERVAL_MS
      );
  }

  const progress =
    getProcessingProgress({
      status,
      paymentStatus,
      documentsGenerated,
      checkCount:
        checkCountRef.current,
    });

  const pageConfig =
    getPageConfig(status);

  const publicUrl = useMemo(() => {
    if (!workspaceSlug) return "";

    return `${window.location.origin}/compliance/${workspaceSlug}`;
  }, [workspaceSlug]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.42)_1px,transparent_1px)] [background-size:46px_46px]" />
        <div className="absolute left-[4%] top-0 h-[520px] w-[520px] rounded-full bg-emerald-400/[0.07] blur-[145px]" />
        <div className="absolute right-[2%] top-[12%] h-[620px] w-[620px] rounded-full bg-cyan-400/[0.08] blur-[155px]" />
      </div>

      <Navbar />

      <section className="relative px-5 pb-20 pt-28 sm:px-6 lg:pt-32">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <SelfContainedSidebar
            status={status}
            documentsGenerated={
              documentsGenerated
            }
            documents={documents}
            documentsLoading={
              documentsLoading
            }
            documentsError={
              documentsError
            }
            selectedDocument={
              selectedDocument
            }
            onOpenDocument={
              openDocument
            }
            workspaceId={workspaceId}
            workspaceSlug={
              workspaceSlug
            }
            publicUrl={publicUrl}
            startingHosting={
              startingHosting
            }
            hostingMessage={
              hostingMessage
            }
            onStartHosting={
              startHostingCheckout
            }
          />

          <div className="min-w-0">
            <header className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                <Fingerprint className="h-3.5 w-3.5" />
                Secure payment workflow
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                {pageConfig.title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                {pageConfig.description}
              </p>
            </header>

            <section className="relative overflow-hidden rounded-[2.25rem] border border-cyan-400/15 bg-[#07101b] shadow-[0_35px_120px_rgba(0,0,0,0.50)]">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.20),transparent_68%)]" />
                <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-400/[0.08] blur-[100px]" />
                <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/[0.09] blur-[110px]" />
              </div>

              <div className="relative grid xl:grid-cols-[1.06fr_0.94fr]">
                <div className="border-b border-white/10 bg-white/[0.012] p-6 sm:p-8 xl:border-b-0 xl:border-r xl:p-10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                      <LockKeyhole className="h-3.5 w-3.5" />
                      Encrypted verification
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] text-slate-500">
                      AEMA-PROCESS
                    </span>
                  </div>

                  <div className="mt-8 flex flex-col items-center text-center sm:items-start sm:text-left">
                    <StatusIcon
                      status={status}
                      checking={checking}
                    />

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
                      {pageConfig.kicker}
                    </p>

                    <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl xl:text-[2.75rem] xl:leading-[1.05]">
                      {pageConfig.heading}
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                      {message}
                    </p>
                  </div>

                  <ProcessingProgress
                    progress={progress}
                    status={status}
                    paymentStatus={
                      paymentStatus
                    }
                    documentsGenerated={
                      documentsGenerated
                    }
                  />

                  <ActionButtons
                    status={status}
                    checking={checking}
                    documentsGenerated={
                      documentsGenerated
                    }
                    assessmentId={
                      assessmentId
                    }
                    onRefresh={() =>
                      verifyPayment({
                        manual: true,
                      })
                    }
                  />
                </div>

                <aside className="bg-black/10 p-6 sm:p-8 xl:p-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Live processing details
                  </p>

                  <h2 className="mt-2 text-xl font-black text-white">
                    What is happening now
                  </h2>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    The system verifies your transaction, connects it to your
                    assessment, and prepares your personalized compliance files.
                  </p>

                  <ProcessingTimeline
                    status={status}
                    paymentStatus={
                      paymentStatus
                    }
                    documentsGenerated={
                      documentsGenerated
                    }
                  />

                  <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    <StatusCard
                      label="Payment"
                      value={formatStatus(
                        paymentStatus
                      )}
                      icon={ShieldCheck}
                      active={
                        paymentStatus ===
                          "paid" ||
                        status ===
                          "success" ||
                        status ===
                          "processing"
                      }
                    />

                    <StatusCard
                      label="Documents"
                      value={
                        documentsGenerated
                          ? "Generated"
                          : status ===
                              "processing"
                            ? "Preparing"
                            : "Pending"
                      }
                      icon={FileText}
                      active={
                        documentsGenerated
                      }
                    />

                    <StatusCard
                      label="Assessment"
                      value={
                        assessmentId
                          ? "Connected"
                          : "Pending"
                      }
                      icon={CheckCircle2}
                      active={Boolean(
                        assessmentId
                      )}
                    />
                  </div>

                  {assessmentId && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Database className="h-3.5 w-3.5 text-cyan-300" />

                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Assessment reference
                        </p>
                      </div>

                      <p className="mt-2 break-all font-mono text-[11px] leading-5 text-slate-300">
                        {assessmentId}
                      </p>
                    </div>
                  )}
                </aside>
              </div>
            </section>

            <section className="relative mt-5 overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/[0.08] via-emerald-400/[0.04] to-cyan-400/[0.06] px-5 py-4">
              <div className="relative flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                <div>
                  <p className="text-xs font-bold text-cyan-100">
                    You may safely leave this page
                  </p>

                  <p className="mt-1 text-xs leading-6 text-slate-400">
                    Payment confirmation and document generation continue securely
                    on the server. Closing this page will not cancel a completed
                    payment or stop your package from being prepared.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />

      <DocumentDrawer
        document={selectedDocument}
        content={
          selectedDocumentContent
        }
        loading={documentLoading}
        saving={documentSaving}
        message={documentMessage}
        onContentChange={
          setSelectedDocumentContent
        }
        onClose={() => {
          setSelectedDocument(null);
          setSelectedDocumentContent("");
          setDocumentMessage("");
        }}
        onCopy={
          copySelectedDocument
        }
        onSave={() =>
          saveSelectedDocument()
        }
        onApprove={() =>
          saveSelectedDocument(
            "Approved"
          )
        }
      />
    </main>
  );
}

function SelfContainedSidebar({
  status,
  documentsGenerated,
  documents,
  documentsLoading,
  documentsError,
  selectedDocument,
  onOpenDocument,
  workspaceId,
  workspaceSlug,
  publicUrl,
  startingHosting,
  hostingMessage,
  onStartHosting,
}) {
  return (
    <aside className="relative self-start overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-[#07101b] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.42)] lg:sticky lg:top-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.18),transparent_72%)]" />
        <div className="absolute -left-16 top-28 h-48 w-48 rounded-full bg-emerald-400/[0.09] blur-3xl" />
        <div className="absolute -right-20 bottom-24 h-56 w-56 rounded-full bg-cyan-400/[0.08] blur-3xl" />
      </div>

      <div className="relative space-y-5">
        <section className="rounded-[1.5rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.11] via-cyan-400/[0.05] to-white/[0.025] p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                Payment workspace
              </p>

              <h2 className="mt-1 text-sm font-black text-white">
                AEMA Compliance OS
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Your files open directly on this page.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-cyan-400/15 bg-white/[0.025] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Generated documents
              </p>

              <h3 className="mt-1 text-sm font-black text-white">
                Your compliance files
              </h3>
            </div>

            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
              {documents.length}
            </span>
          </div>

          {documentsLoading ? (
            <div className="flex min-h-32 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
            </div>
          ) : documentsError ? (
            <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-3 text-[10px] leading-5 text-rose-100">
              {documentsError}
            </p>
          ) : documentsGenerated &&
            documents.length > 0 ? (
            <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {documents.map((document) => {
                const active =
                  selectedDocument?.id ===
                  document.id;

                return (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() =>
                      onOpenDocument(
                        document
                      )
                    }
                    className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left text-xs transition ${
                      active
                        ? "border-cyan-400/25 bg-cyan-400/[0.08] text-white"
                        : "border-white/[0.07] bg-black/15 text-slate-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-white"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#09111d]">
                      <FileText className="h-4 w-4 text-cyan-300" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        {document.title}
                      </span>

                      <span className="mt-0.5 block text-[9px] uppercase tracking-[0.12em] text-slate-600">
                        {document.status ||
                          "Draft"}
                      </span>
                    </span>

                    <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-[11px] leading-5 text-slate-500">
              {status === "success"
                ? "Your generated files are being connected to this page."
                : "Your files will appear here automatically after payment verification."}
            </p>
          )}
        </section>

        <section className="rounded-[1.5rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.10] via-cyan-400/[0.05] to-white/[0.02] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
              <Globe2 className="h-5 w-5 text-emerald-300" />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                Host your compliance
              </p>

              <h3 className="mt-1 text-sm font-black text-white">
                Publish your Trust Center
              </h3>

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Add branding, choose public policies, and create your shareable compliance link.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                  First month free
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  Billing begins after the free period.
                </p>
              </div>

              <span className="text-right">
                <strong className="block text-xl font-black text-white">
                  $19.99
                </strong>

                <span className="text-[9px] text-slate-500">
                  CAD / month
                </span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartHosting}
            disabled={
              startingHosting ||
              !documentsGenerated ||
              !workspaceId
            }
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-4 py-3 text-xs font-black text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {startingHosting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening checkout...
              </>
            ) : (
              <>
                <Globe2 className="h-4 w-4" />
                Host my compliance
              </>
            )}
          </button>

          {publicUrl && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              Preview public link
            </a>
          )}

          {hostingMessage && (
            <p className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-[10px] leading-5 text-rose-100">
              {hostingMessage}
            </p>
          )}

          {workspaceSlug && (
            <p className="mt-3 break-all text-center text-[9px] leading-4 text-slate-600">
              Workspace: {workspaceSlug}
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}

function DocumentDrawer({
  document,
  content,
  loading,
  saving,
  message,
  onContentChange,
  onClose,
  onCopy,
  onSave,
  onApprove,
}) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close document"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="relative z-10 flex h-full w-full max-w-4xl flex-col border-l border-white/10 bg-[#07101b] shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
              {document.category ||
                "Governance"}
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              {document.title}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Version{" "}
              {document.version ||
                "1.0"}{" "}
              ·{" "}
              {document.status ||
                "Draft"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white transition hover:bg-white/[0.08]"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-xs font-bold text-cyan-200 transition hover:bg-cyan-400/15 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>

            <button
              type="button"
              onClick={onApprove}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              Approve
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
            </div>
          ) : (
            <>
              <textarea
                value={content}
                onChange={(event) =>
                  onContentChange(
                    event.target.value
                  )
                }
                className="min-h-[720px] w-full resize-y rounded-2xl border border-white/10 bg-[#050816] p-5 font-mono text-sm leading-7 text-slate-200 outline-none transition focus:border-cyan-400/40"
              />

              {message && (
                <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-slate-300">
                  {message}
                </p>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function StatusIcon({
  status,
  checking,
}) {
  const isLoading =
    checking ||
    status === "checking";

  const classes =
    status === "success"
      ? "border-emerald-400/25 bg-emerald-400/10 shadow-[0_0_55px_rgba(52,211,153,0.18)]"
      : status === "processing"
        ? "border-amber-400/25 bg-amber-400/10 shadow-[0_0_55px_rgba(251,191,36,0.14)]"
        : status === "error"
          ? "border-rose-400/25 bg-rose-400/10 shadow-[0_0_55px_rgba(251,113,133,0.14)]"
          : "border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_55px_rgba(34,211,238,0.18)]";

  return (
    <div className="relative">
      {(isLoading ||
        status === "processing") && (
        <>
          <span className="absolute inset-[-8px] animate-ping rounded-[2rem] border border-cyan-400/15" />
          <span className="absolute inset-[-16px] rounded-[2.3rem] border border-white/[0.04]" />
        </>
      )}

      <span
        className={`relative flex h-20 w-20 items-center justify-center rounded-[1.75rem] border ${classes}`}
      >
        {isLoading ? (
          <Loader2 className="h-9 w-9 animate-spin text-cyan-300" />
        ) : status === "success" ? (
          <CheckCircle2 className="h-10 w-10 text-emerald-300" />
        ) : status ===
          "processing" ? (
          <Cpu className="h-10 w-10 animate-pulse text-amber-300" />
        ) : (
          <AlertTriangle className="h-10 w-10 text-rose-300" />
        )}
      </span>
    </div>
  );
}

function ProcessingProgress({
  progress,
  status,
  paymentStatus,
  documentsGenerated,
}) {
  const caption =
    status === "success"
      ? "Processing complete"
      : status === "error"
        ? "Verification paused"
        : documentsGenerated
          ? "Finalizing workspace"
          : paymentStatus === "paid"
            ? "Generating compliance documents"
            : "Confirming payment with Stripe";

  return (
    <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-black/25 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            System progress
          </p>

          <p className="mt-1 text-sm font-bold text-white">
            {caption}
          </p>
        </div>

        <span className="font-mono text-sm font-black text-cyan-300">
          {progress}%
        </span>
      </div>

      <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            status === "error"
              ? "bg-gradient-to-r from-rose-400 to-orange-300"
              : status === "success"
                ? "bg-gradient-to-r from-emerald-400 to-cyan-300"
                : "bg-gradient-to-r from-cyan-400 via-emerald-300 to-cyan-400"
          }`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-600">
        <span>Verification</span>
        <span>Generation</span>
        <span>Ready</span>
      </div>
    </div>
  );
}

function ProcessingTimeline({
  status,
  paymentStatus,
  documentsGenerated,
}) {
  const paid =
    paymentStatus === "paid" ||
    status === "processing" ||
    status === "success";

  const steps = [
    {
      title:
        "Secure payment received",
      description:
        "Stripe verifies the transaction and confirms its final status.",
      icon: ShieldCheck,
      state:
        status === "error" &&
        !paid
          ? "error"
          : paid
            ? "complete"
            : "active",
    },
    {
      title:
        "Assessment connected",
      description:
        "Your payment is matched with the submitted business assessment.",
      icon: Database,
      state:
        paid ||
        status === "success"
          ? "complete"
          : status === "error"
            ? "pending"
            : "active",
    },
    {
      title:
        "Documents being prepared",
      description:
        "Compliance OS builds your personalized policies and readiness package.",
      icon: WandSparkles,
      state:
        documentsGenerated
          ? "complete"
          : paid &&
              status !== "error"
            ? "active"
            : "pending",
    },
    {
      title:
        "Workspace activated",
      description:
        "Your generated files become available directly on this page.",
      icon: FileCheck2,
      state:
        documentsGenerated
          ? "complete"
          : "pending",
    },
  ];

  return (
    <div className="relative mt-6">
      <div className="absolute bottom-5 left-[17px] top-5 w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-transparent" />

      <div className="space-y-3">
        {steps.map(
          (step, index) => {
            const Icon =
              step.icon;

            return (
              <div
                key={step.title}
                className="relative flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <span
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                    step.state ===
                    "complete"
                      ? "border-emerald-400/25 bg-emerald-400/10"
                      : step.state ===
                          "active"
                        ? "border-cyan-400/25 bg-cyan-400/10"
                        : step.state ===
                            "error"
                          ? "border-rose-400/25 bg-rose-400/10"
                          : "border-white/10 bg-[#080d16]"
                  }`}
                >
                  {step.state ===
                  "complete" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  ) : step.state ===
                    "active" ? (
                    <Icon className="h-4 w-4 animate-pulse text-cyan-300" />
                  ) : step.state ===
                    "error" ? (
                    <AlertTriangle className="h-4 w-4 text-rose-300" />
                  ) : (
                    <span className="font-mono text-[10px] text-slate-600">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>
                  )}
                </span>

                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    {
                      step.description
                    }
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

function StatusCard({
  label,
  value,
  icon: Icon,
  active = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active
          ? "border-emerald-400/15 bg-emerald-400/[0.045]"
          : "border-white/10 bg-black/20"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
            active
              ? "border-emerald-400/20 bg-emerald-400/10"
              : "border-white/10 bg-white/[0.04]"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${
              active
                ? "text-emerald-300"
                : "text-slate-500"
            }`}
          />
        </span>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-sm font-bold text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButtons({
  status,
  checking,
  documentsGenerated,
  assessmentId,
  onRefresh,
}) {
  const refreshLabel =
    status === "success" &&
    documentsGenerated
      ? "Refresh package status"
      : status ===
            "processing" ||
          status === "checking"
        ? "Check again"
        : "Try verification again";

  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onRefresh}
        disabled={checking}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {checking ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}

        {refreshLabel}
      </button>

      <Link
        to={
          status === "error"
            ? "/compliance-os/assessment"
            : assessmentId
              ? `/compliance-dashboard?assessment_id=${encodeURIComponent(
                  assessmentId
                )}`
              : "/compliance-os"
        }
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
      >
        {status === "error"
          ? "Return to assessment"
          : documentsGenerated
            ? "Open Compliance Dashboard"
            : "Return to Compliance OS"}

        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function getPageConfig(status) {
  if (status === "success") {
    return {
      title: "Package Ready",
      heading:
        "Your compliance workspace is ready",
      kicker:
        "Processing complete",
      description:
        "Payment was confirmed and your personalized Compliance OS package has been prepared.",
    };
  }

  if (
    status === "processing" ||
    status === "checking"
  ) {
    return {
      title:
        "Preparing Your Package",
      heading:
        "We are building your compliance workspace",
      kicker:
        "Intelligent processing active",
      description:
        "Compliance OS is securely verifying your payment and preparing your personalized documents.",
    };
  }

  return {
    title:
      "Payment Verification",
    heading:
      "Payment verification needs attention",
    kicker:
      "Verification paused",
    description:
      "The system could not complete verification. Review the message and try the secure check again.",
  };
}

function getProcessingProgress({
  status,
  paymentStatus,
  documentsGenerated,
  checkCount,
}) {
  if (
    status === "success" &&
    documentsGenerated
  ) {
    return 100;
  }

  if (status === "error") {
    return Math.max(
      12,
      Math.min(
        72,
        18 + checkCount * 5
      )
    );
  }

  if (documentsGenerated) {
    return 96;
  }

  const normalizedPaymentStatus =
    String(
      paymentStatus || ""
    ).toLowerCase();

  if (
    normalizedPaymentStatus ===
      "paid" ||
    status === "processing"
  ) {
    return Math.min(
      92,
      62 + checkCount * 3
    );
  }

  return Math.min(
    58,
    18 + checkCount * 4
  );
}

function formatStatus(value) {
  const normalized = String(
    value || "pending"
  )
    .replace(/[_-]+/g, " ")
    .trim();

  return normalized.replace(
    /\b\w/g,
    (letter) =>
      letter.toUpperCase()
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

function rememberAssessmentId(id) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.assessmentId,
      id
    );
  } catch {
    // Browser storage may be unavailable.
  }
}

function rememberWorkspaceId(id) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.workspaceId,
      id
    );
  } catch {
    // Browser storage may be unavailable.
  }
}

function rememberPaymentStatus(value) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.paymentStatus,
      value
    );
  } catch {
    // Browser storage may be unavailable.
  }
}

function clearCompletedAssessmentDraft() {
  try {
    localStorage.removeItem(
      STORAGE_KEYS.answers
    );
    localStorage.removeItem(
      STORAGE_KEYS.result
    );
    localStorage.removeItem(
      "aema_compliance_assessment_answers"
    );
    localStorage.removeItem(
      "aema_compliance_assessment_step"
    );
  } catch {
    // Browser storage may be unavailable.
  }
}
