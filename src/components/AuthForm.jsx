export default function AuthForm({ onSubmit }) {
	return (
		<form
			className="auth-form"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit?.();
			}}
		>
			<input type="text" placeholder="Email or phone number" />
			<input type="password" placeholder="Password" />
			<button type="submit">Continue</button>
		</form>
	);
}
