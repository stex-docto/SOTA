import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="home-page">
      {!currentUser && (
        <div className="hero-section">
          <h1>Welcome to SOTA</h1>
          <p className="hero-description">
            Simple Open Talk App - Organize and participate in open talk sessions. Share your knowledge, 
            learn from others, and build a vibrant community of speakers and learners.
          </p>
          
          <div className="action-boxes">
            <div className="action-box participate">
              <div className="action-glow participate-glow"></div>
              <div className="action-content">
                <h3><span className="action-icon">👥</span> Join an Event</h3>
                <p>Got an event URL? Just click it or paste it in your browser. No sign-up needed!</p>
                <div className="action-footer">
                  <span className="highlight">✨ Zero barriers to participation</span>
                </div>
              </div>
            </div>

            <div className="action-box create">
              <div className="action-glow create-glow"></div>
              <div className="action-content">
                <h3><span className="action-icon">✨</span> Host Your Own</h3>
                <p>Be the catalyst! Launch your talk session and bring speakers together in minutes.</p>
                <div className="creation-flow">
                  <div className="flow-item">
                    <div className="flow-icon">⚡</div>
                    <span>Create event</span>
                  </div>
                  <div className="flow-separator">•</div>
                  <div className="flow-item">
                    <div className="flow-icon">📤</div>
                    <span>Share URL</span>
                  </div>
                </div>
                <div className="action-footer">
                  <Link to="/create-event" className="create-event-btn">
                    <span>🚀 Launch Event</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentUser && (
        <div className="user-dashboard">
          <h2>Your Dashboard</h2>
          
          <div className="dashboard-actions">
            <Link to="/create-event" className="action-card">
              <h3>Create New Event</h3>
              <p>Start organizing your own open talk session</p>
            </Link>
            
            <div className="action-card">
              <h3>Your Events</h3>
              <p>Manage events you've created</p>
            </div>
            
            <div className="action-card">
              <h3>Saved Events ({currentUser.savedEventUrls.length})</h3>
              <p>Access your saved event URLs</p>
              {currentUser.savedEventUrls.length > 0 && (
                <div className="saved-events-list">
                  {currentUser.savedEventUrls.slice(0, 3).map((url, index) => (
                    <div key={index} className="saved-event-item">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url.length > 40 ? `${url.substring(0, 40)}...` : url}
                      </a>
                    </div>
                  ))}
                  {currentUser.savedEventUrls.length > 3 && (
                    <p className="more-events">+{currentUser.savedEventUrls.length - 3} more events</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;