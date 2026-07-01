import Header from '../components/Header';
import '../styles/Settings.css';

export default function Settings() {
	return (
		<main className="page page--settings">
			<Header />
			<section className="settings-shell">
				<h1>Settings</h1>
				<p>Profile, plan, notifications, and connected accounts will live here.</p>
			</section>
		</main>
	);
}
