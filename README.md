# 🛡️ 6-Month AI Red Teaming Roadmap | Live Interactive Kanban

A modern, secure, full-stack single-page React Kanban dashboard designed to track progress across a 6-month hands-on AI Red Teaming curriculum. Built with React (Vite), Tailwind CSS, Firebase Authentication (Google Sign-In & Email/Password), Cloud Firestore (with real-time `onSnapshot` syncing and security rules), and `@dnd-kit/core` drag-and-drop.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide-React
- **Backend & Database**: Firebase Authentication (Google Sign-In & Email/Password), Cloud Firestore (Real-time `onSnapshot` & Batch Writes)
- **State & Drag-and-Drop**: `@dnd-kit/core`
- **Security**: Granular Firestore Security Rules with UID-based multi-tenant isolation

---

## 📋 Features

1. **Secure Authentication & Auth Guard**:
   - One-click **Google Sign-In** with Google OAuth 2.0.
   - User profile avatar and display name integration.
   - Protected dashboard with `AuthGuard`.
2. **Interactive 3-Column Kanban Board**:
   - Columns: **To Do**, **In Progress**, and **Completed**.
   - Smooth drag-and-drop powered by `@dnd-kit/core` with live drag overlay.
   - Card details: Month/Week tag, Focus Area, Key Concepts & Tools pills, and Action Item / Deliverable callouts.
   - Quick one-click status transition buttons for mobile and fast keyboard interaction.
3. **Real-Time Firestore Sync**:
   - Immediate UI feedback and instant cloud sync via `onSnapshot` and `updateDoc`.
4. **Automated 24-Milestone Database Seeding**:
   - One-click batch write (`writeBatch`) utility populating all 24 curated milestones on first login or via the navbar.
   - Includes reset protection and duplicate prevention.
5. **Campaign Analytics & Filtering**:
   - Month filter tabs (Month 1 through Month 6).
   - Real-time search across focus areas, concepts, tools, and deliverables.
   - Visual progress ring and completion pipeline stats.

---

## 📦 Quick Start & Terminal Setup Commands

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/khawajayy/RedTeaming.git
cd RedTeaming

# Install dependencies
npm install
```

### 2. Configure Firebase

1. Head to the [Firebase Console](https://console.firebase.google.com/) and create a new Firebase project.
2. Under **Build > Authentication**, go to **Sign-in method** tab and enable **Google** (add your project support email and save). *(Optionally also enable Email/Password)*.
3. Under **Build > Firestore Database**, create a database in production mode.
4. Go to **Project Settings > General > Your apps** and register a **Web App** `</>`.
5. Copy your credentials into a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 3. Deploy Firestore Security Rules

In your Firebase Console, navigate to **Firestore Database > Rules** tab, and paste the contents of `firestore.rules`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile and isolated roadmap milestone subcollection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /roadmap/{milestoneId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Direct collection fallback
    match /roadmap/{milestoneId} {
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and click **"Continue with Google"**.

### 5. Build for Production

```bash
npm run build
```
