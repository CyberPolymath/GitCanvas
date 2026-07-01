import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import SocialAuthButtons from '../components/SocialAuthButtons';
import TierModal from '../components/TierModal';
import { resendSignupVerification } from '../services/authService';
import '../styles/LoginSignup.css';

export default function LoginSignup() {
	const navigate = useNavigate();
	const [showTierModal, setShowTierModal] = useState(false);
	const [message, setMessage] = useState('');
	const [verificationEmail, setVerificationEmail] = useState('');

	const handleAuthSubmit = ({ mode, email, verificationRequired }) => {
		if (mode === 'signup' && verificationRequired) {
			setVerificationEmail(email);
			setMessage('Verification email sent. Please confirm your email before signing in.');
			return;
		}

		setMessage('Signed in successfully.');
		setShowTierModal(true);
	};

	const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin'

	const handleTierSelect = (tier) => {
		setShowTierModal(false);
		setMessage(`Selected ${tier} plan.`);
		setTimeout(() => navigate('/designer'), 900);
	};

	const handleResendVerification = async () => {
		if (!verificationEmail) return;
		try {
			await resendSignupVerification(verificationEmail);
			setMessage('Verification email resent. Please check your inbox.');
		} catch (err) {
			setMessage(err.message || 'Could not resend verification email.');
		}
	};

	return (
		<main className={`page page--auth ${showTierModal ? 'is-blurred' : ''}`}>
			<div className="auth-container">
				{/* Decorative cosmic elements */}
				<div className="cosmic-bg">
					<div className="cosmic-orb cosmic-orb--1"></div>
					<div className="cosmic-orb cosmic-orb--2"></div>
					<div className="cosmic-orb cosmic-orb--3"></div>
					<div className="stars"></div>
				</div>

				{/* Left hero section */}
				<section className="auth-hero">
					<h1 className="auth-hero__title">SIGN IN TO YOUR</h1>
					<h2 className="auth-hero__subtitle">ADVENTURE</h2>
					<p className="auth-hero__description">
						Design patterns on your GitHub contribution graph and earn every square through real commits.
					</p>
				</section>

				{/* Right form section */}
				<section className="auth-form-section">
					<div className="auth-card">
						<div className="auth-card__modes">
							<button
								className={`mode-btn ${authMode === 'signup' ? 'active' : ''}`}
								onClick={() => setAuthMode('signup')}
							>
								Sign up
							</button>
							<button
								className={`mode-btn ${authMode === 'signin' ? 'active' : ''}`}
								onClick={() => setAuthMode('signin')}
							>
								Sign in
							</button>
						</div>

						<h1 className="auth-card__title">{authMode === 'signup' ? 'Create account' : 'SIGN IN'}</h1>
						<p className="auth-card__subtitle">{authMode === 'signup' ? 'Create a new account' : 'Sign in with your account'}</p>

						<AuthForm mode={authMode} onSubmit={handleAuthSubmit} />
						{verificationEmail ? (
							<div className="verification-box">
								<p>Verification pending for <strong>{verificationEmail}</strong>.</p>
								<button type="button" className="verification-btn" onClick={handleResendVerification}>
									Resend verification email
								</button>
							</div>
						) : null}
						<div className="auth-divider">Or continue with</div>
						<SocialAuthButtons />
						<p className="auth-card__footer">
							By registering you with our <a href="#">Terms and Conditions</a>
						</p>
					</div>
				</section>
			</div>

			{showTierModal ? <TierModal onSelect={handleTierSelect} /> : null}
			{message ? <div className="toast">{message}</div> : null}
		</main>
	);
}
