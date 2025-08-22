import {Link} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';

function HomePage() {
    const {currentUser} = useAuth();

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
                        <div className="action-card">
                            <h3>Your Events</h3>
                            <p>Manage events you've created</p>
                        </div>

                        <div className="action-card">
                            <h3>Saved Events ({currentUser.savedEventIds.size})</h3>
                            <p>Access your saved events</p>
                            {currentUser.savedEventIds.size > 0 && (
                                <div className="saved-events-list">
                                    {currentUser.savedEventIds.toArray().slice(0, 3).map((eventId, index) => (
                                        <div key={index} className="saved-event-item">
                                            <Link to={`/event/${eventId.value}`}>
                                                Event: {eventId.value.length > 20 ? `${eventId.value.substring(0, 20)}...` : eventId.value}
                                            </Link>
                                        </div>
                                    ))}
                                    {currentUser.savedEventIds.size > 3 && (
                                        <p className="more-events">+{currentUser.savedEventIds.size - 3} more
                                            events</p>
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