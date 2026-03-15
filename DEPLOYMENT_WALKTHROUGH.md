# Deployment Walkthrough

This guide will walk you through setting up your project for a unified deployment on Vercel with a Firebase backend and OpenAI for AI services.

## 1. Firebase Project Setup

1.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2.  **Enable Firestore Database:**
    *   In your Firebase project, navigate to "Firestore Database" and create a new database. Choose "Start in production mode" and select a region.

3.  **Generate a Service Account Key:**
    *   Go to "Project settings" (gear icon next to "Project overview").
    *   Click on "Service accounts".
    *   Click "Generate new private key" and then "Generate key". This will download a JSON file. **Keep this file secure!**

4.  **Configure Firebase Credentials in your Project:**
    *   **Option A (Recommended for Vercel): Environment Variable:**
        *   Open the downloaded JSON file and copy its entire content. **Ensure it's a single line, escaped if necessary, for environment variables.**
        *   On Vercel, you will add an environment variable named `FIREBASE_SERVICE_ACCOUNT` with the JSON content as its value.
    *   **Option B (Local Development - less secure for production): File Path:**
        *   Place the downloaded JSON file (e.g., `firebase-service-account.json`) in your `backend/` directory. If you do this, ensure `firebase-service-account.json` is added to your `.gitignore`.

## 2. OpenAI API Key Setup

1.  **Obtain an OpenAI API Key:**
    *   Go to the [OpenAI API Keys page](https://platform.openai.com/api-keys) and create a new secret key.

2.  **Configure OpenAI API Key in your Project:**
    *   **For local development:** Open `backend/.env` and replace `your_openai_api_key_here` with your actual OpenAI API key.
        ```
        OPENAI_API_KEY=sk-your-openai-key-here
        ```
    *   **For Vercel deployment:** Add an environment variable named `OPENAI_API_KEY` with your OpenAI API key as its value in your Vercel project settings.

## 3. Vercel Deployment

1.  **Link to GitHub:**
    *   Ensure your project is pushed to a GitHub repository.
    *   Go to [Vercel](https://vercel.com/) and create a new project. Link it to your GitHub repository.

2.  **Configure Project Settings on Vercel:**
    *   **Root Directory:** Set the root directory to your project's root (where `vercel.json` is located).
    *   **Build & Output Settings:** Vercel will automatically detect `vercel.json`. It will:
        *   Build the React frontend using `npm run build` in the `frontend/` directory.
        *   Deploy the Flask backend as a serverless function using `api/index.py`.
    *   **Environment Variables:** Add the `FIREBASE_SERVICE_ACCOUNT` and `OPENAI_API_KEY` environment variables (as described in steps 2 and 3) to your Vercel project settings. Ensure they are available for both "Build Time" and "Runtime".

3.  **Deploy:**
    *   Once configured, trigger a deployment. Vercel will build your frontend and deploy your Flask backend as unified serverless functions.

## 4. Frontend API URL Configuration

Your frontend `frontend/src/api/client.js` is already configured to use `/api` as the base URL, which is handled by Vercel's rewrites defined in `vercel.json` to route requests to your backend Flask application.

For local development, the `frontend/vite.config.js` file handles proxying `/api` requests to `http://localhost:5000`.

---