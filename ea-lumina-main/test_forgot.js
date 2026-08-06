async function test() {
  const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test_1779239139372@test.com' }),
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Data:', data);
}
test();
