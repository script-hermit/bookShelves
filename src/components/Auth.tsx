import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase';
import { FaGoogle, FaBook, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');
    setResetEmailSent(false);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <FaBook className="auth-logo" />
        <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <FaEnvelope className="auth-icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="auth-input"
          />
        </div>
        <div className="auth-field">
          <FaLock className="auth-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button
            type="button"
            className="auth-eye"
            onClick={() => setShowPassword(s => !s)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
        <button
          className="button button-secondary auth-google"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FaGoogle /> Sign in with Google
        </button>
        <div className="auth-links">
          <button
            type="button"
            className="auth-link"
            onClick={() => setIsLogin(s => !s)}
            disabled={loading}
          >
            {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
          </button>
          <button
            type="button"
            className="auth-link"
            onClick={handlePasswordReset}
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>
        {resetEmailSent && <div className="auth-success">Password reset email sent!</div>}
      </form>
    </div>
  );
}
