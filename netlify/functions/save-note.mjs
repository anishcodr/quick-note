// Import the Supabase client
// You'll need to run: npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

// Import a library to generate short, unique IDs
// You'll need to run: npm install nanoid
import { nanoid } from 'nanoid';

// Connect to your Supabase database
// Get these from your Supabase project settings.
// Use Netlify environment variables for security!
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// This is the main function Netlify will run
export const handler = async (event) => {
    
    // 1. Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // 2. Parse the data sent from your frontend
        const noteData = JSON.parse(event.body);

        // 3. Generate a unique, short ID for the note link
        const noteId = nanoid(8); // Generates a random 8-character ID like 'aB3x_gTz'

        // 4. Save the data to your Supabase table (e.g., a table named "notes")
        const { data, error } = await supabase
            .from('notes')
            .insert({
                id: noteId,
                content: noteData.content,
                has_password: noteData.hasPassword,
                expires_at: noteData.expiration,
                created_at: noteData.createdAt
            })
            .select()
            .single();

        // 5. Handle any database errors
        if (error) {
            throw error;
        }

        // 6. Success! Send the new note ID back to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ id: noteId })
        };

    } catch (error) {
        console.error('Error saving note:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save note.' })
        };
    }
};
