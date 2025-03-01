import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  Calendar,
  Building2,
  ArrowRight,
  SortAsc,
  SortDesc,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import researchPapersData from "@/data/research-papers.json";
import { Link } from "react-router-dom";

export default function ResearchPapers() {
  const [scrolled, setScrolled] = useState(false);
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc"
  });
  const [filterType, setFilterType] = useState("all");
  const [filterField, setFilterField] = useState("all");

  useEffect(() => {
    // Simulate API call with local JSON data
    setPapers(researchPapersData.papers);
  }, []);

  const sortOptions = [
    { label: "Date", value: "date" },
    { label: "Citations", value: "citations" },
    { label: "Title", value: "title" },
    { label: "Field", value: "field" }
  ];

  const filterTypes = [
    { label: "All Types", value: "all" },
    { label: "Research Article", value: "Research Article" },
    { label: "Case Study", value: "Case Study" },
    { label: "Review Article", value: "Review Article" }
  ];

  const techFields = [
    { label: "All Fields", value: "all" },
    { label: "Quantum Computing", value: "Quantum Computing" },
    { label: "Machine Learning", value: "Machine Learning" },
    { label: "Artificial Intelligence", value: "Artificial Intelligence" },
    { label: "Deep Learning", value: "Deep Learning" },
    { label: "Generative AI", value: "Generative AI" },
    { label: "Cloud Computing", value: "Cloud Computing" },
    { label: "Physics", value: "Physics" },
    { label: "Neural Networks", value: "Neural Networks" },
    { label: "Natural Language Processing", value: "NLP" },
    { label: "Computer Vision", value: "Computer Vision" },
    { label: "Robotics", value: "Robotics" }
  ];

  const handleSort = (field) => {
    setSortConfig({
      field,
      direction: sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc"
    });
  };

  useEffect(() => {
    let filtered = [...papers];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(paper => paper.type === filterType);
    }

    // Apply field filter
    if (filterField !== "all") {
      filtered = filtered.filter(paper => 
        paper.field === filterField || paper.tags.includes(filterField.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareA = a[sortConfig.field];
      let compareB = b[sortConfig.field];

      if (typeof compareA === "string") {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      if (compareA < compareB) return sortConfig.direction === "asc" ? -1 : 1;
      if (compareA > compareB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredPapers(filtered);
  }, [searchQuery, filterType, filterField, sortConfig, papers]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Updated Header to match landing page */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <motion.a 
            href="/" 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-80" />
              <div className="relative h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">H</span>
              </div>
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${
              scrolled
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                : 'text-gray-800'
            }`}>
              Hackathon Starter
            </span>
          </motion.a>

          <nav className="hidden md:flex items-center space-x-8">
            {['Features', 'Research Papers', 'Testimonials', 'Pricing'].map((item) => (
              <motion.a
                key={item}
                href={item === 'Research Papers' ? '/research-papers' : `/#${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors duration-300 ${
                  scrolled
                    ? 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline">
                <a href="/login" className="flex items-center space-x-2">
                  <span>Login</span>
                </a>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <a href="/signup">Get Started</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
          Research Repository
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
          Centralized Access to Scholarly Articles, Research Papers
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search papers, authors, or keywords..."
                className="pl-10 h-12 border-slate-200 rounded-lg text-slate-600 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {filterField === "all" ? "All Fields" : filterField}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Field</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {techFields.map((field) => (
                    <DropdownMenuItem
                      key={field.value}
                      onClick={() => setFilterField(field.value)}
                    >
                      {field.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {sortConfig.direction === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                    Sort by {sortOptions.find(opt => opt.value === sortConfig.field)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleSort(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Refined Papers Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.map((paper) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              key={paper.id}>
              <Card className="group h-full bg-white border-slate-100 hover:shadow-lg transition-all duration-300">
                <CardHeader className="space-y-3 pb-4">
                  <motion.div 
                    whileHover={{ scale: 1.01 }} 
                    className="space-y-3"
                  >
                    <CardTitle className="text-xl font-semibold text-slate-800 leading-tight">
                      {paper.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span>{paper.date}</span>
                      <span className="text-slate-300">•</span>
                      <Building2 className="h-4 w-4" />
                      <span>{paper.affiliations[0]}</span>
                    </div>
                  </motion.div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-blue-100 text-blue-700 border-none">
                      {paper.field}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center text-slate-600">
                      <h4 className="text-sm font-medium">Authors</h4>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed">
                      {paper.authors.join(", ")}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {paper.abstract}
                  </p>
  
                  <div className="flex flex-wrap gap-2">
                    {paper.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors px-3 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
  
                  <Link 
                    to={`/research-papers/${paper.id}`}
                    className="w-full"
                  >
                    <Button 
                      className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 border-none group-hover:text-blue-600 transition-colors"
                    >
                      Read Full Paper
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
