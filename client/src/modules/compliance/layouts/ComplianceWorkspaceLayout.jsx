import Navbar from "../../../components/Navbar.jsx";
import Footer from "../../../components/Footer.jsx";

import ComplianceWorkspaceSidebar from "./ComplianceWorkspaceSidebar.jsx";
import WorkspaceHeader from "./WorkspaceHeader.jsx";

export default function ComplianceWorkspaceLayout({
  badge = "Compliance OS",
  title,
  description,
  children,
  action = null,
  workspaceId = "",
  assessmentId = "",
  businessName = "AEMA Compliance OS",
  documentCount = 0,
  hostingStatus = "inactive",
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.42)_1px,transparent_1px)] [background-size:46px_46px]" />
        <div className="absolute left-[4%] top-0 h-[520px] w-[520px] rounded-full bg-emerald-400/[0.07] blur-[145px]" />
        <div className="absolute right-[2%] top-[12%] h-[620px] w-[620px] rounded-full bg-cyan-400/[0.08] blur-[155px]" />
      </div>

      <Navbar />

      <section className="relative px-5 pb-20 pt-28 sm:px-6 lg:pt-32">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <ComplianceWorkspaceSidebar
            workspaceId={workspaceId}
            assessmentId={assessmentId}
            businessName={businessName}
            documentCount={documentCount}
            hostingStatus={hostingStatus}
          />

          <div className="min-w-0">
            <WorkspaceHeader
              badge={badge}
              title={title}
              description={description}
              action={action}
            />

            {children}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
