// someComponent.js
import admin from "firebase-admin";

let initialized = false;

try {
  const firebaseAdminJson = process.env.FIREBASE_ADMIN_JSON;
  if (!firebaseAdminJson) {
    throw new Error("FIREBASE_ADMIN_JSON environment variable is not set.");
  }

  if (!initialized) {
    // Initialize Firebase Admin SDK only if it hasn't been initialized before
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(firebaseAdminJson)),
    });
    initialized = true;
  }
} catch (err) {
  console.error("Firebase initialization error:", err);
}

export default admin;
