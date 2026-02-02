import "server-only"

import * as admin from 'firebase-admin'

interface FirebaseAdminConfig {
  projectId: string
  clientEmail: string
  privateKey: string
}

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n')
}

export function createFirebaseAdminApp(params: FirebaseAdminConfig) {
  const privateKey = formatPrivateKey(params.privateKey)

  if (admin.apps.length > 0) {
    return admin.app()
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  })

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
  })
}

export async function initAdmin() {
  const params = {
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
  }

  return createFirebaseAdminApp(params)
}

// Initialize and export commonly used services
// Note: We wrap these in a getter or checks to ensure initAdmin is called or vars are present
// But since this is a module, we can just initialize if we assume env vars are present.
// For safety in dev vs prod, we can do a lazy initialization pattern if strictly needed,
// but usually initializing at module level in a server-only file is okay if envs are loaded.

const app = admin.apps.length > 0 ? admin.app() : initAdmin()
// Cast app to any because initAdmin returns a Promise<App> but if it's already init it returns App
// Actually, let's just make it simple.

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    // throw new Error("Missing Firebase Admin Environment Variables")
    // We suppress error here to prevent build failures if envs aren't present at build time
    // but operations will fail at runtime.
    console.error("Missing Firebase Admin Environment Variables")
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formatPrivateKey(privateKey),
      }),
    })
  }
}

export const adminDb = admin.firestore()
export const adminAuth = admin.auth()
