const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const endpoint = process.env.AI_COACH_ENDPOINT;
  const apiKey = process.env.AI_COACH_API_KEY;
  const provider = process.env.AI_COACH_PROVIDER ?? 'ollama';
  const defaultModel = process.env.AI_COACH_MODEL ?? 'qwen3:latest';

  if (!endpoint || (provider !== 'ollama' && !apiKey)) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'AI coach proxy is not configured. Add AI_COACH_ENDPOINT, AI_COACH_PROVIDER, and API key if the provider requires one.',
      }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body ?? '{}');
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  if (!Array.isArray(payload.messages)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'messages must be an array' }),
    };
  }

  const usesOllama = provider === 'ollama' || endpoint.includes('/api/chat');
  const upstreamBody = usesOllama
    ? {
        model: payload.model ?? defaultModel,
        messages: payload.messages,
        stream: false,
        options: { temperature: payload.temperature ?? 0.3 },
      }
    : {
        model: payload.model ?? defaultModel,
        messages: payload.messages,
        temperature: payload.temperature ?? 0.3,
      };

  const upstream = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify(upstreamBody),
  });

  const body = await upstream.text();

  return {
    statusCode: upstream.status,
    headers: {
      ...corsHeaders,
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
    },
    body,
  };
}
