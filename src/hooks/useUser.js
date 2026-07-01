import { useState } from 'react';

export default function useUser() {
	const [user, setUser] = useState(null);
	return { user, setUser };
}
