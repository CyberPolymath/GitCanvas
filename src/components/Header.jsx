export default function Header({ onSettings }) {
	return (
		<header className="app-header">
			<strong>Git Canvas</strong>
			<button type="button" onClick={onSettings}>Settings</button>
		</header>
	);
}
