import { Link } from 'react-router-dom';
import { useAuthWithProfile } from '../hooks/useAuthWithProfile';

function HomePage() {
  const { currentUser } = useAuthWithProfile();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to SOTA</h1>
        <p className="hero-description">
          Simple Open Talk App - Organize and participate in open talk sessions. Share your knowledge, 
          learn from others, and build a vibrant community of speakers and learners.
        </p>
        
        <div className="action-boxes">
          <div className="action-box participate">
            <h3><span className="action-icon">👥</span> Join an Event</h3>
            <p>Got an event URL? Just click it or paste it in your browser. No sign-up needed!</p>
            <div className="action-footer">
              <span className="highlight">✨ Zero barriers to participation</span>
            </div>
          </div>

          <div className="action-box create">
            <h3><span className="action-icon">🎤</span> Organize an Event</h3>
            <p>Create your own open talk session and invite speakers to share their ideas.</p>
            <div className="action-steps">
              <div className="step">
                <span className="step-number">1</span>
                <span>Create event</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span>Share → Done!</span>
              </div>
            </div>
            <div className="action-footer">
              <Link to="/create-event" className="create-event-btn">
                Start Organizing
              </Link>
            </div>
          </div>
        </div>
      </div>

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