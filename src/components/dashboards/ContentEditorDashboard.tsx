import React, { useState } from "react";
import { Edit3, Plus, BookOpen, MapPin, CheckCircle2, Image, Trash2 } from "lucide-react";
import { useTravelStore } from "../../store/travelStore";

export const ContentEditorDashboard: React.FC = () => {
  const { currentUser, travelGuides, destinations } = useTravelStore();

  const [guidesList, setGuidesList] = useState(travelGuides);
  const [isAddGuideOpen, setIsAddGuideOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Temple Etiquette");
  const [readTime, setReadTime] = useState(5);
  const [summary, setSummary] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGuide = {
      id: `guide-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      category,
      readTimeMinutes: readTime,
      author: currentUser.name,
      publishedDate: "August 2026",
      summary,
      content: summary,
      tags: ["Bali", "Guide", "TravelTips"],
    };

    setGuidesList([newGuide, ...guidesList]);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsAddGuideOpen(false);
      setTitle("");
      setSummary("");
    }, 1500);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-teal-950 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Edit3 className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-white">
                  Content Management & Editorial Desk
                </h1>
                <span className="bg-cyan-400 text-cyan-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Editorial Lead
                </span>
              </div>
              <p className="text-xs text-cyan-200 mt-0.5">
                Editor: {currentUser.name} • PT. Bali Sundaram Travel
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddGuideOpen(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs rounded-2xl shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Travel Guide</span>
          </button>
        </div>

        {/* Guides List */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900">
            Published Bali Travel Guides ({guidesList.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {guidesList.map((g) => (
              <div key={g.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                <img src={g.coverImage} alt={g.title} className="w-full h-32 rounded-xl object-cover" />
                <span className="text-[10px] font-bold text-[#0d4a44] bg-teal-50 px-2 py-0.5 rounded">
                  {g.category}
                </span>
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{g.title}</h4>
                <p className="text-[11px] text-stone-500 line-clamp-2">{g.summary}</p>
                <div className="text-[10px] text-stone-400 pt-1">
                  By {g.author} • {g.readTimeMinutes} min read
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Guide Modal */}
      {isAddGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">Publish Bali Travel Article</h3>

            {savedSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold text-center">
                ✓ Guide published successfully!
              </div>
            ) : (
              <form onSubmit={handleAddGuide} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Article Headline</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 7 Hidden Waterfalls in North Bali"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Read Time (Min)</label>
                    <input
                      type="number"
                      value={readTime}
                      onChange={(e) => setReadTime(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Article Summary & Body</label>
                  <textarea
                    rows={4}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Write insider tips and recommendations..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddGuideOpen(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-900 text-white font-bold rounded-xl"
                  >
                    Publish Article
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
