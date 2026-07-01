export default function ContributionGrid() {
	return (
		<div className="contribution-grid" aria-label="GitHub contribution grid">
			{Array.from({ length: 28 }).map((_, index) => (
				<span key={index} className="contribution-grid__cell" />
			))}
		</div>
	);
}
