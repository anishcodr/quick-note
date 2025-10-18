import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  try {
    // 1. Get the note ID from the URL query (e.g., ?id=kRz7bN)
    const url = new URL(req.url);
    const noteId = url.searchParams.get('id');

    if (!noteId) {
      return new Response(JSON.stringify({ error: "No ID provided." }), {
        status: 400,
      });
    }

    // 2. Get your "notes" database
    const store = getStore("notes");

    // 3. Get the note text from the database using its ID
    // We ask for "text" to get the raw string back
    const noteContent = await store.get(noteId, { type: "text" });

    if (!noteContent) {
      return new Response(JSON.stringify({ error: "Note not found." }), {
        status: 404,
      });
    }

    // 4. Send the note content back to the frontend
    return new Response(JSON.stringify({ content: noteContent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to get note." }), {
      status: 500,
    });
  }
};
