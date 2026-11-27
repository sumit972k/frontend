"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      setProfile(profileData);

      // Fetch ONLY this user's posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (postsData) setMyPosts(postsData);
      
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
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
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading Profile...</div>;
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            ← Back to Feed
          </button>
          
          <h1 className="text-xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Profile
          </h1>

          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-10">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-1">
            <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center border-4 border-[#0a0a0a]">
              <span className="text-4xl font-bold text-white">{profile.username.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold">@{profile.username}</h2>
            <p className="text-gray-400 mt-2 max-w-md mx-auto">
              {profile.bio || "No bio yet. Click edit to add one."}
            </p>
          </div>

          <div className="flex gap-6 text-sm text-gray-400 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg">{myPosts.length}</span>
              Posts
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg">0</span>
              Followers
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg">0</span>
              Following
            </div>
          </div>

          <button className="mt-4 px-6 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* User's Posts */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-lg font-semibold mb-6">Your Posts</h3>
          
          {myPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white/5 rounded-2xl border border-white/10">
              You haven't posted anything yet.
            </div>
          ) : (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <div key={post.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs text-gray-500 mb-2">{formatTime(post.created_at)}</p>
                  <p className="text-gray-200">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}