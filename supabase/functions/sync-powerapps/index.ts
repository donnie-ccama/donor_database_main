import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("Hello from sync-powerapps!")

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { donor } = await req.json()
        const webhookUrl = Deno.env.get('POWER_APPS_WEBHOOK_URL')

        if (!webhookUrl) {
            throw new Error('Missing POWER_APPS_WEBHOOK_URL configuration')
        }

        if (!donor) {
            throw new Error('Missing donor data')
        }

        // Forward the payload to Power Apps
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: 'citykid-crm',
                timestamp: new Date().toISOString(),
                data: donor
            }),
        })

        if (!response.ok) {
            // Sometimes Power Automate returns 202 Accepted, which is ok.
            // It generally returns 200, 202, 204 for success.
            throw new Error(`Power Apps responded with ${response.status}: ${response.statusText}`)
        }

        // Power Apps/Logic Apps often don't return JSON unless configured to.
        // We'll just return success.

        return new Response(JSON.stringify({ success: true, message: 'Forwarded to Power Apps' }), {
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
