import { useState } from 'react';
import { signUpWithEmail, signInWithEmail } from '../services/authService';

export default function AuthForm({ mode = 'signup', onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!email || !password || password !== confirm)
          throw new Error('Provide matching passwords');
        const result = await signUpWithEmail({ email, password });
        onSubmit?.({ mode, email, verificationRequired: result.verificationRequired });
      } else {
        if (!email || !password)
          throw new Error('Provide email and password');
        await signInWithEmail({ email, password });
        onSubmit?.({ mode, email, verificationRequired: false });
      }
    } catch (err) {
      setError(err.message || 'Auth error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="yourname@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {mode === 'signup' && (
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      )}
      {error && <div className="auth-error">{error}</div>}
      <button type="submit" className="auth-form__submit" disabled={loading}>
        {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>
    </form>
  );
}