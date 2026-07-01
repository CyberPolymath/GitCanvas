import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import SocialAuthButtons from '../components/SocialAuthButtons';
import TierModal from '../components/TierModal';
import '../styles/LoginSignup.module.css';

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
		<main className="page page--auth">
			<section className={`auth-shell ${showTierModal ? 'is-blurred' : ''}`}>
				<h1>Git Canvas</h1>
				<p>Sign in to design and track your contribution pattern.</p>
				<AuthForm onSubmit={handleAuthSubmit} />
				<SocialAuthButtons />
			</section>

			{showTierModal ? <TierModal onSelect={handleTierSelect} /> : null}
			{message ? <div className="toast">{message}</div> : null}
		</main>
	);
}
