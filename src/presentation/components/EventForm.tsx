import React, {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

export interface EventFormData {
    title: string;
    description: string;
    talkRules: string;
    startDate: string;
    endDate: string;
    location: string;
}

export interface EventFormProps {
    initialData?: Partial<EventFormData>;
    onSubmit: (data: EventFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    error: string;
    submitButtonText?: string;
    title: string;
    subtitle: string;
}

const defaultTalkRules = `### The Four Principles

1. **Whoever comes are the right people** — The people who show up are exactly who need to be there.
1. **Whatever happens is the only thing that could have happened** — Don't worry about what might have been; focus on what is.
1. **When it starts is the right time to start** — Things begin when they're ready, not before.
1. **When it's over, it's over** — When the energy for a topic is gone, move on.

---

### The Law of Two Feet

**Use your feet!** 

If you're not learning or contributing, go somewhere else. No hard feelings.

This creates engaged, passionate discussions where everyone participates by choice.

---
_More on this, visit [Open Space Technology](https://openspaceworld.org/wp2/what-is/) principles for self-organizing conversations_`;

function EventForm({
    initialData = {},
    onSubmit,
    onCancel,
    isSubmitting,
    error,
    submitButtonText = 'Submit',
    title,
    subtitle
}: EventFormProps) {
    const [descriptionPreview, setDescriptionPreview] = useState(false);
    const [talkRulesPreview, setTalkRulesPreview] = useState(false);

    const [formData, setFormData] = useState<EventFormData>({
        title: initialData.title || '',
        description: initialData.description || '',
        talkRules: initialData.talkRules || defaultTalkRules,
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        location: initialData.location || ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="event-form-container">
            <div className="page-header">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
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
                                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{formData.description}</ReactMarkdown>
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
                                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>{formData.talkRules}</ReactMarkdown>
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
                        onClick={onCancel}
                        className="cancel-button"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? `${submitButtonText.replace(/e$/, 'ing')}...` : submitButtonText}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EventForm;