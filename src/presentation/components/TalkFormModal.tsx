import {
    Button,
    CloseButton,
    createListCollection,
    Dialog,
    Field,
    HStack,
    Input,
    Select,
    Text,
    Textarea,
    VStack
} from '@chakra-ui/react'
import { EventEntity, RoomEntity, TalkEntity } from '@domain'
import { HiMicrophone } from 'react-icons/hi2'
import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'

import { toaster } from '@presentation/ui/toaster-config'
import { useDependencies } from '../hooks/useDependencies'
import { useTalksForEvent } from '../hooks/useTalksForEvent'

interface TalkFormData {
    name: string
    pitch: string
    startDateTime: string
    expectedDurationMinutes: number
    roomId: string
}

interface TalkFormModalProps {
    event: EventEntity
    editTalk?: TalkEntity | null
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    submitText: string
    onSubmit: (formData: TalkFormData) => Promise<void>
}

// Round time interval in minutes
const ROUND_TIME_INTERVAL = 5

export function TalkFormModal({
    event,
    editTalk,
    open,
    onOpenChange,
    title,
    submitText,
    onSubmit
}: TalkFormModalProps) {
    const { getRoomsByEventUseCase } = useDependencies()
    const { talks } = useTalksForEvent(event)
    const [formData, setFormData] = useState<TalkFormData>({
        name: '',
        pitch: '',
        startDateTime: '',
        expectedDurationMinutes: 20,
        roomId: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<{
        name?: string
        startDateTime?: string
        roomId?: string
        collision?: string
    }>({})
    const [rooms, setRooms] = useState<RoomEntity[]>([])
    const [loadingRooms, setLoadingRooms] = useState(false)

    const roomsCollection = createListCollection({
        items: rooms.map(room => ({
            label: room.name,
            value: room.id.value,
            description: room.description
        }))
    })

    const resetForm = useCallback(async () => {
        if (editTalk) {
            // Pre-populate form with existing talk data
            setFormData({
                name: editTalk.name,
                pitch: editTalk.pitch,
                startDateTime: moment(editTalk.startDateTime).format('YYYY-MM-DDTHH:mm'),
                expectedDurationMinutes: editTalk.getDurationMinutes(),
                roomId: editTalk.roomId.value
            })
        } else {
            // Reset to empty form for creation
            setFormData({
                name: '',
                pitch: '',
                startDateTime: '',
                expectedDurationMinutes: 15,
                roomId: ''
            })
        }
        setErrors({})
    }, [editTalk])

    useEffect(() => {
        resetForm()
    }, [event.id, editTalk, open, resetForm])

    // Clear collision error when form data changes
    useEffect(() => {
        if (errors.collision) {
            setErrors(prev => ({ ...prev, collision: undefined }))
        }
    }, [
        formData.startDateTime,
        formData.expectedDurationMinutes,
        formData.roomId,
        errors.collision
    ])

    const fetchRooms = useCallback(async () => {
        setLoadingRooms(true)
        try {
            const result = await getRoomsByEventUseCase.execute({ eventId: event.id })
            setRooms(result.rooms)
        } catch (error) {
            console.error('Failed to fetch rooms:', error)
            toaster.create({
                title: 'Failed to load rooms',
                description: 'Unable to load available rooms. Please try again.',
                type: 'error'
            })
        } finally {
            setLoadingRooms(false)
        }
    }, [event.id, getRoomsByEventUseCase])

    useEffect(() => {
        fetchRooms()
    }, [fetchRooms])

    // Get talks for selected room, sorted by start time, excluding current talk being edited
    const selectedRoomTalks = formData.roomId
        ? talks
              .filter(talk => {
                  // Filter by room
                  if (talk.roomId.value !== formData.roomId) return false
                  // Exclude the talk being edited
                  if (editTalk && talk.id.equals(editTalk.id)) return false
                  // Only show talks that ended less than 30 minutes ago or are in the future
                  const thirtyMinutesAgo = moment().subtract(30, 'minutes').toDate()
                  return talk.endDateTime >= thirtyMinutesAgo
              })
              .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
        : []

    // Check for time collision with existing talks
    const checkCollision = (): TalkEntity | null => {
        if (!formData.startDateTime || !formData.roomId) return null

        const startTime = moment(formData.startDateTime).toDate()
        const endTime = moment(formData.startDateTime)
            .add(formData.expectedDurationMinutes, 'minutes')
            .toDate()

        // Check if this talk overlaps with any existing talk in the same room
        return (
            selectedRoomTalks.find(talk => {
                return startTime < talk.endDateTime && endTime > talk.startDateTime
            }) || null
        )
    }

    const collidingTalk = checkCollision()

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        let processedValue = value

        // Round start time to next 5 minutes
        if (name === 'startDateTime' && value) {
            const selectedTime = moment(value)
            const minutes = selectedTime.minutes()
            const roundedMinutes = Math.ceil(minutes / ROUND_TIME_INTERVAL) * ROUND_TIME_INTERVAL
            const roundedTime = selectedTime.clone().minutes(roundedMinutes).seconds(0)
            processedValue = roundedTime.format('YYYY-MM-DDTHH:mm')
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }))

        // Clear field-specific error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: typeof errors = {}

        // Validate required fields
        if (!formData.name.trim()) {
            newErrors.name = 'Title is required'
        }
        if (!formData.startDateTime) {
            newErrors.startDateTime = 'Start time is required'
        }
        if (!formData.roomId) {
            newErrors.roomId = 'Room selection is required'
        }

        // Check for collision
        if (collidingTalk) {
            newErrors.collision = `This slot overlaps with "${collidingTalk.name}" (${moment(collidingTalk.startDateTime).format('LT')} - ${moment(collidingTalk.endDateTime).format('LT')})`
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit(formData)
            onOpenChange(false)
            resetForm()
        } catch (error) {
            console.error('Failed to submit talk:', error)
            toaster.create({
                title: 'Failed to submit talk',
                description: error instanceof Error ? error.message : 'Please try again.',
                type: 'error'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={e => onOpenChange(e.open)}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW="2xl">
                    <Dialog.Header>
                        <Dialog.Title>
                            <HStack gap={2}>
                                <HiMicrophone size={24} />
                                <Text>{title}</Text>
                            </HStack>
                        </Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                        <VStack gap={6} align="stretch">
                            <Field.Root required invalid={!!errors.name}>
                                <Field.Label>Title *</Field.Label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your talk title"
                                />
                                {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
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
                                <Field.HelperText>
                                    Markdown is supported! Use **bold**, *italic*, [links](url), and
                                    other formatting.
                                </Field.HelperText>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Expected Duration *</Field.Label>
                                <HStack gap={2} flexWrap="wrap">
                                    {[
                                        { value: 10, label: '10min' },
                                        { value: 20, label: '20min' },
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

                            <Field.Root required invalid={!!errors.roomId}>
                                <Field.Label>Preferred Room *</Field.Label>
                                <Select.Root
                                    collection={roomsCollection}
                                    value={[formData.roomId]}
                                    onValueChange={e => {
                                        setFormData(prev => ({ ...prev, roomId: e.value[0] || '' }))
                                        // Clear roomId error when user selects a room
                                        if (errors.roomId) {
                                            setErrors(prev => ({ ...prev, roomId: undefined }))
                                        }
                                    }}
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
                                {errors.roomId && (
                                    <Field.ErrorText>{errors.roomId}</Field.ErrorText>
                                )}
                                {rooms.length === 0 && !loadingRooms && !errors.roomId && (
                                    <Field.HelperText>
                                        No rooms have been created for this event yet. Event
                                        organizers can add rooms in the event management section.
                                    </Field.HelperText>
                                )}
                            </Field.Root>

                            {selectedRoomTalks.length > 0 && (
                                <VStack
                                    gap={3}
                                    align="stretch"
                                    colorPalette="blue"
                                    p={4}
                                    bg={{ base: 'colorPalette.50', _dark: 'colorPalette.900' }}
                                    borderWidth="1px"
                                    borderColor={{
                                        base: 'colorPalette.200',
                                        _dark: 'colorPalette.800'
                                    }}
                                    borderRadius="md"
                                >
                                    <Text
                                        fontSize="sm"
                                        fontWeight="semibold"
                                        color={{
                                            base: 'colorPalette.700',
                                            _dark: 'colorPalette.300'
                                        }}
                                    >
                                        Scheduled talks in this room:
                                    </Text>
                                    <VStack gap={2} align="stretch">
                                        {selectedRoomTalks.map(talk => (
                                            <HStack
                                                justify="space-between"
                                                gap={2}
                                                key={talk.id.value}
                                                p={2}
                                                bg={{
                                                    base: 'colorPalette.100',
                                                    _dark: 'colorPalette.800'
                                                }}
                                                borderRadius="sm"
                                            >
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                    truncate
                                                    flex={1}
                                                >
                                                    {talk.name}
                                                </Text>
                                                <Text
                                                    fontSize="xs"
                                                    colorPalette="gray"
                                                    flexShrink={0}
                                                >
                                                    {moment(talk.startDateTime).format('HH:mm')} -{' '}
                                                    {moment(talk.endDateTime).format('HH:mm')}
                                                </Text>
                                            </HStack>
                                        ))}
                                    </VStack>
                                </VStack>
                            )}

                            <Field.Root
                                required
                                invalid={!!errors.startDateTime || !!errors.collision}
                            >
                                <Field.Label>Start Time *</Field.Label>
                                <Input
                                    name="startDateTime"
                                    type="datetime-local"
                                    step={60 * ROUND_TIME_INTERVAL}
                                    value={formData.startDateTime}
                                    onChange={handleInputChange}
                                />
                                <Field.HelperText>
                                    Time will be automatically rounded to the next{' '}
                                    {ROUND_TIME_INTERVAL}-minute interval for easier organization.
                                </Field.HelperText>
                                {errors.startDateTime && (
                                    <Field.ErrorText>{errors.startDateTime}</Field.ErrorText>
                                )}
                                {errors.collision && (
                                    <Field.ErrorText>{errors.collision}</Field.ErrorText>
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
                            {isSubmitting ? `${submitText.replace(/e?$/, 'ing')}...` : submitText}
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export type { TalkFormData }
