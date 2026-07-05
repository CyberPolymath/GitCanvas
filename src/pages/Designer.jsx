import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContributionGrid from '../components/ContributionGrid';
import Header from '../components/Header';
import TemplateList from '../components/TemplateList';
import '../styles/Designer.css';

export default function Designer() {
  const navigate = useNavigate();
  const [githubUsername, setGithubUsername] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Show modal after 2.5 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUsernameModal(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleUsernameSubmit = async () => {
    if (!inputValue.trim()) {
      setError('Please enter a GitHub username');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Verify username exists on GitHub
      const res = await fetch(`https://api.github.com/users/${inputValue.trim()}`);
      if (!res.ok) throw new Error('GitHub username not found');
      setGithubUsername(inputValue.trim());
      setShowUsernameModal(false);
    } catch (err) {
      setError('GitHub username not found. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleUsernameSubmit();
  };

  return (
    <main className={`page page--designer ${showUsernameModal ? 'is-blurred' : ''}`}>

      {/* Private contributions notice banner */}
      <div className="designer-notice-banner">
        <span>⚠️</span>
        <span>
          To display all your contributions including private ones, make sure
          
            <a href="https://github.com/settings/profile"
            target="_blank"
            rel="noreferrer"
          > Private Contributions is enabled in your GitHub Settings</a>.
        </span>
      </div>

      <Header onSettings={() => navigate('/settings')} />

      <section className="designer-main">
        <div className="designer-header">
          <h1>Designer</h1>
          <p className="designer-main__description">
            View your GitHub contribution history and plan your pattern. Past contributions are read-only. Click future squares to set your target shade.
          </p>
        </div>

        <ContributionGrid githubUsername={githubUsername} />

        <TemplateList tier="free" />

        <div className="designer-footer">
          <button type="button" className="designer-footer__btn">View Templates</button>
          <button type="button" className="designer-footer__btn">Save Pattern</button>
        </div>
      </section>

      {/* Username modal */}
      {showUsernameModal && (
        <div className="username-modal-overlay">
          <div className="username-modal">
            <div className="username-modal__icon">⬡</div>
            <h2 className="username-modal__title">Enter your GitHub username</h2>
            <p className="username-modal__subtitle">
              We'll fetch your contribution history and display it on the grid so you can plan your pattern on top of it.
            </p>
            <input
              className="username-modal__input"
              type="text"
              placeholder="e.g. torvalds"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {error && <p className="username-modal__error">{error}</p>}
            <button
              className="username-modal__btn"
              onClick={handleUsernameSubmit}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Load My Contributions'}
            </button>
            <button
              className="username-modal__skip"
              onClick={() => setShowUsernameModal(false)}
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}