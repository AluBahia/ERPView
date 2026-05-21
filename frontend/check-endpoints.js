import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
  }
});

const url = env.VITE_SUPABASE_URL;
const key = env.SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase endpoints at:', url);

async function test() {
  // Test 1: rest/v1/
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { 'apikey': key }
    });
    console.log('REST API status:', res.status);
    const text = await res.text();
    console.log('REST API response:', text.substring(0, 200));
  } catch (e) {
    console.error('REST API error:', e.message);
  }

  // Test 2: Admin/SQL run via postgrest or admin endpoints?
  // Let's see if we can perform a POST to /rest/v1/rpc or check schemas
}

test();
