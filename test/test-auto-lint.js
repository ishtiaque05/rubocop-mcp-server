#!/usr/bin/env node

/**
 * Test script for auto-lint feature
 * This tests the rubocop_set_auto_lint and rubocop_get_auto_lint_status tools
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, '..', 'build', 'index.js');

console.log('Testing RuboCop MCP Auto-Lint Feature...\n');

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
      console.log('Server response:', JSON.stringify(message, null, 2));
    } catch (_e) {
      console.log('Non-JSON output:', line);
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

  console.log('\nSending request:', JSON.stringify(request, null, 2));
  server.stdin.write(JSON.stringify(request) + '\n');
}

// Wait a bit for server to start
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
    // List tools to verify new tools are present
    console.log('\n=== Testing: List Tools ===');
    sendRequest('tools/list', {});

    setTimeout(() => {
      // Test 1: Get initial status (should be disabled)
      console.log('\n=== Test 1: Get Initial Auto-Lint Status ===');
      sendRequest('tools/call', {
        name: 'rubocop_get_auto_lint_status',
        arguments: {},
      });

      setTimeout(() => {
        // Test 2: Enable auto-lint
        console.log('\n=== Test 2: Enable Auto-Lint ===');
        sendRequest('tools/call', {
          name: 'rubocop_set_auto_lint',
          arguments: {
            enabled: true,
          },
        });

        setTimeout(() => {
          // Test 3: Check status after enabling
          console.log('\n=== Test 3: Get Status After Enabling ===');
          sendRequest('tools/call', {
            name: 'rubocop_get_auto_lint_status',
            arguments: {},
          });

          setTimeout(() => {
            // Test 4: Enable with auto-correction
            console.log('\n=== Test 4: Enable Auto-Lint with Auto-Correction ===');
            sendRequest('tools/call', {
              name: 'rubocop_set_auto_lint',
              arguments: {
                enabled: true,
                auto_correct: true,
              },
            });

            setTimeout(() => {
              // Test 5: Check status with auto-correction
              console.log('\n=== Test 5: Get Status with Auto-Correction ===');
              sendRequest('tools/call', {
                name: 'rubocop_get_auto_lint_status',
                arguments: {},
              });

              setTimeout(() => {
                // Test 6: Disable auto-lint
                console.log('\n=== Test 6: Disable Auto-Lint ===');
                sendRequest('tools/call', {
                  name: 'rubocop_set_auto_lint',
                  arguments: {
                    enabled: false,
                  },
                });

                setTimeout(() => {
                  // Test 7: Final status check
                  console.log('\n=== Test 7: Final Status Check ===');
                  sendRequest('tools/call', {
                    name: 'rubocop_get_auto_lint_status',
                    arguments: {},
                  });

                  setTimeout(() => {
                    console.log('\n=== All tests completed ===');
                    server.kill();
                    process.exit(0);
                  }, 1000);
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

server.on('exit', (code) => {
  console.log(`\nServer exited with code ${code}`);
});
