import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
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


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/services/software-development"
          element={<SoftwareDevelopment />}
        />
        <Route path="/services/ai-automation" element={<AIAutomation />} />
        <Route path="/services/business-systems" element={<BusinessSystems />} />
        <Route path="/services/booking-systems" element={<BookingSystems />} />
        <Route path="/services/seo-optimization" element={<SeoOptimization />} />
        <Route
          path="/services/ecommerce-development"
          element={<EcommerceDevelopment />}
        />
        <Route path="/about-aema-systems" element={<AboutAemaSystems />} />

        <Route path="/industries/healthcare" element={<Healthcare />} />
        <Route path="/industries/education" element={<Education />} />
        <Route path="/industries/retail" element={<Retail/>} />
        <Route path="/industries/startups" element={<Startups />} />
      </Routes>
    </BrowserRouter>
  );
}