// Supabase Edge Function: notify-inquiry
// Securely triggers an email alert to Marye upon receiving a new inquiry or BHN application
// Ensures NO email credentials or service role keys are exposed in frontend code.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFICATION_RECIPIENT = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || '2025254026@student.annauniv.edu';

serve(async (req: Request) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const payload = await req.json();
    const { name, email, organization, request_type, selected_service, subject, message, submitted_at } = payload;

    console.log(`Received inquiry alert request from: ${name} (${email})`);

    // If Resend API key is configured, transmit email alert
    if (RESEND_API_KEY) {
      const emailBody = `
New Website Inquiry / Service Request
---------------------------------------
Name: ${name}
Email: ${email}
Organization: ${organization || 'Independent'}
Request Type: ${request_type || 'General Inquiry'}
${selected_service ? `Selected Service: ${selected_service}` : ''}
Subject: ${subject || 'No Subject'}
Timestamp: ${submitted_at || new Date().toISOString()}

Message:
${message}
---------------------------------------
Access Admin CMS: https://marye-agegn.github.io/#admin
      `.trim();

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Marye Portfolio Desk <onboarding@resend.dev>',
          to: [NOTIFICATION_RECIPIENT],
          subject: `[Portfolio Alert] ${subject || `New Inquiry from ${name}`}`,
          text: emailBody,
        }),
      });

      const resendData = await resendRes.json();
      return new Response(JSON.stringify({ success: true, resend: resendData }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 200,
      });
    }

    // If email key not yet set in Supabase Secrets, log and acknowledge safely
    return new Response(
      JSON.stringify({
        success: true,
        notice: 'Inquiry registered. Configure RESEND_API_KEY in Supabase Edge Function Secrets for email delivery.',
      }),
      {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 500,
    });
  }
});
