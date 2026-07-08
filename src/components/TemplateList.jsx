const templatesByTier = {
	free: ['Will be added soon'],
	mid: ['Starter Wave', 'Mini Pixel', 'Diagonal Flow'],
	high: ['Starter Wave', 'Mini Pixel', 'Diagonal Flow', 'Full Canvas']
};

export default function TemplateList({ tier = 'free' }) {
	const templates = templatesByTier[tier] ?? templatesByTier.free;

	return (
		<section className="template-list">
			<h2>Templates</h2>
			<ul>
				{templates.map((template) => (
					<li key={template}>{template}</li>
				))}
			</ul>
		</section>
	);
}
