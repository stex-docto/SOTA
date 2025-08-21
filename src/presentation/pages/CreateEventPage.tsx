import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {useAuth} from '../hooks/useAuth';
import {useDependencies} from '../hooks/useDependencies';
import {CreateEventUseCase} from '@application';

function CreateEventPage() {
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const {eventRepository, userRepository} = useDependencies();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');
    const [descriptionPreview, setDescriptionPreview] = useState(false);
    const [talkRulesPreview, setTalkRulesPreview] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        talkRules: `# The Four Principles

1. **Whoever comes are the right people** — The people who show up are exactly who need to be there.
1. **Whatever happens is the only thing that could have happened** — Don't worry about what might have been; focus on what is.
1. **When it starts is the right time to start** — Things begin when they're ready, not before.
1. **When it's over, it's over** — When the energy for a topic is gone, move on.

# The Law of Two Feet

**Use your feet!** If you're not learning or contributing, go somewhere else. No hard feelings.

This creates engaged, passionate discussions where everyone participates by choice.

---
_More on this, visit [Open Space Technology](https://openspaceworld.org/wp2/what-is/) principles for self-organizing conversations_`,
        startDate: '',
        endDate: '',
        location: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
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

        // Validate dates
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            setError('End date must be after start date');
            setIsSubmitting(false);
            return;
        }

        try {
            setError('');
            
            const createEventUseCase = new CreateEventUseCase(eventRepository, userRepository);
            const result = await createEventUseCase.execute({
                title: formData.title,
                description: formData.description,
                talkRules: formData.talkRules,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                location: formData.location
            });

            // Navigate to the created event
            navigate(`/event/${result.event.id.value}`);

        } catch (error) {
            console.error('Failed to create event:', error);
            setError(error instanceof Error ? error.message : 'Failed to create event. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <div className="field-header">
                            <label htmlFor="description">Description (Markdown supported)</label>
                            <button
                                type="button"
                                onClick={() => setDescriptionPreview(!descriptionPreview)}
                                className="preview-toggle"
                            >
                                {descriptionPreview ? 'Edit' : 'Preview'}
                            </button>
                        </div>
                        {descriptionPreview ? (
                            <div className="markdown-preview">
                                {formData.description ? (
                                    <ReactMarkdown>{formData.description}</ReactMarkdown>
                                ) : (
                                    <p className="preview-placeholder">No description provided</p>
                                )}
                            </div>
                        ) : (
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your event... (Markdown formatting supported)"
                                rows={4}
                                className="form-textarea"
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <div className="field-header">
                            <label htmlFor="talkRules">Talk Rules (Markdown supported)</label>
                            <button
                                type="button"
                                onClick={() => setTalkRulesPreview(!talkRulesPreview)}
                                className="preview-toggle"
                            >
                                {talkRulesPreview ? 'Edit' : 'Preview'}
                            </button>
                        </div>
                        {talkRulesPreview ? (
                            <div className="markdown-preview large">
                                <ReactMarkdown>{formData.talkRules}</ReactMarkdown>
                            </div>
                        ) : (
                            <textarea
                                id="talkRules"
                                name="talkRules"
                                value={formData.talkRules}
                                onChange={handleInputChange}
                                placeholder="Rules for talk sessions..."
                                rows={10}
                                className="form-textarea"
                            />
                        )}
                        <small className="help-text">These guidelines will be shown to participants about how the talk sessions work.</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="startDate">Start Date & Time *</label>
                        <input
                            id="startDate"
                            name="startDate"
                            type="datetime-local"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate">End Date & Time *</label>
                        <input
                            id="endDate"
                            name="endDate"
                            type="datetime-local"
                            value={formData.endDate}
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

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

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