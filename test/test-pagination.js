#!/usr/bin/env node

/**
 * Test script for pagination feature
 * This tests the rubocop_list_cops tool with pagination
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, '..', 'build', 'index.js');

console.log('Testing RuboCop MCP Pagination Feature...\n');

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

let buffer = '';
let messageId = 1;

server.stdout.on('data', (data) => {
  buffer += data.toString();

  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const message = JSON.parse(line);
      if (message.result && message.result.content) {
        console.log('\n' + message.result.content[0].text);
      }
    } catch (_e) {
      // Ignore non-JSON
    }
  }
});

function sendRequest(method, params) {
  const request = {
    jsonrpc: '2.0',
    id: messageId++,
    method,
    params,
  };

  server.stdin.write(JSON.stringify(request) + '\n');
}

// Wait for server to start
setTimeout(() => {
  // Initialize
  sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0',
    },
  });

  setTimeout(() => {
    console.log('=== Test 1: Get Department Summary ===');
    sendRequest('tools/call', {
      name: 'rubocop_list_cops',
      arguments: {},
    });

    setTimeout(() => {
      console.log('\n=== Test 2: Get First 10 Rails Cops ===');
      sendRequest('tools/call', {
        name: 'rubocop_list_cops',
        arguments: {
          department: 'Rails',
          limit: 10,
          offset: 0,
        },
      });

      setTimeout(() => {
        console.log('\n=== Test 3: Get Next 10 Rails Cops (offset 10) ===');
        sendRequest('tools/call', {
          name: 'rubocop_list_cops',
          arguments: {
            department: 'Rails',
            limit: 10,
            offset: 10,
          },
        });

        setTimeout(() => {
          console.log('\n=== Test 4: Get First 20 Style Cops ===');
          sendRequest('tools/call', {
            name: 'rubocop_list_cops',
            arguments: {
              department: 'Style',
              limit: 20,
              offset: 0,
            },
          });

          setTimeout(() => {
            console.log('\n=== All pagination tests completed ===');
            server.kill();
            process.exit(0);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

server.on('exit', (code) => {
  console.log(`\nServer exited with code ${code}`);
});
