import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// A write-enabled token is required to create documents from the server.
// Create an "Editor" token at sanity.io/manage → API → Tokens and add it to
// .env.local as SANITY_API_WRITE_TOKEN (falls back to the read token if it has write access).
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const message = String(body.message || "").trim();
    const email = String(body.email || "").trim();
    const postId = String(body.postId || "").trim();
    const ratingNum = Number(body.rating);
    const rating = ratingNum >= 1 && ratingNum <= 5 ? Math.round(ratingNum) : undefined;

    if (!name || !message || !postId) {
      return NextResponse.json({ error: "Please add your name and a comment." }, { status: 400 });
    }
    if (name.length > 80 || message.length > 1500 || email.length > 160) {
      return NextResponse.json({ error: "That input is too long." }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json(
        { error: "Comments aren't configured yet. Add SANITY_API_WRITE_TOKEN to enable them." },
        { status: 503 }
      );
    }

    const writeClient = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    await writeClient.create({
      _type: "comment",
      name,
      message,
      email: email || undefined,
      rating,
      post: { _type: "reference", _ref: postId },
      approved: false,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[comments] create failed:", err);
    return NextResponse.json({ error: "Sorry, we couldn't post your comment. Please try again." }, { status: 500 });
  }
}
