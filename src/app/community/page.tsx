"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createPostPlain,
  joinCommunityPlain,
  toggleReaction,
  createCommentPlain,
} from "@/lib/actions";
import { getCommunities, getCommunityPosts, getPostReactions } from "@/lib/data";
import { MessageCircle, ThumbsUp, Share2, User as UserIcon } from "lucide-react";

export default function CommunityPage() {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [myReactions, setMyReactions] = useState<Record<string, string | undefined>>({});

  const load = useCallback(async () => {
    const [comms, postsData] = await Promise.all([
      getCommunities(),
      getCommunityPosts(selectedCommunity || undefined),
    ]);
    setCommunities(comms);
    setPosts(postsData);
    // load my reactions
    const reactionMap: Record<string, string> = {};
    for (const p of postsData) {
      const reactions = await getPostReactions(p.id);
      const mine = reactions.find((r: any) => r.type === "like");
      if (mine) reactionMap[p.id] = "like";
    }
    setMyReactions(reactionMap);
  }, [selectedCommunity]);

  useEffect(() => { load(); }, [selectedCommunity, load]);

  async function handlePost() {
    await createPostPlain(selectedCommunity || "", content, imageUrl);
    setContent("");
    setImageUrl("");
    await load();
  }

  async function handleJoin(cid: string) {
    await joinCommunityPlain(cid);
    await load();
  }

  async function handleReact(pid: string) {
    const current = myReactions[pid];
    await toggleReaction(pid, current ? "unlike" : "like");
    setMyReactions((prev) => ({ ...prev, [pid]: current ? undefined : "like" }));
    await load();
  }

  const selectedCommunityObj = communities.find((c: any) => c.id === selectedCommunity);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground">Connect with other buyers and gamers</p>
        </div>
        <Button asChild>
          <Link href="/messages">
            <MessageCircle className="w-4 h-4 mr-2" /> Support Messages
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Communities */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-base font-semibold text-foreground mb-3">Communities</h3>
          <div className="space-y-2">
            {communities.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setSelectedCommunity(c.id)}
                className={`w-full text-left rounded-xl border p-3 transition-all ${
                  selectedCommunity === c.id
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "border-border bg-white hover:bg-muted/50 text-foreground"
                }`}
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.description}</div>
              </button>
            ))}
            <button
              onClick={() => handleJoin(selectedCommunity || "")}
              disabled={!selectedCommunity}
              className="w-full text-left rounded-xl border p-3 mt-4 text-sm"
            >
              Join {selectedCommunityObj?.name || ""}
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {selectedCommunity ? selectedCommunityObj?.name : "All Posts"}
            </h3>
            <Button variant="outline" size="sm" onClick={() => setSelectedCommunity(null)}>
              All Communities
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full border-none bg-transparent text-sm focus:ring-0 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" size="sm" onClick={handlePost} disabled={!content.trim()}>
                Post
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {posts.map((post: any) => {
              const reactions = post.post_reactions || [];
              const likes = reactions.filter((r: any) => r.type === "like").length;
              const liked = myReactions[post.id] === "like";
              return (
                <div key={post.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">
                        {post.profiles?.full_name || post.profiles?.username || "User"}
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-sm text-foreground mb-3 whitespace-pre-wrap">{post.content}</div>
                  {post.image_url && (
                    <img src={post.image_url} alt="Post" className="w-full h-48 object-cover rounded-xl mb-3" />
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => handleReact(post.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-indigo-600" : "text-muted-foreground hover:text-indigo-600"}`}
                    >
                      <ThumbsUp className="w-3 h-3" /> <span>{likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-indigo-600 transition-colors">
                      <MessageCircle className="w-3 h-3" /> Comment
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-indigo-600 transition-colors">
                      <Share2 className="w-3 h-3" /> Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
