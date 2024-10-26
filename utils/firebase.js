// firebase.js
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = {
    type: "service_account",
    project_id: "muni-ci-pa-lity-project",
    private_key_id: process.env.FIREBASE_PROJECT_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PROJECT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: "110044808801896075804",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-bvxbc%40easyinsurance-155c5.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

if (!admin.apps.length) {  // Prevent re-initialization if already initialized
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

module.exports = { admin, db };
