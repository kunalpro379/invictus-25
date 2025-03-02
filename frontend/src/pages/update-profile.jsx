import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Camera, User, Calendar, MapPin, Mail, Link, BookOpen, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"; // Add this import
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Schema validation
const updateProfileSchema = z.object({
  shortBio: z.string().min(1, "Short bio is required").max(2000),
  interests: z.string().min(1, "At least one interest is required").transform((val) => val.split(",").map((item) => item.trim())),
  instituteName: z.string().min(1, "Institute name is required"),
  papers: z.array(
    z.object({
      name: z.string().min(1, "Paper name is required"),
      url: z.string().url("Please enter a valid URL"),
    })
  ).min(1, "At least one paper is required"),
});

// Fetch user data
const fetchUserData = async (token) => {
  try {
    const res = await axios.get("http://localhost:3000/api/v1/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user;
  } catch (err) {
    console.error("Error fetching user data:", err.response?.data || err.message);
    return null;
  }
};

export default function UpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [papers, setPapers] = useState([{ name: "", url: "" }]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("/default-avatar.png");
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [experience, setExperience] = useState(4);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
  });

  // Fetch and populate user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      const userData = await fetchUserData(token);
      if (userData) {
        setValue("shortBio", userData.shortBio || "");
        setValue("interests", Array.isArray(userData.interests) ? userData.interests.join(", ") : userData.interests || "");
        setValue("instituteName", userData.instituteName || "");
        const formattedPapers = userData.papers?.length ? userData.papers : [{ name: "", url: "" }];
        setPapers(formattedPapers);
        setValue("papers", formattedPapers);
      }
    };
    loadUserData();
  }, [token, navigate, setValue]);

  // Handle adding a new paper field
  const addPaper = () => {
    const newPapers = [...papers, { name: "", url: "" }];
    setPapers(newPapers);
    setValue("papers", newPapers);
  };

  // Handle paper input changes
  const handlePaperChange = (index, field, value) => {
    const updatedPapers = papers.map((paper, i) =>
      i === index ? { ...paper, [field]: value } : paper
    );
    setPapers(updatedPapers);
    setValue("papers", updatedPapers);
  };

  // Handle deleting a paper
  const deletePaper = (index) => {
    if (papers.length === 1) return;
    const updatedPapers = papers.filter((_, i) => i !== index);
    setPapers(updatedPapers);
    setValue("papers", updatedPapers);
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle experience update
  const handleExperienceUpdate = (value) => {
    setExperience(value);
    setIsEditingExperience(false);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      
      // Append other data
      formData.append("userData", JSON.stringify({
        shortBio: data.shortBio,
        interests: Array.isArray(data.interests) ? data.interests.join(", ") : data.interests,
        instituteName: data.instituteName,
        papers: data.papers
      }));

      await axios.put("http://localhost:3000/api/v1/users/update", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      alert("Profile updated successfully");
      navigate("/user-profile");
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed. Please check the input data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Profile Header */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-white/90 shadow-xl overflow-hidden bg-gradient-to-br from-gray-100 to-white">
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <label className="absolute bottom-2 right-2 bg-violet-500 hover:bg-violet-600 text-white p-2 rounded-full cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <Camera className="h-5 w-5" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold">John Doe</h2>
                <p className="text-blue-100">Research Scholar</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <h3 className="text-2xl font-bold">{papers.length}</h3>
                <p className="text-blue-100 text-sm">Papers Published</p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <h3 className="text-2xl font-bold">156</h3>
                <p className="text-blue-100 text-sm">Citations</p>
              </div>
              <div className="relative p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors group">
                {isEditingExperience ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-16 bg-white/20 border-0 text-white"
                      onBlur={() => handleExperienceUpdate(experience)}
                    />
                    <span className="text-sm text-white">years</span>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold">{experience}</h3>
                    <p className="text-blue-100 text-sm">Years Experience</p>
                    <button
                      onClick={() => setIsEditingExperience(true)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="h-4 w-4 text-white/70 hover:text-white" />
                    </button>
                  </>
                )}
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <h3 className="text-2xl font-bold">8.5</h3>
                <p className="text-blue-100 text-sm">H-Index</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-colors">
              <CardHeader>
                <CardTitle className="text-gray-800">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span>john.doe@research.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>Stanford University</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>Joined {new Date().getFullYear()}</span>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    Research Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['AI', 'Machine Learning', 'Data Science', 'NLP'].map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* About Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">About Me</h3>
                <div className="space-y-2">
                  <Label className="text-gray-700">Bio</Label>
                  <Textarea 
                    {...register("shortBio")}
                    placeholder="Tell us about your research journey..."
                    className="min-h-[150px] resize-none bg-white/50 hover:bg-white/80 transition-colors border-gray-200 rounded-xl"
                  />
                  <p className="text-sm text-gray-500">{watch("shortBio")?.length || 0}/2000</p>
                </div>
              </div>

              {/* Research Papers Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Research Papers</h3>
                <div className="space-y-4">
                  {papers.map((paper, index) => (
                    <div 
                      key={index} 
                      className="group relative bg-white/50 hover:bg-white/80 transition-colors p-4 rounded-xl border border-gray-200 hover:border-violet-200"
                    >
                      <div className="space-y-2">
                        <Input 
                          value={paper.name}
                          onChange={(e) => handlePaperChange(index, "name", e.target.value)}
                          placeholder="Paper Title"
                          className="border-0 border-b focus-visible:ring-0 rounded-none px-0 text-lg font-medium"
                        />
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4 text-gray-400" />
                          <Input 
                            value={paper.url}
                            onChange={(e) => handlePaperChange(index, "url", e.target.value)}
                            placeholder="DOI or URL"
                            className="border-0 focus-visible:ring-0"
                          />
                        </div>
                      </div>
                      {papers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePaper(index)}
                          className="absolute top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addPaper}
                    variant="outline"
                    className="w-full border-dashed border-gray-300 hover:border-violet-300 hover:bg-white/50 text-gray-600 hover:text-violet-700 rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Paper
                  </Button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="hover:bg-white/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-8"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
