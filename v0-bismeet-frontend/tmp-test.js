const fs = require('fs');
async function test() {
  const base64 = Buffer.from('Testing').toString('base64');
  const res = await fetch('http://localhost:3000/api/embed-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, docId: '123' })
  });
  const text = await res.text();
  console.log('STATUS:', res.status);
  console.log('BODY:', text.substring(0, 500));
}
test();
