import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import SocialAuthButtons from '../components/SocialAuthButtons';
import TierModal from '../components/TierModal';
import '../styles/LoginSignup.css';

export default function LoginSignup() {
	const navigate = useNavigate();
	const [showTierModal, setShowTierModal] = useState(false);
	const [message, setMessage] = useState('');

	const handleAuthSubmit = () => {
		setShowTierModal(true);
	};

	const handleTierSelect = (tier) => {
		setShowTierModal(false);
		setMessage(`Selected ${tier} plan.`);
		setTimeout(() => navigate('/designer'), 900);
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
						<h1 className="auth-card__title">SIGN IN</h1>
						<p className="auth-card__subtitle">Sign in with email address</p>
						<AuthForm onSubmit={handleAuthSubmit} />
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
