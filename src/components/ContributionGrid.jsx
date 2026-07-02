import { useMemo, useState } from 'react';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CONTRIBUTION_LEVELS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const YEARS = Array.from({ length: 6 }, (_, index) => new Date().getFullYear() - index);

function getStartOfWeek(date) {
	const copy = new Date(date);
	const day = (copy.getDay() + 6) % 7;
	copy.setDate(copy.getDate() - day);
	copy.setHours(0, 0, 0, 0);
	return copy;
}

function getEndOfWeek(date) {
	const copy = new Date(date);
	const day = (copy.getDay() + 6) % 7;
	copy.setDate(copy.getDate() + (6 - day));
	copy.setHours(0, 0, 0, 0);
	return copy;
}

function formatDateKey(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function formatDateDisplay(date) {
	const dayOfMonth = date.getDate();
	const monthName = MONTH_LABELS[date.getMonth()];
	
	// Format ordinal suffix (1st, 2nd, 3rd, etc)
	let suffix = 'th';
	if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) suffix = 'st';
	else if (dayOfMonth === 2 || dayOfMonth === 22) suffix = 'nd';
	else if (dayOfMonth === 3 || dayOfMonth === 23) suffix = 'rd';
	
	return `${dayOfMonth}${suffix} ${monthName}`;
}

function getLevel(clickCount) {
	if (clickCount >= 4) return 4;
	if (clickCount === 3) return 3;
	if (clickCount === 2) return 2;
	if (clickCount === 1) return 1;
	return 0;
}

function buildYearGrid(year) {
	const startDate = getStartOfWeek(new Date(year, 0, 1));
	const endDate = getEndOfWeek(new Date(year, 11, 31));
	const days = [];
	const clickCounts = {};

	for (let current = new Date(startDate); current <= endDate; current.setDate(current.getDate() + 1)) {
		const cellDate = new Date(current);
		const key = formatDateKey(cellDate);
		days.push(cellDate);
		clickCounts[key] = 0;
	}

	return { days, clickCounts };
}

export default function ContributionGrid() {
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [clickCountsByYear, setClickCountsByYear] = useState(() => {
		const initialState = {};
		YEARS.forEach((year) => {
			initialState[year] = buildYearGrid(year).clickCounts;
		});
		return initialState;
	});

	const { days } = useMemo(() => buildYearGrid(selectedYear), [selectedYear]);
	const clickCounts = clickCountsByYear[selectedYear] ?? {};
	const monthPositions = useMemo(() => {
		const positions = [];
		let lastMonth = -1;

		days.forEach((day, index) => {
			const month = day.getMonth();
			if (month !== lastMonth) {
				positions.push({ month, index });
				lastMonth = month;
			}
		});

		return positions;
	}, [days]);

	const handleCellClick = (dateKey) => {
		setClickCountsByYear((previous) => {
			const yearState = previous[selectedYear] ?? {};
			const currentCount = yearState[dateKey] ?? 0;
			return {
				...previous,
				[selectedYear]: {
					...yearState,
					[dateKey]: Math.min(currentCount + 1, CONTRIBUTION_LEVELS.length - 1)
				}
			};
		});
	};

	return (
		<section className="contribution-chart-panel" aria-label="GitHub contribution chart">
			<div className="contribution-chart-panel__header">
				<div>
					<p className="contribution-chart-panel__eyebrow">Contribution calendar</p>
					<h2 className="contribution-chart-panel__title">Build your year, one square at a time</h2>
				</div>
				<label className="year-select">
					<span>Year</span>
					<select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>
						{YEARS.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</label>
			</div>

			<div className="contribution-chart">
				<div className="contribution-chart__months" aria-hidden="true">
					<div className="contribution-chart__month-spacer" />
					{monthPositions.map(({ month, index }) => (
						<span
							key={MONTH_LABELS[month]}
							className="contribution-chart__month"
							style={{ gridColumnStart: index + 2 }}
						>
							{MONTH_LABELS[month]}
						</span>
					))}
				</div>

				<div className="contribution-chart__body">
					<div className="contribution-chart__weekdays" aria-hidden="true">
						{WEEKDAY_LABELS.map((label) => (
							<span key={label}>{label}</span>
						))}
					</div>

					<div className="contribution-chart__grid" role="grid" aria-label={`Contribution chart for ${selectedYear}`}>
						{days.map((day) => {
							const dateKey = formatDateKey(day);
							const clickCount = clickCounts[dateKey] ?? 0;
							const level = getLevel(clickCount);
							const dateDisplay = formatDateDisplay(day);
							return (
								<button
									key={dateKey}
									type="button"
									className={`contribution-chart__cell contribution-chart__cell--level-${level}`}
									onClick={() => handleCellClick(dateKey)}
									aria-label={`${dateDisplay}, ${clickCount} click${clickCount === 1 ? '' : 's'}`}
									title={`${dateDisplay} - ${clickCount} click${clickCount === 1 ? '' : 's'}`}
								/>
							);
						})}
					</div>
				</div>

				<div className="contribution-chart__legend" aria-hidden="true">
					<span>Less</span>
					<div className="contribution-chart__legend-squares">
						{CONTRIBUTION_LEVELS.map((level, index) => (
							<span key={level} className={`contribution-chart__legend-square contribution-chart__legend-square--${index}`} />
						))}
					</div>
					<span>More</span>
				</div>
			</div>
		</section>
	);
}
