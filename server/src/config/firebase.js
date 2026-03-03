const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');
require('dotenv').config();

if (!admin.apps.length) {
  // ── Option A: service-account.json file in /server root (recommended) ──
  const keyPath = path.join(__dirname, '../../service-account.json');

  if (fs.existsSync(keyPath)) {
    const serviceAccount = require(keyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialised from service-account.json');
  }
  // ── Option B: env vars (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) ──
  else if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialised from environment variables');
  } else {
    throw new Error(
      '❌ Firebase Admin credentials not found.\n' +
      '   Place your service-account.json in the /server folder, OR\n' +
      '   set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in server/.env'
    );
  }
}

const db   = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
