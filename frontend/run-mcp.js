import { spawn } from 'child_process';
import readline from 'readline';

const token = process.env.SUPABASE_ACCESS_TOKEN || '***SUPABASE_PAT_REMOVED***';

async function callMcp(args, method, params = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Spawning MCP server with args: ${args.join(' ')}`);
    const proc = spawn('npx', ['-y', '@supabase/mcp-server-supabase@latest', ...args], {
      shell: true,
      env: {
        ...process.env,
        SUPABASE_ACCESS_TOKEN: token
      }
    });

    const rl = readline.createInterface({
      input: proc.stdout,
      terminal: false
    });

    let isInitialized = false;
    let requestId = 1;
    let pendingRequests = new Map();

    proc.stderr.on('data', (data) => {
      console.warn(`[MCP Server Stderr] ${data.toString().trim()}`);
    });

    rl.on('line', (line) => {
      // console.log(`[MCP Server Stdout] ${line}`);
      try {
        const msg = JSON.parse(line);
        if (msg.method === 'notifications/initialized' || (msg.id === 0 && msg.result)) {
          if (!isInitialized) {
            isInitialized = true;
            // Send request
            const req = {
              jsonrpc: '2.0',
              id: requestId,
              method: method,
              params: params
            };
            // console.log('Sending request:', req);
            proc.stdin.write(JSON.stringify(req) + '\n');
          }
        } else if (msg.id !== undefined) {
          // Response
          resolve(msg);
          proc.kill();
        }
      } catch (err) {
        console.error('Failed to parse line:', line, err);
      }
    });

    proc.on('close', (code) => {
      // console.log(`MCP server process exited with code ${code}`);
    });

    // Send initialize request
    const initReq = {
      jsonrpc: '2.0',
      id: 0,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    };
    proc.stdin.write(JSON.stringify(initReq) + '\n');
  });
}

async function main() {
  // First, list tools to check connectivity and list projects
  try {
    const listRes = await callMcp([], 'tools/list', {});
    console.log('List Tools Response:', JSON.stringify(listRes, null, 2));

    const projectsRes = await callMcp([], 'tools/call', {
      name: 'list_projects',
      arguments: {}
    });
    console.log('List Projects Response:', JSON.stringify(projectsRes, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
