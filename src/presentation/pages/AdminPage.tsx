import { useParams } from 'react-router-dom';

function AdminPage() {
  const { eventId, adminToken } = useParams<{ eventId: string; adminToken: string }>();

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Event Administration</h1>
        <p className="admin-info">
          Managing Event: {eventId}
        </p>
      </div>

      <div className="admin-content">
        <div className="admin-section">
          <h2>Event Management</h2>
          <div className="admin-actions">
            <button className="admin-button primary">
              Edit Event Details
            </button>
            <button className="admin-button secondary">
              View Event Public Page
            </button>
            <button className="admin-button danger">
              Delete Event
            </button>
          </div>
        </div>

        <div className="admin-section">
          <h2>Talk Management</h2>
          <div className="talks-admin">
            <div className="talks-header">
              <h3>Submitted Talks</h3>
              <button className="admin-button">Generate Schedule</button>
            </div>
            
            <div className="talks-list">
              <div className="talk-item">
                <div className="talk-info">
                  <h4>Sample Talk Title</h4>
                  <p>Speaker: John Doe</p>
                  <p>Duration: 15 minutes</p>
                </div>
                <div className="talk-actions">
                  <button className="talk-button approve">Approve</button>
                  <button className="talk-button reject">Reject</button>
                  <button className="talk-button edit">Edit</button>
                </div>
              </div>
              
              <div className="no-talks">
                <p>No talks submitted yet.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Schedule Management</h2>
          <div className="schedule-admin">
            <div className="schedule-settings">
              <div className="form-group">
                <label htmlFor="eventDate">Event Date</label>
                <input
                  id="eventDate"
                  type="datetime-local"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="timeSlot">Time Slot Duration</label>
                <select id="timeSlot" className="form-select">
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                </select>
              </div>
              
              <button className="admin-button primary">
                Update Schedule Settings
              </button>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Event Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>0</h3>
              <p>Total Talks</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Approved Talks</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Total Duration</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Participants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;