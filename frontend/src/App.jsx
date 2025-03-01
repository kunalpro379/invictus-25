import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import LandingPage from "./pages/landing";
import ResearchPapers from "./pages/research-papers";
import PaperDetails from "./pages/paper-details";
import Datasets from "./pages/datasets";
import DatasetUpload from "./pages/dataset-upload";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/research-papers",
    element: <ResearchPapers />,
  },
  {
    path: "/research-papers/:id",
    element: <PaperDetails />,
  },
  {
    path: "/datasets",
    element: <Datasets />,
  },
  {
    path: "/dataset-upload",
    element: <DatasetUpload />,
  },
  {
    path: "/dataset/:id",
    element: <DatasetUpload />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
