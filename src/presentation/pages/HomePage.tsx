import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Open Talk Sessions</h1>
        <p className="hero-description">
          Organize and participate in open talk sessions. Share your knowledge, 
          learn from others, and build a vibrant community of speakers and learners.
        </p>
        
        {!currentUser && (
          <div className="hero-actions">
            <Link to="/create-event" className="cta-button primary">Create Event</Link>
            <div className="or-divider">or</div>
            <div className="access-info">
              <h3>Join an Event</h3>
              <p>Have a public event URL? Access it directly to participate in talks and discussions.</p>
            </div>
          </div>
        )}
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

      <div className="features-section">
        <h2>Why Choose Open Talk Sessions?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Easy Organization</h3>
            <p>Create and manage talk sessions with just a few clicks</p>
          </div>
          
          <div className="feature-card">
            <h3>Community Driven</h3>
            <p>Connect with like-minded individuals and share knowledge</p>
          </div>
          
          <div className="feature-card">
            <h3>Flexible Scheduling</h3>
            <p>Accommodate different time zones and availability</p>
          </div>
          
          <div className="feature-card">
            <h3>Topic Diversity</h3>
            <p>Explore a wide range of subjects and expertise areas</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;