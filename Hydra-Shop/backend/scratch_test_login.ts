import { config } from 'dotenv';
import { join } from 'node:path';

// Local-only credentials live in the gitignored project-root .env.local / .env
config({ path: join(__dirname, '..', '.env.local') });
config({ path: join(__dirname, '..', '.env') });

async function main() {
  const url = 'http://127.0.0.1:3002/api/v1/auth/admin-login';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error(
      'Missing ADMIN_EMAIL / ADMIN_PASSWORD — add them to Hydra-Shop/.env.local',
    );
    return;
  }
  const body = { email, password };

  console.log('Sending request to:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
