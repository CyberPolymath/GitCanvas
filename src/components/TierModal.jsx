export default function TierModal({ onSelect }) {
	return (
		<div className="tier-modal">
			<div className="tier-modal__panel">
				<h2>Select a plan</h2>
				<button type="button" onClick={() => onSelect?.('free')}>Free Tier</button>
				<button type="button" onClick={() => onSelect?.('mid')}>Mid Tier</button>
				<button type="button" onClick={() => onSelect?.('high')}>High Tier</button>
			</div>
		</div>
	);
}
