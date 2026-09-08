// Supabase Edge Function: notify-inquiry
// Securely triggers an email alert to Marye upon receiving a new inquiry or BHN application
// Ensures NO email credentials or service role keys are exposed in frontend code.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFICATION_RECIPIENT = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || '2025254026@student.annauniv.edu';

// Allowed origins
const ALLOWED_ORIGINS = [
  'https://marye-agegn.github.io',
  'http://localhost:5173',
  'http://localhost:3000',
];

// In-memory rate limiting for Edge Function (sliding window: max 5 requests per 10 minutes per IP)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_PAYLOAD_SIZE_BYTES = 32 * 1024; // 32 KB

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(identifier, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(identifier, validTimestamps);
  return false;
}

// Housekeeping: clean up stale rate limits every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, valid);
    }
  }
}, 15 * 60 * 1000);

// Basic Email RFC 5322 validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };

  // 1. CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  // 2. Reject non-POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { headers, status: 405 });
  }

  // 3. Payload size validation
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE_BYTES) {
    return new Response(JSON.stringify({ error: 'Payload Too Large' }), { headers, status: 413 });
  }

  // 4. Rate Limiting by IP
  const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'anon_client';
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { headers, status: 429 }
    );
  }

  try {
    const rawBody = await req.text();
    if (rawBody.length > MAX_PAYLOAD_SIZE_BYTES) {
      return new Response(JSON.stringify({ error: 'Payload Too Large' }), { headers, status: 413 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ error: 'Malformed JSON payload' }), { headers, status: 400 });
    }

    // 5. Strict Input Validation & Sanitization
    const name = String(payload.name || '').trim().slice(0, 100);
    const email = String(payload.email || '').trim().toLowerCase().slice(0, 150);
    const subject = String(payload.subject || '').replace(/[\r\n]/g, ' ').trim().slice(0, 200); // Strip CRLF to prevent header injection
    const message = String(payload.message || '').trim().slice(0, 5000);
    const organization = String(payload.organization || '').trim().slice(0, 150);
    const request_type = String(payload.request_type || 'General Inquiry').trim().slice(0, 100);
    const selected_service = String(payload.selected_service || '').trim().slice(0, 100);
    const submitted_at = new Date().toISOString();

    if (!name || name.length < 2) {
      return new Response(JSON.stringify({ error: 'Valid name is required (min 2 characters)' }), { headers, status: 400 });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({ error: 'A valid email address is required' }), { headers, status: 400 });
    }

    if (!message || message.length < 5) {
      return new Response(JSON.stringify({ error: 'Valid message is required (min 5 characters)' }), { headers, status: 400 });
    }

    // 6. Resend Dispatch (Server-side API call)
    if (RESEND_API_KEY) {
      const emailBody = `
New Website Inquiry / Service Request
---------------------------------------
Name: ${name}
Email: ${email}
Organization: ${organization || 'Independent'}
Request Type: ${request_type}
${selected_service ? `Selected Service: ${selected_service}` : ''}
Subject: ${subject || 'General Inquiry'}
Timestamp: ${submitted_at}

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

      if (!resendRes.ok) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email delivery provider returned an error' }),
          { headers, status: 502 }
        );
      }

      return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
    }

    // If Resend key is not configured in Supabase Secrets
    return new Response(
      JSON.stringify({
        success: true,
        notice: 'Inquiry received. Configure RESEND_API_KEY in Supabase Edge Function Secrets for email delivery.',
      }),
      { headers, status: 200 }
    );
  } catch (_error) {
    // Return safe generic error without leaking internals
    return new Response(
      JSON.stringify({ error: 'Internal server error processing notification' }),
      { headers, status: 500 }
    );
  }
});
