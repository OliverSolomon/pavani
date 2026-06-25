"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Star, Check, Send } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { PortableText } from "@portabletext/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const ease = [0.23, 1, 0.32, 1] as const;

interface ArticleClientProps {
  post: any;
  comments: any[];
  settings?: any;
}

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "";

export default function ArticleClient({ post, comments, settings }: ArticleClientProps) {
  const reduce = useReducedMotion();

  const [form, setForm] = useState({ name: "", email: "", message: "", rating: 0 });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.7, ease },
      };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, postId: post._id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      setForm({ name: "", email: "", message: "", rating: 0 });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1714]">
      <Navbar settings={settings} />

      {/* ── Hero ── */}
      <section className="relative h-[60vh] min-h-[420px] w-full flex items-end overflow-hidden">
        {post.coverImage ? (
          <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-[#210A0B]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#210A0B]/90 via-[#210A0B]/35 to-[#210A0B]/10" />
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 lg:px-8 pb-12 lg:pb-16">
          <Link
            href="/insights"
            className="cta-link inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.35em] uppercase text-[#E8DCBF] hover:text-[#FBF5F2] mb-6"
          >
            <ArrowLeft size={13} /> All Insights
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#E8DCBF]">{post.category || "Insight"}</span>
            <span className="w-1 h-1 rounded-full bg-[#E8DCBF]/50" />
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#FBF5F2]/60">{fmtDate(post.publishedAt)}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-serif font-light text-[#FBF5F2] leading-tight">{post.title}</h1>
        </div>
      </section>

      {/* ── Body ── */}
      <article className="max-w-3xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {post.excerpt && (
          <p className="text-xl lg:text-2xl font-serif font-light italic text-[#82000D] leading-relaxed mb-10">
            {post.excerpt}
          </p>
        )}
        {post.content ? (
          <div className="prose max-w-none text-[#1C1714]/85 font-normal leading-[1.85]">
            <PortableText value={post.content} />
          </div>
        ) : (
          <p className="text-[1rem] font-normal text-[#1C1714]/80 leading-[1.85]">
            The full piece is published on LinkedIn. Read it there, then share your thoughts below.
          </p>
        )}

        {post.externalUrl && (
          <a
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-crimson inline-flex items-center gap-3 px-8 py-4 text-[10px] font-bold tracking-[0.35em] uppercase mt-10"
          >
            <FaLinkedinIn size={14} /> Read the full article <ArrowUpRight size={14} />
          </a>
        )}
      </article>

      {/* ── Opinions / Comments ── */}
      <section className="border-t border-[#82000D]/12 bg-[#F3EFE9]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
          <motion.div {...fade} className="mb-10">
            <p className="eyebrow mb-3">Opinions</p>
            <h2 className="text-2xl lg:text-3xl font-serif font-light text-[#1C1714]">
              Join the <em className="italic text-[#82000D]">conversation</em>
            </h2>
            <p className="text-[0.9rem] font-normal text-[#1C1714]/75 leading-relaxed mt-3 max-w-lg">
              Share your view on this piece. Comments appear once approved by our team.
            </p>
          </motion.div>

          {/* Existing comments */}
          {comments.length > 0 && (
            <div className="space-y-4 mb-12">
              {comments.map((c) => (
                <div key={c._id} className="glass-card p-6">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1C1714]">{c.name}</p>
                    {c.rating ? (
                      <span className="flex gap-0.5">
                        {Array.from({ length: c.rating }).map((_, i) => (
                          <Star key={i} size={12} className="text-[#82000D]" fill="currentColor" />
                        ))}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[0.9rem] font-normal text-[#1C1714]/80 leading-relaxed">{c.message}</p>
                  {c.submittedAt && (
                    <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/40 mt-3">{fmtDate(c.submittedAt)}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Comment form */}
          {status === "sent" ? (
            <div className="glass-card p-10 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 bg-[#82000D] flex items-center justify-center">
                <Check size={20} className="text-[#FBF5F2]" />
              </div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1C1714]">Thank you</p>
              <p className="text-sm text-[#1C1714]/70 max-w-xs">
                Your comment has been received and will appear here once it&rsquo;s approved.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#82000D] hover:opacity-70 transition-opacity"
              >
                Add another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="glass-card p-7 lg:p-9 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/60">Name</label>
                  <input
                    type="text" required maxLength={80}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="pavani-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/60">Email (optional, private)</label>
                  <input
                    type="email" maxLength={160}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="pavani-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/60">Rating (optional)</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onClick={() => setForm((f) => ({ ...f, rating: f.rating === n ? 0 : n }))}
                      className="p-0.5"
                    >
                      <Star
                        size={20}
                        className={cn("transition-colors", n <= form.rating ? "text-[#82000D]" : "text-[#1C1714]/25 hover:text-[#82000D]/50")}
                        fill={n <= form.rating ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/60">Your comment</label>
                <textarea
                  required rows={4} maxLength={1500}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Share your thoughts on this article…"
                  className="pavani-input resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-[11px] text-[#82000D] font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className={cn(
                  "btn-crimson inline-flex items-center justify-center gap-3 px-8 py-4 text-[10px] font-bold tracking-[0.4em] uppercase",
                  status === "loading" && "opacity-60 cursor-wait"
                )}
              >
                {status === "loading" ? "Posting…" : <>Post comment <Send size={13} /></>}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
