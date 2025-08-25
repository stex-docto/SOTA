import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {useDependencies} from '../hooks/useDependencies';
import EventForm, {EventFormData} from '../components/EventForm';

function CreateEventPage() {
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const {createEventUseCase} = useDependencies();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleSubmit = async (formData: EventFormData) => {
        if (!currentUser) {
            setError(new Error('You must be signed in to create an event'));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        // Validate dates
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            setError(new Error('End date must be after start date'));
            setIsSubmitting(false);
            return;
        }

        try {
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
            setError(error instanceof Error ? error : new Error('Failed to create event. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            error={error}
            submitButtonText="Create Event"
            title="Create New Event"
            subtitle="Set up your open talk session"
        />
    );
}

export default CreateEventPage;