"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClientBrowser } from "@/lib/supabase-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb } from "@/components/ui/scroll-area";
import { Send, MessageCircle, Search as SearchIcon, User as UserIcon, ShieldCheck, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const supabaseRef = useRef<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<any | null>(null);
  const [me, setMe] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabaseRef.current = createClientBrowser();
    supabaseRef.current.auth.getUser().then(({ data }: { data: { user: any } | null }) => {
      setMe(data?.user?.id ?? null);
    });
    // eslint-disable-next-line
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (me) loadConversations();
    // eslint-disable-next-line
  }, [me]);

  useEffect(() => {
    if (activeConversation && me) {
      loadMessages(activeConversation.id);
      setPartner(
        activeConversation.user_a === me
          ? activeConversation.user_b
          : activeConversation.user_a
      );
    }
    scrollToBottom();
    // eslint-disable-next-line
  }, [activeConversation, me]);

  async function loadConversations() {
    const sb = supabaseRef.current;
    const { data, error } = await sb
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false });
    if (error) return;
    const enriched = await Promise.all(
      (data || []).map(async (c: any) => {
        const partnerId = c.user_a === me ? c.user_b : c.user_a;
        const { data: prof } = await sb
          .from("profiles")
          .select("full_name, username, avatar_url")
          .eq("id", partnerId)
          .single();
        return { ...c, partner: prof };
      })
    );
    setConversations(enriched);
    setLoading(false);
    if (!activeConversation && enriched[0]) setActiveConversation(enriched[0]);
  }

  async function loadMessages(convoId: string) {
    const sb = supabaseRef.current;
    const { data, error } = await sb
      .from("chat_messages")
      .select("*, profiles(full_name)")
      .eq("conversation_id", convoId)
      .order("created_at", { ascending: true });
    if (error) return;
    setMessages(data || []);
    await sb.from("conversation_reads").upsert({
      conversation_id: convoId,
      user_id: me,
      last_read_at: new Date().toISOString(),
    });
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation || !me) return;
    const sb = supabaseRef.current;
    const { error } = await sb.from("chat_messages").insert({
      conversation_id: activeConversation.id,
      sender_id: me,
      content: inputValue.trim(),
      sender_kind: "user",
    });
    if (error) return;
    setInputValue("");
    await loadMessages(activeConversation.id);
    await loadConversations();
  }

  async function startConversation(partnerId: string) {
    const sb = supabaseRef.current;
    const { data: existing } = await sb
      .from("conversations")
      .select("*")
      .or(`and(user_a.eq.${me},user_b.eq.${partnerId}),and(user_a.eq.${partnerId},user_b.eq.${me})`)
      .single();
    if (existing) {
      setActiveConversation(existing);
      return;
    }
    const { data: ins } = await sb
      .from("conversations")
      .insert({ user_a: me, user_b: partnerId })
      .select()
      .single();
    if (ins) {
      setActiveConversation(ins);
      loadConversations();
    }
  }

  useEffect(() => {
    const sb = supabaseRef.current;
    if (!sb) return;
    const channel = sb.channel("public:chat_messages");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload: any) => {
          const msg = payload.new as any;
          if (activeConversation && msg.conversation_id === activeConversation.id) {
            setMessages((prev) => [...prev, msg]);
            loadConversations();
          } else {
            loadConversations();
          }
        }
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, [activeConversation]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Customer support &amp; community messaging</p>
        </div>
        <div className="flex items-center gap-2 pl-8">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <Phone className="w-4 h-4 text-muted-foreground ml-2" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[340px] border-r border-border hidden lg:flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search conversations" className="pl-9" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No conversations yet. Start a conversation with support.
              </div>
            ) : (
              <div className="space-y-0">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConversation(c)}
                    className={cn("flex items-center gap-3 px-4 py-3 transition-colors", activeConversation?.id === c.id ? "bg-indigo-50 text-indigo-700" : "text-foreground hover:bg-muted/50")}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted shrink-0">
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.partner?.full_name || c.partner?.username || "Support"}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.last_message_preview || "No messages yet"}</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground">{c.last_message_at ? new Date(c.last_message_at).toLocaleDateString() : ""}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {loading || !me ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
          ) : !activeConversation ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">Select a conversation to start messaging</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-background">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{partner?.full_name || partner?.username || "Support"}</div>
                    <div className="text-xs text-muted-foreground">Online</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/support">New Conversation</Link>
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.map((m) => {
                  const isMine = m.sender_id === me;
                  return (
                    <div key={m.id} className={cn("max-w-[80%] p-3 rounded-2xl", isMine ? "ml-auto bg-indigo-600 text-white" : "mr-auto bg-muted/50 text-foreground border border-border/50")}>
                      <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                      <div className="text-[10px] mt-1 opacity-60 text-right">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {isMine && " ✓"}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="border-t border-border p-4 bg-background">
                <div className="flex gap-2">
                  <input
                    name="content"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button type="submit" disabled={!inputValue.trim() || !activeConversation}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
