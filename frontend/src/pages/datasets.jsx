import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  Download,
  FileType,
  Eye,
  ExternalLink,
  SortDesc,
  Upload
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export default function Datasets() {
  const [scrolled, setScrolled] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");

  // Sample data - replace with API call
  useEffect(() => {
    setDatasets([
      {
        id: 1,
        title: "Large-Scale Quantum Computing Dataset",
        description: "Comprehensive dataset of quantum computing experiments and results",
        field: "Quantum Computing",
        formats: ["CSV", "JSON", "Excel"],
        size: "2.3 GB",
        downloads: 1234,
        author: "MIT Quantum Lab",
        date: "2024-02-15",
        isOpenAccess: true,
        tags: ["quantum", "computing", "experiments"],
        preview: {
          columns: ["experiment_id", "qubits", "fidelity", "time"],
          rows: [
            [1, 5, 0.99, "2023-12-01"],
            [2, 7, 0.98, "2023-12-02"]
          ]
        }
      },
      // Add more sample datasets...
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Use same header as other pages */}
      {/* ... header code ... */}

      <main className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Research Datasets
          </h1>
          <p className="text-lg text-slate-600">
            Access and analyze high-quality datasets from leading research institutions
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Research Datasets</h1>
            <p className="text-slate-600 mt-2">Explore and download datasets for your research</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/datasets/upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Dataset
            </Link>
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search datasets by name, field, or author..."
                className="pl-10 h-12 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedField === "all" ? "All Fields" : selectedField}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Field</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["all", "Quantum Computing", "Machine Learning", "Physics"].map((field) => (
                    <DropdownMenuItem
                      key={field}
                      onClick={() => setSelectedField(field)}
                    >
                      {field}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Datasets Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset) => (
            <motion.div
              key={dataset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={dataset.isOpenAccess ? "success" : "secondary"}>
                      {dataset.isOpenAccess ? "Open Access" : "Restricted"}
                    </Badge>
                    <span className="text-sm text-slate-500">{dataset.size}</span>
                  </div>
                  <CardTitle className="text-xl mb-2">{dataset.title}</CardTitle>
                  <p className="text-sm text-slate-600">{dataset.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Available Formats</h4>
                      <div className="flex gap-2">
                        {dataset.formats.map((format) => (
                          <Badge 
                            key={format}
                            variant="outline" 
                            className="bg-slate-50"
                          >
                            <FileType className="h-3 w-3 mr-1" />
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-slate-500">
                        {dataset.downloads} downloads
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
