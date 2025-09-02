import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Field,
    HStack,
    IconButton,
    Input,
    Text,
    Textarea,
    VStack,
    Select,
    createListCollection
} from '@chakra-ui/react'
import { EventEntity, RoomId, RoomEntity } from '@domain'
import { HiMicrophone, HiPlus } from 'react-icons/hi2'
import React, { useEffect, useState } from 'react'

import { toaster } from '@presentation/ui/toaster-config'
import { useDependencies } from '../hooks/useDependencies'

interface TalkCreationModalProps {
    event: EventEntity
}

interface TalkFormData {
    name: string
    pitch: string
    startDateTime: string
    expectedDurationMinutes: number
    roomId: string
}

function TalkCreationModal({ event }: TalkCreationModalProps) {
    const { createTalkUseCase, getRoomsByEventUseCase } = useDependencies()
    const [formData, setFormData] = useState<TalkFormData>({
        name: '',
        pitch: '',
        startDateTime: '',
        expectedDurationMinutes: 15,
        roomId: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>('')
    const [open, setOpen] = useState(false)
    const [rooms, setRooms] = useState<RoomEntity[]>([])
    const [loadingRooms, setLoadingRooms] = useState(false)

    const roomsCollection = createListCollection({
        items: rooms.map(room => ({
            label: room.name,
            value: room.id.value,
            description: room.description
        }))
    })

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
        resetForm()
    }, [event.id])

    const fetchRooms = async () => {
        setLoadingRooms(true)
        try {
            const result = await getRoomsByEventUseCase.execute({ eventId: event.id })
            setRooms(result.rooms)
        } catch (error) {
            console.error('Failed to fetch rooms:', error)
            toaster.create({
                title: 'Failed to load rooms',
                description: 'Unable to load available rooms. Please try again.',
                type: 'error',
                duration: 3000
            })
        } finally {
            setLoadingRooms(false)
        }
    }

    useEffect(() => {
        if (open) {
            fetchRooms()
        }
    }, [open, event.id])

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
                type: 'success',
                duration: 5000
            })
            setOpen(false)
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

    return (
        <Dialog.Root open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <IconButton
                    position="fixed"
                    bottom={8}
                    right={8}
                    borderRadius="full"
                    size="2xl"
                    colorPalette="blue"
                    title="Submit a talk"
                >
                    <HiPlus />
                </IconButton>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW="2xl">
                    <Dialog.Header>
                        <Dialog.Title>
                            <HStack gap={2}>
                                <HiMicrophone size={24} />
                                <Text>Submit a Talk</Text>
                            </HStack>
                        </Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
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
                                <Select.Root
                                    collection={roomsCollection}
                                    value={[formData.roomId]}
                                    onValueChange={e =>
                                        setFormData(prev => ({ ...prev, roomId: e.value[0] || '' }))
                                    }
                                    disabled={loadingRooms || rooms.length === 0}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText
                                                placeholder={
                                                    loadingRooms
                                                        ? 'Loading rooms...'
                                                        : rooms.length === 0
                                                          ? 'No rooms available'
                                                          : 'Select a room'
                                                }
                                            />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {roomsCollection.items.map(room => (
                                                <Select.Item key={room.value} item={room}>
                                                    <VStack align="flex-start" gap={1}>
                                                        <Text fontWeight="medium">
                                                            {room.label}
                                                        </Text>
                                                        {room.description && (
                                                            <Text fontSize="sm" colorPalette="gray">
                                                                {room.description}
                                                            </Text>
                                                        )}
                                                    </VStack>
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>
                                {rooms.length === 0 && !loadingRooms && (
                                    <Text fontSize="sm" colorPalette="gray">
                                        No rooms have been created for this event yet. Event
                                        organizers can add rooms in the event management section.
                                    </Text>
                                )}
                            </Field.Root>
                        </VStack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </Dialog.ActionTrigger>
                        <Button
                            type="submit"
                            colorPalette="blue"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Talk'}
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default TalkCreationModal
