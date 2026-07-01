import { useState } from 'react';

export default function useTier() {
	const [tier, setTier] = useState('free');
	return { tier, setTier };
}
