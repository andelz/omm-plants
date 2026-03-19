import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const email = (body.email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: "A valid email address is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const store = getStore("waitlist");

  // Use email as key — guarantees uniqueness
  const existing = await store.get(email);

  if (existing) {
    return new Response(
      JSON.stringify({ ok: true, message: "Already subscribed." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  await store.set(email, JSON.stringify({ email, subscribedAt: new Date().toISOString() }));

  return new Response(
    JSON.stringify({ ok: true, message: "Subscribed!" }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
};

export const config = {
  path: "/api/subscribe",
};
