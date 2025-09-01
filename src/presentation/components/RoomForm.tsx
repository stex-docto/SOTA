import React, { useState } from 'react'

export interface RoomFormData {
    name: string
    description: string
}

export interface RoomFormProps {
    initialData?: Partial<RoomFormData>
    onSubmit: (data: RoomFormData) => void
    onCancel: () => void
    isSubmitting: boolean
    error: Error | string | null
    submitButtonText?: string
    title: string
}

function RoomForm({
    initialData = {},
    onSubmit,
    onCancel,
    isSubmitting,
    error,
    submitButtonText = 'Create Room',
    title
}: RoomFormProps) {
    const [formData, setFormData] = useState<RoomFormData>({
        name: initialData.name || '',
        description: initialData.description || ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="room-form-container">
            <div className="page-header">
                <h2>{title}</h2>
            </div>

            <form onSubmit={handleSubmit} className="room-form">
                <div className="form-group">
                    <label htmlFor="name">Room Name *</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Main Auditorium, Breakout Room 1"
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
                        placeholder="Optional description of the room..."
                        rows={3}
                        className="form-textarea"
                    />
                </div>

                {error && (
                    <div className="error-message">
                        {typeof error === 'string' ? error : error.message}
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
                    <button type="submit" className="admin-button primary" disabled={isSubmitting}>
                        {isSubmitting
                            ? `${submitButtonText.replace(/e$/, 'ing')}...`
                            : submitButtonText}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RoomForm
