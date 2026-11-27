"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]); 
  const [newPost, setNewPost] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  
  // Profile setup states
  const [setupUsername, setSetupUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
        
        // Fetch user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        setProfile(profileData);
        
        // Fetch all posts and join with the profiles table
        const { data: postsData } = await supabase
          .from("posts")
          .select("*, profiles(username)")
          .order("created_at", { ascending: false });

        if (postsData) setPosts(postsData);
        
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
    
    // We only insert the username now, bio will be added later
    const { error } = await supabase.from("profiles").insert([
      { id: user.id, username: setupUsername }
    ]);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    }
    setIsSaving(false);
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setIsPosting(true);
    
    const { data, error } = await supabase.from("posts").insert([
      { content: newPost, user_id: user.id }
    ]).select("*, profiles(username)");

    if (error) {
      alert("Error posting: " + error.message);
    } else if (data) {
      setPosts([data[0], ...posts]);
      setNewPost("");
    }
    setIsPosting(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading Aeris...</div>;
  }

  // --- PROFILE SETUP SCREEN (Only Username) ---
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Create your Username</h2>
          <p className="text-gray-400 text-sm mb-6">This is how people will find you on Aeris.</p>
          
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input 
                type="text" 
                value={setupUsername}
                onChange={(e) => setSetupUsername(e.target.value)}
                placeholder="e.g. sumit_cs" 
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            
            <button type="submit" disabled={isSaving} className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors mt-4 disabled:opacity-50">
              {isSaving ? "Saving..." : "Enter App"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD FEED ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Aeris
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 font-medium">@{profile.username}</span>
            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 flex-shrink-0">
              <span className="text-purple-400 font-bold">{profile.username.charAt(0).toUpperCase()}</span>
            </div>
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?" 
              className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-lg pt-2"
              rows={2}
            />
          </div>
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleCreatePost}
              disabled={isPosting || !newPost.trim()}
              className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No posts yet. Be the first to post something!
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <span className="text-purple-400 font-bold">
                    {post.profiles?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">@{post.profiles?.username || "unknown"}</p>
                  <p className="text-xs text-gray-500">{formatTime(post.created_at)}</p>
                </div>
              </div>
              <p className="text-gray-200 text-lg leading-relaxed">{post.content}</p>
            </div>
          ))
        )}

      </main>
    </div>
  );
}