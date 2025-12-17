import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("Hello from sync-mailchimp!")

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { donor } = await req.json()
        const apiKey = Deno.env.get('MAILCHIMP_API_KEY')
        const serverPrefix = Deno.env.get('MAILCHIMP_SERVER_PREFIX')
        const listId = Deno.env.get('MAILCHIMP_LIST_ID')

        if (!apiKey || !serverPrefix || !listId) {
            throw new Error('Missing Mailchimp configuration (API Key, Server Prefix, or List ID)')
        }

        if (!donor || !donor.email) {
            throw new Error('Missing donor email')
        }

        // Construct Mailchimp URL
        const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${donor.email.toLowerCase()}`

        // Calculate MD5 hash of email for the ID if we were doing it properly, 
        // but here we might be creating or updating. 
        // PUT is suitable for Create or Update.
        // The subscriber hash is the MD5 of the lowercase email.
        // To simplify, we'll try to use the subscriber hash endpoint logic if we had crypto.
        // For now, let's use the list members POST endpoint to ADD, or PUT to update if we can hash it.
        // Actually, Mailchimp recommends PUT to /lists/{list_id}/members/{subscriber_hash} for upsert.
        // Let's implement MD5 hashing using Web Crypto API available in Deno.

        const msgBuffer = new TextEncoder().encode(donor.email.toLowerCase());
        const hashBuffer = await crypto.subtle.digest('MD5', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const subscriberHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const targetUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`

        const data = {
            email_address: donor.email,
            status_if_new: 'subscribed',
            merge_fields: {
                FNAME: donor.first_name || '',
                LNAME: donor.last_name || '',
                PHONE: donor.phone || ''
            }
        }

        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                Authorization: `Basic ${btoa(`anystring:${apiKey}`)}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        const result = await response.json()

        if (!response.ok) {
            console.error('Mailchimp API error:', result)
            throw new Error(result.detail || 'Failed to sync with Mailchimp')
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
