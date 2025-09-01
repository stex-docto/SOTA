import {
    Box,
    Button,
    Dialog,
    Field,
    HStack,
    IconButton,
    Input,
    Text,
    Textarea,
    VStack
} from '@chakra-ui/react'
import { EventId, RoomId } from '@domain'
import { HiMicrophone, HiXMark } from 'react-icons/hi2'
import React, { useEffect, useState } from 'react'

import { toaster } from '@presentation/ui/toaster-config'
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

            toaster.create({
                title: 'Talk Submitted Successfully',
                description: 'Your talk has been submitted and is pending approval.',
                type: 'success',
                duration: 5000
            })
            onClose()
            resetForm()
        } catch (error) {
            console.error('Failed to create talk:', error)
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to create talk. Please try again.'
            setError(errorMessage)
            toaster.create({
                title: 'Talk Creation Failed',
                description: errorMessage,
                type: 'error',
                duration: 5000
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <Dialog.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
            <Dialog.Content maxW="2xl">
                <Dialog.Header>
                    <Dialog.Title>
                        <HStack gap={2}>
                            <HiMicrophone size={24} />
                            <Text>Submit a Talk</Text>
                        </HStack>
                    </Dialog.Title>
                    <Dialog.CloseTrigger asChild>
                        <IconButton variant="outline" size="sm">
                            <HiXMark />
                        </IconButton>
                    </Dialog.CloseTrigger>
                </Dialog.Header>

                <Box as="form" onSubmit={handleSubmit} p={6}>
                    <VStack gap={6} align="stretch">
                        {error && (
                            <Box
                                colorPalette="red"
                                p={4}
                                bg={{ base: 'colorPalette.50', _dark: 'colorPalette.900' }}
                                borderWidth="1px"
                                borderColor="colorPalette.200"
                                borderRadius="md"
                            >
                                <Text colorPalette="red" fontWeight="medium">
                                    {error}
                                </Text>
                            </Box>
                        )}

                        <Field.Root required>
                            <Field.Label>Title *</Field.Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your talk title"
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Pitch</Field.Label>
                            <Textarea
                                name="pitch"
                                value={formData.pitch}
                                onChange={handleInputChange}
                                placeholder="What's your talk about? What will attendees learn? Why should they be excited to attend? 🎯"
                                rows={4}
                                autoresize
                            />
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Start Time *</Field.Label>
                            <Input
                                name="startDateTime"
                                type="datetime-local"
                                value={formData.startDateTime}
                                onChange={handleInputChange}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Expected Duration *</Field.Label>
                            <HStack gap={2} flexWrap="wrap">
                                {[
                                    { value: 5, label: '5min' },
                                    { value: 15, label: '15min' },
                                    { value: 30, label: '30min' },
                                    { value: 60, label: '1hour' }
                                ].map(({ value, label }) => (
                                    <Button
                                        key={value}
                                        variant={
                                            formData.expectedDurationMinutes === value
                                                ? 'solid'
                                                : 'outline'
                                        }
                                        colorPalette={
                                            formData.expectedDurationMinutes === value
                                                ? 'blue'
                                                : 'gray'
                                        }
                                        onClick={() =>
                                            setFormData(prev => ({
                                                ...prev,
                                                expectedDurationMinutes: value
                                            }))
                                        }
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </HStack>
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Preferred Room *</Field.Label>
                        </Field.Root>

                        <HStack justify="flex-end" gap={4} pt={4}>
                            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                colorPalette="blue"
                                disabled={isSubmitting}
                                loading={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Talk'}
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default TalkCreationModal
