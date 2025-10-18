// This imports Netlify's built-in database SDK.
import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  try {
    // 1. Get the note content sent from the frontend
    const { content } = await req.json();

    if (!content) {
      return new Response(JSON.stringify({ error: "No content provided." }), {
        status: 400,
      });
    }

    // 2. Generate a unique ID for the note
    // (Doing this on the backend is safer)
    const noteId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

    // 3. Get your database (Netlify calls it a "store")
    // We'll name our database "notes"
    const store = getStore("notes");

    // 4. Save the content to the database
    // This saves the raw text content using the 'noteId' as the key
    await store.set(noteId, content);

    // 5. Send the new note's ID back to the frontend
    return new Response(JSON.stringify({ id: noteId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to save note." }), {
      status: 500,
    });
  }
};
