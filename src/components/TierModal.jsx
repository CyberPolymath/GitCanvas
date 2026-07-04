import styles from '../styles/components/TierModal.module.css';

export default function TierModal({ onSelect }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Select a Plan</h2>
        <p className={styles.subtitle}>Choose how you want to be reminded to earn your green squares</p>

        <div className={styles.cards}>

          {/* Free Tier */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.icon}>⬡</div>
              <h3 className={styles.tierName}>Free</h3>
              <p className={styles.tagline}>Get started</p>
              <div className={styles.price}>
                <span className={styles.amount}>₹0</span>
              </div>
              <button
                className={styles.btnOutline}
                onClick={() => onSelect?.('free')}
              >
                Use for free
              </button>
            </div>
            <ul className={styles.features}>
              <li>✓ Visual pattern designer</li>
              <li>✓ Day-specific commit targets</li>
              <li>✓ Web push notifications</li>
              <li>✓ 5 free pattern templates</li>
              <li>✓ Basic progress dashboard</li>
            </ul>
          </div>

          {/* Mid Tier */}
          <div className={`${styles.card} ${styles.cardFeatured}`}>
            <div className={styles.featuredBadge}>Popular</div>
            <div className={styles.cardTop}>
              <div className={styles.icon}>⬡</div>
              <h3 className={styles.tierName}>Mid</h3>
              <p className={styles.tagline}>Stay consistent</p>
              <div className={styles.price}>
                <span className={styles.amount}>₹49</span>
                <span className={styles.period}> / month</span>
              </div>
              <button
                className={styles.btnFilled}
                onClick={() => onSelect?.('mid')}
              >
                Get Mid plan
              </button>
            </div>
            <ul className={styles.features}>
              <li>✓ Everything in Free</li>
              <li>✓ SMS reminders</li>
              <li>✓ 20+ pattern templates</li>
              <li>✓ Midday check-in alerts</li>
              <li>✓ Missed day recalculation</li>
            </ul>
          </div>

          {/* High Tier */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.icon}>⬡</div>
              <h3 className={styles.tierName}>High</h3>
              <p className={styles.tagline}>Never miss a day</p>
              <div className={styles.price}>
                <span className={styles.amount}>₹99</span>
                <span className={styles.period}> / month</span>
              </div>
              <button
                className={styles.btnOutline}
                onClick={() => onSelect?.('high')}
              >
                Get High plan
              </button>
            </div>
            <ul className={styles.features}>
              <li>✓ Everything in Mid</li>
              <li>✓ Daily wake-up call reminder</li>
              <li>✓ SMS + Call both</li>
              <li>✓ All pattern templates</li>
              <li>✓ Priority support</li>
            </ul>
          </div>

        </div>
        <p className={styles.footer}>Plans and prices are subject to change.</p>
      </div>
    </div>
  );
}