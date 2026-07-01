export async function signIn() {
	return { ok: true };
}

// Placeholder auth methods. Replace with Supabase or your backend calls.
export async function signUpWithEmail({ email, password }) {
	// In production, call Supabase Auth or your backend which will:
	// - hash the password using bcrypt (or the provider's secure method)
	// - store only the hashed password and user metadata
	// Example (Supabase): supabase.auth.signUp({ email, password })
	return { ok: true };
}

export async function signInWithEmail({ email, password }) {
	// In production, call Supabase Auth signIn which will verify password server-side
	// Example: supabase.auth.signInWithPassword({ email, password })
	return { ok: true };
}
