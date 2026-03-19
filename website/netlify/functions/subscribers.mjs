import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const store = getStore("waitlist");
  const { blobs } = await store.list();

  const subscribers = [];
  for (const blob of blobs) {
    const data = await store.get(blob.key);
    if (data) {
      try {
        subscribers.push(JSON.parse(data));
      } catch {
        // skip malformed entries
      }
    }
  }

  return new Response(
    JSON.stringify({ count: subscribers.length, subscribers }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const config = {
  path: "/api/subscribers",
};
