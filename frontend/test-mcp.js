import http from 'http';
import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const sseUrl = 'http://***INTERNAL_HOST_REMOVED***/mcp';
const serviceKey = env.SERVICE_ROLE_KEY;

async function main() {
  console.log('Connecting to SSE endpoint with SERVICE_ROLE_KEY:', sseUrl);

  const req = http.request(sseUrl, {
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    }
  }, (res) => {
    console.log('SSE connection status:', res.statusCode);
    console.log('Headers:', res.headers);

    let postUrl = '';
    
    res.on('data', (chunk) => {
      const dataStr = chunk.toString();
      console.log('Received SSE chunk:\n', dataStr);

      const lines = dataStr.split('\n');
      let currentEvent = '';
      for (const line of lines) {
        if (line.startsWith('event:')) {
          currentEvent = line.substring(6).trim();
        } else if (line.startsWith('data:')) {
          const data = line.substring(5).trim();
          if (currentEvent === 'endpoint') {
            postUrl = data;
            console.log('Found POST endpoint:', postUrl);
            listTools(postUrl);
          }
        }
      }
    });

    res.on('end', () => {
      console.log('SSE connection closed.');
    });
  });

  req.on('error', (e) => {
    console.error('SSE connection error:', e);
  });

  req.end();
}

async function listTools(postPath) {
  const fullPostUrl = postPath.startsWith('http') 
    ? postPath 
    : new URL(postPath, sseUrl).toString();
  
  console.log('Sending tools/list request to:', fullPostUrl);

  const requestBody = JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
    id: 1
  });

  const urlObj = new URL(fullPostUrl);
  const req = http.request({
    hostname: urlObj.hostname,
    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
    path: urlObj.pathname + urlObj.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    }
  }, (res) => {
    console.log('POST status:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('POST response:');
      try {
        const parsed = JSON.parse(data);
        console.log(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log(data);
      }
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error('POST request error:', e);
  });

  req.write(requestBody);
  req.end();
}

main().catch(console.error);
