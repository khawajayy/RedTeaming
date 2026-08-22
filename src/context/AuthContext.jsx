import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';

const AuthContext = createContext({
  user: null,
  loading: true,
  isConfigured: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  logout: async () => {},
  authError: null,
  setAuthError: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const isConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error("Auth state error:", error);
      setAuthError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured]);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      // Optional: prompt account selection
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      // Don't show an intrusive error if user simply closed the popup
      if (err.code === 'auth/popup-closed-by-user') {
        return null;
      }
      setAuthError(formatFirebaseError(err));
      throw err;
    }
  };

  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setAuthError(formatFirebaseError(err));
      throw err;
    }
  };

  const signupWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setAuthError(formatFirebaseError(err));
      throw err;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setAuthError(formatFirebaseError(err));
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isConfigured, 
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      login: loginWithEmail,
      signup: signupWithEmail,
      logout, 
      authError, 
      setAuthError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// User-friendly error message formatter
function formatFirebaseError(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled (popup closed).';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by browser. Please allow popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'Only one popup request allowed at a time.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in the Firebase Console (Auth > Settings > Authorized domains).';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled in your Firebase Console under Authentication > Sign-in method.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please try again.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    default:
      return error.message || 'An unexpected authentication error occurred.';
  }
}
