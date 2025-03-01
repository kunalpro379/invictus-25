import React, { useState } from "react";
import { Button } from "../components/ui/button"; // Adjust path based on your structure
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    bio: "",
    interests: [],
    institute: "",
    papers: [{ title: "", link: "" }],
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding interests as tags
  const handleInterestKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setFormData({
        ...formData,
        interests: [...formData.interests, e.target.value],
      });
      e.target.value = "";
    }
  };

  // Handle adding new paper
  const addPaper = () => {
    setFormData({
      ...formData,
      papers: [...formData.papers, { title: "", link: "" }],
    });
  };

  // Handle paper input changes
  const handlePaperChange = (index, field, value) => {
    const updatedPapers = formData.papers.map((paper, i) =>
      i === index ? { ...paper, [field]: value } : paper
    );
    setFormData({ ...formData, papers: updatedPapers });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Data:", formData);
    // Add API call or local storage logic here
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center max-w-2xl mx-auto p-6">
      <div>
      <h2 className="text-2xl font-bold mb-4">Complete Your Research Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Short Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Short Bio</label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself (max 200 chars)"
            maxLength={200}
            className="w-full"
          />
          <p className="text-sm text-gray-500">
            {formData.bio.length}/200
          </p>
        </div>

        {/* Interests */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Interests</label>
          <Input
            type="text"
            onKeyDown={handleInterestKeyDown}
            placeholder="Type an interest and press Enter"
            className="w-full"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Institute */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Institute</label>
          <Input
            name="institute"
            value={formData.institute}
            onChange={handleChange}
            placeholder="Your institution"
            className="w-full"
          />
        </div>

        {/* Research Papers */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Research Papers
          </label>
          {formData.papers.map((paper, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={paper.title}
                onChange={(e) =>
                  handlePaperChange(index, "title", e.target.value)
                }
                placeholder="Paper Title"
                className="flex-1"
              />
              <Input
                value={paper.link}
                onChange={(e) =>
                  handlePaperChange(index, "link", e.target.value)
                }
                placeholder="Paper URL"
                className="flex-1"
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={addPaper}
            className="mt-2 bg-blue-500 hover:bg-blue-600"
          >
            Add Another Paper
          </Button>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
          Save Profile
        </Button>
      </form>
      </div>
    </div>
  );
};

export default ProfileForm;