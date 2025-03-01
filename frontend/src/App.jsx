import React from "react";
import { createBrowserRouter, RouterProvider, Link, useRouteError } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import LandingPage from "./pages/landing";
import ResearchPapers from "./pages/research-papers";
import PaperDetails from "./pages/paper-details";
import Datasets from "./pages/datasets";
import DatasetUpload from "./pages/dataset-upload";
import DatasetDetail from "./pages/DatasetDetail";

// Error boundary component
function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {error.status === 404 ? "Page Not Found" : "Oops! Something went wrong"}
        </h1>
        <p className="text-gray-600 mb-4">{error.message || "An unexpected error occurred"}</p>
        <Link to="/datasets" className="text-blue-600 hover:underline">
          Return to Datasets
        </Link>
      </div>
    </div>
  );
}

// Router configuration with future flags
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LandingPage />,
      errorElement: <ErrorPage />
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
      element: <DatasetDetail />,
      errorElement: <ErrorPage />,
      // Add loader to validate params
      loader: ({ params }) => {
        if (!params.id) {
          throw new Error("Dataset ID is required");
        }
        return params;
      }
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
