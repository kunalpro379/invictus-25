import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  FileType,
  Calendar,
  ArrowLeft,
  Database,
  Info,
  BookOpen,
} from "lucide-react";
import datasetJson from "../data/datasets.json";

const DatasetDetail = () => {
  const { id } = useParams();
  const dataset = datasetJson; // Using the imported JSON data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/datasets">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Datasets
          </Button>
        </Link>

        {/* Dataset Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{dataset.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-1" />
              {dataset.overview.source}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Last updated: {dataset.overview.last_updated}
            </div>
            <div className="flex items-center">
              <FileType className="h-4 w-4 mr-1" />
              {dataset.files.length} files
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {dataset.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Dataset Overview</CardTitle>
                <CardDescription>{dataset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Rows</p>
                    <p className="text-lg font-semibold">{dataset.overview.total_rows.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Columns</p>
                    <p className="text-lg font-semibold">{dataset.overview.total_columns}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data Formats</p>
                    <p className="text-lg font-semibold">{dataset.overview.data_format.join(", ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Data Card */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Data Preview</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {dataset.sample_data.columns.map((col) => (
                        <TableHead key={col.name}>{col.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.sample_data.preview.map((row, idx) => (
                      <TableRow key={idx}>
                        {Object.values(row).map((value, i) => (
                          <TableCell key={i}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Data Dictionary */}
            <Card>
              <CardHeader>
                <CardTitle>Data Dictionary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.data_dictionary.map((item) => (
                      <TableRow key={item.column}>
                        <TableCell className="font-medium">{item.column}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.example}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <Card>
              <CardHeader>
                <CardTitle>Download Dataset</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-4" asChild>
                  <a href={dataset.download_info.download_link} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download Files
                  </a>
                </Button>
                <div className="text-sm text-gray-500">
                  <p className="mb-2">
                    <span className="font-medium">License:</span> {dataset.download_info.license_type}
                  </p>
                  <p>
                    <span className="font-medium">Attribution:</span> {dataset.download_info.attribution}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Use Cases Card */}
            <Card>
              <CardHeader>
                <CardTitle>Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  {dataset.use_cases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* User Feedback Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataset.user_feedback.comments.map((comment, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <p className="text-sm text-gray-600 mb-1">{comment.comment}</p>
                      <p className="text-xs text-gray-500">
                        {comment.user} • {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQs Card */}
            <Card>
              <CardHeader>
                <CardTitle>FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataset.user_feedback.faqs.map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
