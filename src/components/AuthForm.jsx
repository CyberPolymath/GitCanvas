export default function AuthForm({ onSubmit }) {
	return (
		<form
			className="auth-form"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit?.();
			}}
		>
			<input 
				type="email" 
				placeholder="yourname@gmail.com"
				required
			/>
			<input 
				type="password" 
				placeholder="Password"
				required
			/>
			<button type="submit" className="auth-form__submit">Sign up</button>
		</form>
	);
}
