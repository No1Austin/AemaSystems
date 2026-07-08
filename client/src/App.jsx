import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import GrowthBlueprint from "./pages/GrowthBlueprint";
import AemaAI from "./pages/AemaAI";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminLogin from "./pages/auth/AdminLogin";
import ComplianceOS from "./pages/ComplianceOS";
import SoftwareDevelopment from "./services/software-development";
import AIAutomation from "./services/ai-automation";
import BusinessSystems from "./services/business-systems";
import BookingSystems from "./services/booking-systems";
import SeoOptimization from "./services/seo-optimization";
import EcommerceDevelopment from "./services/ecommerce-development";
import AboutAemaSystems from "./services/about-aema-systems";

import Healthcare from "./industries/healthcare";
import Education from "./industries/education";
import Retail from "./industries/retail";
import Startups from "./industries/startups";

import ProtectedAdminRoute from "./components/auth/ProtectedAdminRoute";

import TrustCenter from "./pages/trust/TrustCenter";
import PolicyPage from "./pages/trust/PolicyPage";

import GovernanceDashboard from "./pages/governance/GovernanceDashboard";
import GovernanceDocuments from "./pages/governance/GovernanceDocuments";
import GovernanceRisks from "./pages/governance/GovernanceRisks";
import GovernanceVendors from "./pages/governance/GovernanceVendors";
import GovernanceReviews from "./pages/governance/GovernanceReviews";
import GovernanceSettings from "./pages/governance/GovernanceSettings";
import GovernancePolicyEditor from "./pages/governance/GovernancePolicyEditor";
import ComplianceAssessment from "./pages/governance/ComplianceAssessment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<AemaAI />} />
        <Route path="/growth-blueprint" element={<GrowthBlueprint />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Services */}
        <Route path="/services/software-development" element={<SoftwareDevelopment />} />
        <Route path="/services/ai-automation" element={<AIAutomation />} />
        <Route path="/services/business-systems" element={<BusinessSystems />} />
        <Route path="/services/booking-systems" element={<BookingSystems />} />
        <Route path="/services/seo-optimization" element={<SeoOptimization />} />
        <Route path="/services/ecommerce-development" element={<EcommerceDevelopment />} />
        <Route path="/about-aema-systems" element={<AboutAemaSystems />} />

        {/* Industries */}
        <Route path="/industries/healthcare" element={<Healthcare />} />
        <Route path="/industries/education" element={<Education />} />
        <Route path="/industries/retail" element={<Retail />} />
        <Route path="/industries/startups" element={<Startups />} />

        {/* Dynamic Trust Center */}
        <Route path="/trust" element={<TrustCenter />} />
        <Route path="/trust/:slug" element={<PolicyPage />} />

        {/* Protected Compliance / Governance OS */}
        <Route
          path="/governance"
          element={
            <ProtectedAdminRoute>
              <GovernanceDashboard />
            </ProtectedAdminRoute>
          }
        />
<Route path="/compliance-os" element={<ComplianceOS />} />
        
        <Route
          path="/governance/assessment"
          element={
            <ProtectedAdminRoute>
              <ComplianceAssessment />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/governance/documents"
          element={
            <ProtectedAdminRoute>
              <GovernanceDocuments />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/governance/documents/:slug"
          element={
            <ProtectedAdminRoute>
              <GovernancePolicyEditor />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/governance/risks"
          element={
            <ProtectedAdminRoute>
              <GovernanceRisks />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/governance/vendors"
          element={
            <ProtectedAdminRoute>
              <GovernanceVendors />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/governance/reviews"
          element={
            <ProtectedAdminRoute>
              <GovernanceReviews />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/governance/settings"
          element={
            <ProtectedAdminRoute>
              <GovernanceSettings />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}