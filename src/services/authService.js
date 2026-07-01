import { supabase } from '../lib/supabaseClient';

export async function signUpWithEmail({ email, password }) {
	const redirectTo = `${window.location.origin}/`;
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: { emailRedirectTo: redirectTo }
	});

	if (error) throw error;

	return {
		user: data.user,
		session: data.session,
		verificationRequired: !data.session
	};
}

export async function signInWithEmail({ email, password }) {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw error;
	return data;
}

export async function getCurrentSession() {
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	return data.session;
}

export async function resendSignupVerification(email) {
	const { data, error } = await supabase.auth.resend({
		type: 'signup',
		email,
		options: { emailRedirectTo: `${window.location.origin}/` }
	});

	if (error) throw error;
	return data;
}
