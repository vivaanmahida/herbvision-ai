import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import IdentifyPage from "./pages/IdentifyPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import HerbDetailPage from "./pages/HerbDetailPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1a1410] text-[#fdf6e3]">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/identify" element={<IdentifyPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="/herb/:id" element={<HerbDetailPage />} />
          <Route path="/assistant" element={<AIAssistantPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
