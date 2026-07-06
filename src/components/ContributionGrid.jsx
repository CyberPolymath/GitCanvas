import { useMemo, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4
};

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatTooltip(date, level, isPast) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[date.getDay()];
  const monthName = MONTH_LABELS[date.getMonth()];
  const dayNum = date.getDate();
  const year = date.getFullYear();
  if (isPast) {
    if (level === 0) return `No contributions on ${monthName} ${dayNum}, ${year}`;
    return `Level ${level} contributions on ${dayName}, ${monthName} ${dayNum}, ${year}`;
  }
  if (level === 0) return `No target set — ${monthName} ${dayNum}, ${year}`;
  return `Target: Level ${level} on ${monthName} ${dayNum}, ${year}`;
}

function buildYearGrid(year) {
  const jan1 = new Date(year, 0, 1);
  const startDate = new Date(jan1);
  startDate.setDate(jan1.getDate() - jan1.getDay());
  const dec31 = new Date(year, 11, 31);
  const endDate = new Date(dec31);
  endDate.setDate(dec31.getDate() + (6 - dec31.getDay()));
  const days = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

export default function ContributionGrid({ githubUsername }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [plannedLevels, setPlannedLevels] = useState({});
  const [fetchedLevels, setFetchedLevels] = useState({});
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [tooltip, setTooltip] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const today = useRef(new Date());

  // Fetch contributions when username or year changes
  useEffect(() => {
    if (!githubUsername) return;
    const fetchContributions = async () => {
      setFetchingData(true);
      setFetchError('');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.provider_token;
        const query = `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionLevel
                    }
                  }
                }
              }
            }
          }
        `;
        const from = `${selectedYear}-01-01T00:00:00Z`;
        const to = `${selectedYear}-12-31T23:59:59Z`;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers,
          body: JSON.stringify({ query, variables: { username: githubUsername, from, to } })
        });
        const data = await res.json();
        if (data.errors) throw new Error(data.errors[0]?.message || 'GitHub API error');
        const weeks = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
        if (weeks.length === 0) throw new Error('No data returned');
        const levels = {};
        weeks.forEach(week => {
          week.contributionDays.forEach(day => {
            levels[day.date] = LEVEL_MAP[day.contributionLevel] ?? 0;
          });
        });
        setFetchedLevels(levels);
      } catch (err) {
        try {
          const res = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=${selectedYear}`
          );
          if (!res.ok) throw new Error('Fallback API failed');
          const data = await res.json();
          const levels = {};
          data.contributions?.forEach(entry => {
            levels[entry.date] = entry.level ?? 0;
          });
          setFetchedLevels(levels);
        } catch {
          setFetchError('Could not load contributions. Make sure your GitHub profile is public.');
        }
      } finally {
        setFetchingData(false);
      }
    };
    fetchContributions();
  }, [githubUsername, selectedYear]);

  const days = useMemo(() => buildYearGrid(selectedYear), [selectedYear]);
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) result.push(days.slice(i, i + 7));
    return result;
  }, [days]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIndex) => {
      const firstYearDay = week.find(d => d.getFullYear() === selectedYear);
      if (!firstYearDay) return;
      const month = firstYearDay.getMonth();
      if (month !== lastMonth) {
        labels.push({ month, weekIndex });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks, selectedYear]);

  const handleCellClick = (dateKey) => {
    setPlannedLevels(prev => ({
      ...prev,
      [dateKey]: ((prev[dateKey] || 0) + 1) % 5
    }));
  };

  const hasAnyPlan = Object.values(plannedLevels).some(v => v > 0);

  const handleSaveConfirm = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      // Filter only non-zero planned levels
      const nonZeroLevels = Object.fromEntries(
        Object.entries(plannedLevels).filter(([, v]) => v > 0)
      );

      const { error } = await supabase
        .from('user_plans')
        .upsert({
          user_id: user.id,
          github_username: githubUsername,
          year: selectedYear,
          planned_levels: nonZeroLevels,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,github_username,year'
        });

      if (error) throw error;

      // Clear planned levels and close modal
      setPlannedLevels({});
      setShowSaveConfirm(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      setSaveError(err.message || 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const todayKey = formatDateKey(today.current);

  return (
    <>
      {/* Private contributions banner */}
      {showBanner && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          background: 'rgba(187, 128, 9, 0.12)',
          border: '1px solid rgba(187, 128, 9, 0.25)',
          borderRadius: '10px',
          padding: '10px 16px',
          fontSize: '13px',
          color: '#e3b341',
          marginBottom: '8px'
        }}>
          <span>
            ⚠️ To display all contributions including private ones, enable{' '}
            
             <a href="https://github.com/settings/profile"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#e3b341', fontWeight: 600, textDecoration: 'underline' }}
            >
              Private Contributions in your GitHub Settings
            </a>.
          </span>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#e3b341',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1,
              padding: '0 4px',
              flexShrink: 0
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      <section className="contribution-chart-panel" aria-label="GitHub contribution chart">

        {/* Save success toast */}
        {saveSuccess && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#238636',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}>
            ✅ Plan saved successfully!
          </div>
        )}

        <div className="contribution-chart-panel__header">
          <div>
            <p className="contribution-chart-panel__eyebrow">Contribution Calendar</p>
            <h2 className="contribution-chart-panel__title">
              {githubUsername
                ? `@${githubUsername}'s contributions`
                : 'Build your year, one square at a time'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Clear button */}
            <button
              type="button"
              onClick={() => setPlannedLevels({})}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #30363d',
                background: 'transparent',
                color: '#8b949e',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#f85149';
                e.currentTarget.style.color = '#f85149';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#30363d';
                e.currentTarget.style.color = '#8b949e';
              }}
            >
              🗑 Clear Plan
            </button>

            {/* Save Plan button */}
            <button
              type="button"
              onClick={() => {
                if (!hasAnyPlan) return;
                setShowSaveConfirm(true);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: hasAnyPlan ? '#238636' : '#21262d',
                color: hasAnyPlan ? '#fff' : '#484f58',
                fontSize: '12px',
                fontWeight: 600,
                cursor: hasAnyPlan ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              💾 Save Plan
            </button>

            <label className="year-select">
              <span>Year</span>
              <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
          </div>
        </div>

        {/* Loading */}
        {fetchingData && (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            color: 'var(--muted)',
            fontSize: '14px'
          }}>
            Fetching contributions for @{githubUsername}...
          </div>
        )}

        {/* Error */}
        {fetchError && !fetchingData && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(248, 81, 73, 0.1)',
            border: '1px solid rgba(248, 81, 73, 0.3)',
            borderRadius: '8px',
            color: '#f85149',
            fontSize: '13px',
            marginBottom: '12px'
          }}>
            ⚠️ {fetchError}
          </div>
        )}

        {!fetchingData && (
          <div className="contribution-chart">
            {/* Month labels */}
            <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', marginBottom: '4px' }}>
              <div />
              <div style={{ position: 'relative', height: '18px' }}>
                {monthLabels.map(({ month, weekIndex }) => (
                  <span
                    key={month}
                    style={{
                      position: 'absolute',
                      left: `${(weekIndex / weeks.length) * 100}%`,
                      fontSize: '11px',
                      color: 'var(--muted)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {MONTH_LABELS[month]}
                  </span>
                ))}
              </div>
            </div>

            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: '4px', alignItems: 'start' }}>
              {/* Weekday labels */}
              <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gap: '3px', paddingTop: '1px' }}>
                {WEEKDAY_LABELS.map((label, i) => (
                  <span
                    key={label}
                    style={{
                      fontSize: '10px',
                      color: 'var(--muted)',
                      textAlign: 'right',
                      lineHeight: 1,
                      visibility: i % 2 === 0 ? 'visible' : 'hidden'
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Grid */}
              <div style={{ width: '100%', minWidth: 0 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
                    gridTemplateRows: 'repeat(7, 1fr)',
                    gap: '3px',
                    gridAutoFlow: 'column',
                    width: '100%',
                    aspectRatio: `${weeks.length} / 7`
                  }}
                >
                  {weeks.map((week) =>
                    week.map((day) => {
                      const dateKey = formatDateKey(day);
                      const isCurrentYear = day.getFullYear() === selectedYear;
                      const isPast = day <= today.current;
                      const isFuture = day > today.current;
                      const isToday = dateKey === todayKey;
                      const fetchedLevel = fetchedLevels[dateKey] ?? 0;
                      const plannedLevel = plannedLevels[dateKey] ?? 0;
                      const displayLevel = isPast ? fetchedLevel : plannedLevel;
                      const canClick = isCurrentYear && isFuture;

                      return (
                        <div
                          key={dateKey}
                          className={`contribution-chart__cell contribution-chart__cell--level-${isCurrentYear ? displayLevel : 0}`}
                          style={{
                            opacity: isCurrentYear ? 1 : 0.12,
                            cursor: canClick ? 'pointer' : 'default',
                            width: '100%',
                            height: '100%',
                            borderRadius: '2px',
                            outline: isToday ? '2px solid #58a6ff' : 'none',
                            outlineOffset: '1px'
                          }}
                          onClick={() => canClick && handleCellClick(dateKey)}
                          onMouseEnter={(e) => {
                            if (!isCurrentYear) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              text: formatTooltip(day, displayLevel, isPast),
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="contribution-chart__legend">
              <span>Less</span>
              <div className="contribution-chart__legend-squares">
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} className={`contribution-chart__legend-square contribution-chart__legend-square--${i}`} />
                ))}
              </div>
              <span>More</span>
              {githubUsername && (
                <span style={{ marginLeft: '12px', color: 'var(--muted)', fontSize: '11px' }}>
                  📅 Past = real GitHub data &nbsp;|&nbsp; 🎯 Future = your target
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            background: '#1b1f24',
            color: '#e6edf3',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
            border: '1px solid #30363d',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}>
            {tooltip.text}
          </div>
        )}
      </section>

      {/* Save confirmation modal */}
      {showSaveConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 500,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '16px',
            padding: '36px 32px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            animation: 'modalFadeIn 0.25s ease'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💾</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem', color: '#e6edf3' }}>
              Save your plan?
            </h2>
            <p style={{ margin: '0 0 8px', fontSize: '0.88rem', color: '#8b949e', lineHeight: 1.6 }}>
              Your contribution pattern plan for <strong style={{ color: '#e6edf3' }}>{selectedYear}</strong> will be saved.
            </p>
            <p style={{ margin: '0 0 24px', fontSize: '0.82rem', color: '#484f58' }}>
              The planned cells on the grid will be cleared after saving. You can edit your plan later from Settings.
            </p>

            {saveError && (
              <p style={{ color: '#f85149', fontSize: '13px', marginBottom: '12px' }}>
                ⚠️ {saveError}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setShowSaveConfirm(false);
                  setSaveError('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #30363d',
                  background: 'transparent',
                  color: '#8b949e',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfirm}
                disabled={saving}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#238636',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Saving...' : '✅ Yes, Save Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}