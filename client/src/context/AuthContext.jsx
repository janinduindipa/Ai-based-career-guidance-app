import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';

const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const res = await api.get('/users/profile');
          setProfile(res.data);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Sign Up with Email / Password ──
  const signup = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(cred.user, { displayName });
    // Create user doc in Firestore
    await api.post('/auth/register');
    return cred.user;
  };

  // ── Sign In with Email / Password ──
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data);
    } catch {
      setProfile(null);
    }
    return cred.user;
  };

  // ── Sign In with Google ──
  const googleSignIn = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    // Create Firestore doc if first time
    await api.post('/auth/register');
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data);
    } catch {
      setProfile(null);
    }
    return cred.user;
  };

  // ── Logout ──
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  // ── Password Reset ──
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // ── Refresh profile after update ──
  const refreshProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data);
      return res.data;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signup, login, googleSignIn, logout, resetPassword, refreshProfile }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
