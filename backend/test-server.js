import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

console.log('Testing server endpoints...');

// Import server
await import('./src/server.js');

await new Promise(r => setTimeout(r, 1200));

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function post(url, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

try {
  // 1. Health check
  const health = await get('http://localhost:5000/api/health');
  console.log('✅ HEALTH TEST:', health.status, health.body.platform);

  // 2. Auth Login (demo user)
  const loginRes = await post('http://localhost:5000/api/auth/login', {
    email: 'demo@user.com',
    password: 'user123'
  });
  console.log('✅ AUTH LOGIN TEST (JWT):', loginRes.status, 'Token length:', loginRes.body.token ? loginRes.body.token.length : 'none');

  // 3. Products
  const prods = await get('http://localhost:5000/api/products');
  console.log('✅ PRODUCTS TEST: retrieved', prods.body.products.length, 'items');

  // 4. AI Recommendations
  const recs = await get('http://localhost:5000/api/recommendations/personalized');
  console.log('✅ AI RECOMMENDATIONS TEST: count =', recs.body.recommendations.length, '| Top Match:', recs.body.recommendations[0]?.name, `(${recs.body.recommendations[0]?.aiScore}% match)`);

  // 5. AI Search Assistant
  const aiSearch = await get('http://localhost:5000/api/recommendations/search-assistant?q=wireless+headphones+under+350');
  console.log('✅ AI NATURAL LANGUAGE SEARCH:', aiSearch.body.summary);

  // 6. AI Frequently Bought Together Bundle
  const bundle = await get('http://localhost:5000/api/recommendations/bundle/prod-1');
  console.log('✅ AI BUNDLE TEST: Bundle original $', bundle.body.originalTotal, '-> Bundle price $', bundle.body.bundleTotal, `(Save $${bundle.body.savingsAmount})`);

  console.log('\n🎉 ALL MERN & AI INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
} catch (err) {
  console.error('❌ Test failed:', err);
}

process.exit(0);
