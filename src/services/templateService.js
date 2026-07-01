const templatesByTier = {
	free: ['Starter Wave', 'Mini Pixel'],
	mid: ['Starter Wave', 'Mini Pixel', 'Diagonal Flow'],
	high: ['Starter Wave', 'Mini Pixel', 'Diagonal Flow', 'Full Canvas']
};

export function getTemplatesForTier(tier = 'free') {
	return templatesByTier[tier] ?? templatesByTier.free;
}
