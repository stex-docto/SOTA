import { Dialog, IconButton } from '@chakra-ui/react'
import { EventEntity, RoomId } from '@domain'
import { HiPlus } from 'react-icons/hi2'
import { useState } from 'react'

import { TalkFormData, TalkFormModal } from './TalkFormModal'
import { toaster } from '@presentation/ui/toaster-config'
import { useDependencies } from '../hooks/useDependencies'
import { OpenChangeDetails } from '@zag-js/dialog'

interface TalkCreationModalProps {
    event: EventEntity
}

function TalkCreationModal({ event }: TalkCreationModalProps) {
    const { createTalkUseCase, signInUseCase } = useDependencies()
    const [open, setOpen] = useState(false)

    const onOpenChange: ((details: OpenChangeDetails) => void) | undefined = e => {
        if (e.open) {
            signInUseCase.requireCurrentUser().then(() => setOpen(e.open))
        } else {
            setOpen(e.open)
        }
    }

    const handleSubmit = async (formData: TalkFormData) => {
        await createTalkUseCase.execute({
            eventId: event.id,
            name: formData.name.trim(),
            pitch: formData.pitch.trim(),
            startDateTime: new Date(formData.startDateTime),
            expectedDurationMinutes: formData.expectedDurationMinutes,
            roomId: RoomId.from(formData.roomId)
        })

        toaster.create({
            title: 'Talk Submitted Successfully',
            description: 'Your talk has been created.',
            type: 'success'
        })
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Trigger asChild>
                    <IconButton
                        position={{ base: 'fixed' }}
                        bottom={8}
                        right={8}
                        borderRadius={{ base: 'full' }}
                        size={{ base: '2xl' }}
                        colorPalette="blue"
                        title="Submit a talk"
                    >
                        <HiPlus />
                    </IconButton>
                </Dialog.Trigger>
            </Dialog.Root>

            <TalkFormModal
                event={event}
                open={open}
                onOpenChange={setOpen}
                title="Submit a Talk"
                submitText="Submit Talk"
                onSubmit={handleSubmit}
            />
        </>
    )
}

export default TalkCreationModal
