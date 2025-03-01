import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import LandingPage from "./pages/landing";
import ResearchPapers from "./pages/research-papers";
import PaperDetails from "./pages/paper-details";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/research-papers" element={<ResearchPapers />} />
        <Route path="/research-papers/:id" element={<PaperDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
