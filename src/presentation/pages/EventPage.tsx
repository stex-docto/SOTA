import React from 'react';
import { useParams } from 'react-router-dom';

function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();

  return (
    <div className="event-page">
      <div className="event-header">
        <h1>Event Details</h1>
        <p className="event-id">Event ID: {eventId}</p>
      </div>

      <div className="event-content">
        <div className="event-info">
          <h2>Event Information</h2>
          <div className="info-card">
            <h3>Loading Event...</h3>
            <p>Event details will be loaded here.</p>
          </div>
        </div>

        <div className="talk-schedule">
          <h2>Talk Schedule</h2>
          <div className="schedule-placeholder">
            <p>Schedule will be displayed here once talks are submitted.</p>
          </div>
        </div>

        <div className="submit-talk-section">
          <h2>Submit a Talk</h2>
          <form className="talk-form">
            <div className="form-group">
              <label htmlFor="talkTitle">Talk Title</label>
              <input
                id="talkTitle"
                type="text"
                placeholder="Enter your talk title"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="talkDescription">Description</label>
              <textarea
                id="talkDescription"
                placeholder="Describe your talk..."
                rows={4}
                className="form-textarea"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="speakerName">Your Name</label>
              <input
                id="speakerName"
                type="text"
                placeholder="Enter your name"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <select id="duration" className="form-select">
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            
            <button type="submit" className="submit-button">
              Submit Talk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventPage;