import { useState } from 'react';
import { signUpWithEmail, signInWithEmail, signUpWithPhone, signInWithPhone } from '../services/authService';

export default function AuthForm({ mode = 'signup', method = 'email', onSubmit }) {
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			if (method === 'email') {
				if (mode === 'signup') {
					if (!email || !password || password !== confirm) throw new Error('Provide matching passwords');
					await signUpWithEmail({ email, password });
				} else {
					if (!email || !password) throw new Error('Provide email and password');
					await signInWithEmail({ email, password });
				}
			} else {
				// phone flow (placeholder)
				if (mode === 'signup') {
					if (!phone || !password) throw new Error('Provide phone and password');
					await signUpWithPhone({ phone, password });
				} else {
					if (!phone || !password) throw new Error('Provide phone and password');
					await signInWithPhone({ phone, password });
				}
			}

			onSubmit?.();
		} catch (err) {
			setError(err.message || 'Auth error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			{method === 'email' ? (
				<input type="email" placeholder="yourname@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
			) : (
				<input type="tel" placeholder="+1 555 555 5555" value={phone} onChange={(e) => setPhone(e.target.value)} required />
			)}

			<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

			{mode === 'signup' && (
				<input type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
			)}

			{error && <div className="auth-error">{error}</div>}

			<button type="submit" className="auth-form__submit" disabled={loading}>
				{loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
			</button>
		</form>
	);
}
