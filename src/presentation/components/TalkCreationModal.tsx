import React, { useState, useEffect } from 'react'
import { EventId, RoomId } from '@domain'
import { useDependencies } from '../hooks/useDependencies'

interface TalkCreationModalProps {
    isOpen: boolean
    onClose: () => void
    eventId: EventId
}

interface TalkFormData {
    name: string
    pitch: string
    startDateTime: string
    expectedDurationMinutes: number
    roomId: string
}

function TalkCreationModal({ isOpen, onClose, eventId }: TalkCreationModalProps) {
    const { createTalkUseCase } = useDependencies()
    const [formData, setFormData] = useState<TalkFormData>({
        name: '',
        pitch: '',
        startDateTime: '',
        expectedDurationMinutes: 15,
        roomId: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>('')

    const resetForm = () => {
        setFormData({
            name: '',
            pitch: '',
            startDateTime: '',
            expectedDurationMinutes: 15,
            roomId: ''
        })
        setError('')
    }

    useEffect(() => {
        if (isOpen) {
            resetForm()
        }
    }, [isOpen])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.name.trim() || !formData.startDateTime || !formData.roomId) {
            setError('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)
        try {
            await createTalkUseCase.execute({
                eventId,
                name: formData.name.trim(),
                pitch: formData.pitch.trim(),
                startDateTime: new Date(formData.startDateTime),
                expectedDurationMinutes: formData.expectedDurationMinutes,
                roomId: RoomId.from(formData.roomId)
            })

            onClose()
            resetForm()
        } catch (error) {
            console.error('Failed to create talk:', error)
            setError(
                error instanceof Error ? error.message : 'Failed to create talk. Please try again.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content talk-creation-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <span className="talk-icon">🎤</span>
                        <h2>Submit a Talk</h2>
                    </div>
                    <button className="modal-close" onClick={onClose} type="button">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="talk-form">
                    {error && <div className="error-banner">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Title*</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your talk title"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pitch">Pitch</label>
                        <textarea
                            id="pitch"
                            name="pitch"
                            value={formData.pitch}
                            onChange={handleInputChange}
                            placeholder="What's your talk about? What will attendees learn? Why should they be excited to attend? 🎯"
                            rows={4}
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="startDateTime">Start Time*</label>
                        <input
                            id="startDateTime"
                            name="startDateTime"
                            type="datetime-local"
                            value={formData.startDateTime}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Expected Duration*</label>
                        <div className="duration-button-group">
                            {[
                                { value: 5, label: '5min' },
                                { value: 15, label: '15min' },
                                { value: 30, label: '30min' },
                                { value: 60, label: '1hour' }
                            ].map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`duration-btn ${formData.expectedDurationMinutes === value ? 'selected' : ''}`}
                                    onClick={() =>
                                        setFormData(prev => ({
                                            ...prev,
                                            expectedDurationMinutes: value
                                        }))
                                    }
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="roomId">Preferred Room*</label>
                        <select
                            id="roomId"
                            name="roomId"
                            value={formData.roomId}
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select a room</option>
                            <option value="main-room">Main Room</option>
                            <option value="workshop-room">Workshop Room</option>
                            <option value="discussion-room">Discussion Room</option>
                            <option value="outdoor-space">Outdoor Space</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Talk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TalkCreationModal
