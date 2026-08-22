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

const GUEST_STORAGE_KEY = 'redteam_guest_user';

const AuthContext = createContext({
  user: null,
  loading: true,
  isConfigured: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginAsGuest: () => {},
  logout: async () => {},
  authError: null,
  setAuthError: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const isConfigured = isFirebaseConfigured() && Boolean(auth);

  useEffect(() => {
    // Check if user was previously in guest/demo mode
    const storedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
    if (storedGuest) {
      try {
        setUser(JSON.parse(storedGuest));
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
    }

    if (!isConfigured || !auth) {
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

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isConfigured]);

  const loginAsGuest = (customName = 'Red Team Operator') => {
    setAuthError(null);
    const guestUser = {
      uid: 'guest-operator',
      displayName: customName,
      email: 'guest@redteam.local',
      isGuest: true,
      photoURL: null
    };
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    } catch (e) {
      console.warn('LocalStorage unavailable for guest user');
    }
    setUser(guestUser);
    return guestUser;
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    if (!isConfigured || !auth) {
      // If Firebase not configured, fallback gracefully to guest mode
      return loginAsGuest('Google Operator (Demo)');
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return result.user;
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        return null;
      }
      setAuthError(formatFirebaseError(err));
      throw err;
    }
  };

  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    if (!isConfigured || !auth) {
      const name = email.split('@')[0] || 'Operator';
      return loginAsGuest(`${name} (Demo)`);
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return userCredential.user;
    } catch (err) {
      setAuthError(formatFirebaseError(err));
      throw err;
    }
  };

  const signupWithEmail = async (email, password) => {
    setAuthError(null);
    if (!isConfigured || !auth) {
      const name = email.split('@')[0] || 'Operator';
      return loginAsGuest(`${name} (Demo)`);
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return userCredential.user;
    } catch (err) {
      setAuthError(formatFirebaseError(err));
      throw err;
    }
  };

  const logout = async () => {
    setAuthError(null);
    localStorage.removeItem(GUEST_STORAGE_KEY);
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        setAuthError(formatFirebaseError(err));
      }
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isConfigured, 
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      loginAsGuest,
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
