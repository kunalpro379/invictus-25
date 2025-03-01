import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar, Mail, Building2, BookOpen, Quote, 
  Download, Share2, MessageSquare, ThumbsUp,
  BarChart2, Users, FileText, Table, Image,
  ExternalLink, BookmarkPlus
} from "lucide-react";
import paperDetailsData from "@/data/paper-details.json";

export default function PaperDetails() {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    // Simulate API call
    setPaper(paperDetailsData.papers[id]);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!paper) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Use same header as research-papers.jsx */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        {/* Copy the entire header from research-papers.jsx */}
      </header>

      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Paper Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{paper.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {paper.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {paper.journal.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Quote className="h-4 w-4" />
                  {paper.citations} citations
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Updated Tabs Usage */}
          <Tabs defaultValue="overview">
            <TabsList className="w-full grid grid-cols-5 gap-4 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="fulltext">Full Text</TabsTrigger>
              <TabsTrigger value="figures">Figures & Data</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Authors Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Authors</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {paper.authors.map((author) => (
                    <div key={author.name} className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {author.name.charAt(0)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">{author.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {author.affiliation}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {author.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Abstract Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Abstract</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{paper.abstract}</p>
                <div className="space-y-2">
                  <h3 className="font-medium">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword) => (
                      <Badge key={keyword} className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research Highlights */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Research Highlights</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {paper.highlights?.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="fulltext">
              {/* Full Text Content */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="prose max-w-none">
                  {/* Add formatted full text content here */}
                  <h2>Introduction</h2>
                  <p>{paper.fullText}</p>
                  {/* Add more sections */}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="figures">
              {/* Figures Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">Figures & Tables</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {paper.figures?.map((figure) => (
                    <div key={figure.id} className="space-y-2">
                      <div className="aspect-video bg-gray-100 rounded-lg"></div>
                      <p className="text-sm text-gray-600">{figure.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics">
              {/* Metrics Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">Impact & Metrics</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-blue-600 mb-2">Citations</div>
                    <div className="text-2xl font-bold">{paper.citations}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-green-600 mb-2">Downloads</div>
                    <div className="text-2xl font-bold">{paper.metrics?.downloads || 0}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-purple-600 mb-2">Readers</div>
                    <div className="text-2xl font-bold">{paper.metrics?.readers || 0}</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments">
              {/* Comments Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Comments & Discussion</h2>
                  <Button onClick={() => setShowCommentForm(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>

                <div className="space-y-6">
                  {paper.comments?.map((comment) => (
                    <div key={comment.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{comment.author}</h3>
                            <span className="text-sm text-gray-500">{comment.date}</span>
                          </div>
                          <p className="mt-2 text-gray-600">{comment.content}</p>
                          <div className="mt-3 flex items-center gap-4">
                            <button className="text-sm text-gray-500 flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              {comment.likes}
                            </button>
                            <button className="text-sm text-gray-500">Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Papers */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
            <h2 className="text-xl font-semibold mb-6">Related Papers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {paper.relatedPapers?.map((related) => (
                <div key={related.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">{related.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{related.authors.join(", ")}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {related.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
