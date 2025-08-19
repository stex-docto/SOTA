import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FirebaseAuthUI } from '../components/FirebaseAuthUI';

function CreateEventPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxTalks: 10,
    timeSlotDuration: 15,
    isPublic: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('You must be signed in to create an event');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement event creation logic
      console.log('Creating event:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the created event (for now, using a mock ID)
      const mockEventId = 'evt_' + Date.now();
      navigate(`/event/${mockEventId}`);
      
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="create-event-page">
        <div className="auth-required">
          <h2>Sign In to Create Event</h2>
          <p>You need to authenticate to create and manage events.</p>
          <FirebaseAuthUI />
        </div>
      </div>
    );
  }

  return (
    <div className="create-event-page">
      <div className="page-header">
        <h1>Create New Event</h1>
        <p>Set up your open talk session</p>
      </div>

      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your event..."
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Event Date & Time *</label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Conference Room A, Virtual Meeting, etc."
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Event Settings</h2>
          
          <div className="form-group">
            <label htmlFor="maxTalks">Maximum Number of Talks</label>
            <input
              id="maxTalks"
              name="maxTalks"
              type="number"
              value={formData.maxTalks}
              onChange={handleInputChange}
              min="1"
              max="50"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="timeSlotDuration">Default Time Slot Duration (minutes)</label>
            <select
              id="timeSlotDuration"
              name="timeSlotDuration"
              value={formData.timeSlotDuration}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                name="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Make this event public (visible to everyone)
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEventPage;