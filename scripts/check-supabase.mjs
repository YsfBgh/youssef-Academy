import { readFileSync, existsSync } from 'node:fs';
import https from 'node:https';

function readEnvFile() {
  if (!existsSync('.env')) return {};

  return readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .reduce((env, line) => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (!match) return env;
      env[match[1].trim()] = match[2].trim();
      return env;
    }, {});
}

function request(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'GET', headers }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

const fileEnv = readEnvFile();
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? fileEnv.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? fileEnv.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
  process.exitCode = 1;
} else {
  const endpoint = new URL('/rest/v1/profiles?select=id&limit=1', supabaseUrl);
  const response = await request(endpoint, {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  });

  if (response.statusCode < 200 || response.statusCode >= 300) {
    console.error(`Supabase profiles check failed: HTTP ${response.statusCode}`);
    console.error(response.body);
    console.error('Run supabase/schema.sql in the Supabase SQL Editor, then run this check again.');
    process.exitCode = 1;
  } else {
    console.log('Supabase profiles table is reachable.');
  }
}
