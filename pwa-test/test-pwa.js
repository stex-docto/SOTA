#!/usr/bin/env node

/**
 * Simple PWA testing script
 * Tests basic PWA functionality locally
 */

import http from 'http';
import { parse } from 'url';

const PWA_URL = 'http://127.0.0.1:4173';

async function testPWA() {
  console.log('🔍 Testing PWA functionality...\n');

  const tests = [
    {
      name: 'Root Redirect',
      path: '/',
      expectedStatus: 301,
      expectedContentType: 'text/html'
    },
    {
      name: 'Main App',
      path: '/SOTA/',
      expectedStatus: 200,
      expectedContentType: 'text/html'
    },
    {
      name: 'Service Worker',
      path: '/SOTA/sw.js',
      expectedStatus: 200,
      expectedContentType: 'application/javascript'
    },
    {
      name: 'PWA Manifest',
      path: '/SOTA/manifest.webmanifest',
      expectedStatus: 200,
      expectedContentType: 'application/manifest+json'
    },
    {
      name: 'SPA Routing (should fallback to index.html)',
      path: '/SOTA/some-spa-route',
      expectedStatus: 200,
      expectedContentType: 'text/html'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await httpGet(PWA_URL + test.path);
      
      if (result.statusCode === test.expectedStatus) {
        console.log(`✅ ${test.name}: Status ${result.statusCode} ✓`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: Expected ${test.expectedStatus}, got ${result.statusCode}`);
        failed++;
      }
      
      // Check content type if specified
      if (test.expectedContentType) {
        const contentType = result.headers['content-type'] || '';
        if (contentType.includes(test.expectedContentType)) {
          console.log(`   Content-Type: ${contentType} ✓`);
        } else {
          console.log(`   ⚠️  Content-Type: Expected ${test.expectedContentType}, got ${contentType}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
    
    console.log('');
  }

  console.log(`📊 Test Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('🎉 All PWA tests passed!');
    console.log('\n🔧 Next steps:');
    console.log('   1. Open http://127.0.0.1:4173 in Chrome');
    console.log('   2. Check DevTools > Application > Service Workers');
    console.log('   3. Test offline mode in Network tab');
    console.log('   4. Try installing the PWA (Chrome menu > Install SOTA)');
  } else {
    console.log('❌ Some tests failed. Check your PWA server configuration.');
    process.exit(1);
  }
}

function httpGet(requestUrl) {
  return new Promise((resolve, reject) => {
    const parsedUrl = parse(requestUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Run the tests
testPWA().catch((error) => {
  console.error('❌ PWA test failed:', error);
  process.exit(1);
});

export { testPWA };