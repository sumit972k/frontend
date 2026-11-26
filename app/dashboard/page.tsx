"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Profile setup states
  const [setupUsername, setSetupUsername] = useState("");
  const [setupDept, setSetupDept] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
        
        // Check if they have a profile
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        setProfile(data);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await supabase.from("profiles").insert([
      { id: user.id, username: setupUsername, department: setupDept }
    ]);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      // Refresh the profile data
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    }
    setIsSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>;
  }

  // --- PROFILE SETUP SCREEN ---
  // If the user doesn't have a username in the database yet, show this screen
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Complete your profile</h2>
          <p className="text-gray-400 text-sm mb-6">Tell us who you are so others can find you.</p>
          
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Choose a Username</label>
              <input 
                type="text" 
                value={setupUsername}
                onChange={(e) => setSetupUsername(e.target.value)}
                placeholder="e.g. sumit_cs" 
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Department / Major</label>
              <input 
                type="text" 
                value={setupDept}
                onChange={(e) => setSetupDept(e.target.value)}
                placeholder="e.g. Computer Science, Zoology, Business" 
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            
            <button type="submit" disabled={isSaving} className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors mt-4 disabled:opacity-50">
              {isSaving ? "Saving..." : "Enter College Connect"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD FEED ---
  // If they DO have a profile, show the normal feed
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            College Connect
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 font-medium">@{profile.username}</span>
            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Create Post Box */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <textarea 
            placeholder="What's on your mind?" 
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-lg"
            rows={3}
          />
          <div className="flex justify-end mt-4">
            <button className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
              Post
            </button>
          </div>
        </div>

        {/* Fake Post 1 */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <span className="text-purple-400 font-bold">P</span>
            </div>
            <div>
              <p className="font-semibold text-white">@prof_sharma</p>
              <p className="text-xs text-gray-500">Computer Science • 2h ago</p>
            </div>
          </div>
          <p className="text-gray-300">
            Welcome to the new College Connect platform! This is where we will be sharing research papers and department announcements. Please keep discussions respectful and academic.
          </p>
        </div>

        {/* Fake Post 2 */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <span className="text-blue-400 font-bold">{profile.username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-white">@{profile.username}</p>
              <p className="text-xs text-gray-500">{profile.department} • Just now</p>
            </div>
          </div>
          <p className="text-gray-300">
            Testing out the new platform. The UI looks amazing! 🚀
          </p>
        </div>

      </main>
    </div>
  );
}