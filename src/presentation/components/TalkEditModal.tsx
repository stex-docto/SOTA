import { EventEntity, RoomId, TalkEntity } from '@domain'
import { TalkFormData, TalkFormModal } from './TalkFormModal'
import { toaster } from '@presentation/ui/toaster-config'
import { useDependencies } from '../hooks/useDependencies'

interface TalkEditModalProps {
    event: EventEntity
    editTalk: TalkEntity | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TalkEditModal({ event, editTalk, open, onOpenChange }: TalkEditModalProps) {
    const { updateTalkUseCase } = useDependencies()

    const handleSubmit = async (formData: TalkFormData) => {
        if (!editTalk) return

        try {
            await updateTalkUseCase.execute({
                talkId: editTalk.id,
                name: formData.name.trim(),
                pitch: formData.pitch.trim(),
                startDateTime: new Date(formData.startDateTime),
                expectedDurationMinutes: formData.expectedDurationMinutes,
                roomId: RoomId.from(formData.roomId)
            })

            toaster.create({
                title: 'Talk Updated Successfully',
                description: 'Your talk has been updated.',
                type: 'success',
                duration: 5000
            })
        } catch (error) {
            console.error('Failed to update talk:', error)
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to update talk. Please try again.'

            toaster.create({
                title: 'Update Failed',
                description: errorMessage,
                type: 'error',
                duration: 5000
            })

            // Don't close modal on error, let user try again
            throw error
        }
    }

    return (
        <TalkFormModal
            event={event}
            editTalk={editTalk}
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Talk"
            submitText="Save Changes"
            onSubmit={handleSubmit}
        />
    )
}
