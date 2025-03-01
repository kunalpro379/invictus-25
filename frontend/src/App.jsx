import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import LandingPage from "./pages/landing";
import ResearchPapers from "./pages/research-papers";
import PaperDetails from "./pages/paper-details";
import Datasets from "./pages/datasets";
import DatasetUpload from "./pages/dataset-upload";
import DatasetDetail from "./pages/DatasetDetail";
import AuthenticatedLayout from "./components/layout/authenticated-layout"; // Adjust path
import Articles from "./pages/articles"; 
import ProfileForm from "./pages/ProfileForm";


const router = createBrowserRouter([
  // Public Routes
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

  // Authenticated Routes wrapped in AuthenticatedLayout
  {
    element: <AuthenticatedLayout />,
    children: [
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
        element: <DatasetDetail />,
      },
      {
        path: "/profile",
        element: <ProfileForm />,
      },
      {
        path: "/articles",
        element: <Articles />,
      },
    ],
  },

  // Redirect unmatched routes
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;