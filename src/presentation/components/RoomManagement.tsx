import { useEffect, useState } from 'react'
import { VStack, HStack, Text, Button, Box, Spinner } from '@chakra-ui/react'
import { IoAddCircleOutline, IoWarningOutline } from 'react-icons/io5'
import { EventId, RoomEntity } from '@domain'
import { useDependencies } from '../hooks/useDependencies'
import RoomList from './RoomList'
import RoomForm, { RoomFormData } from './RoomForm'

export interface RoomManagementProps {
    eventId: EventId
    isEventCreator: boolean
}

type ViewMode = 'list' | 'create' | 'edit'

function RoomManagement({ eventId, isEventCreator }: RoomManagementProps) {
    const { getRoomsByEventUseCase, createRoomUseCase, updateRoomUseCase, deleteRoomUseCase } =
        useDependencies()

    const [rooms, setRooms] = useState<RoomEntity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [viewMode, setViewMode] = useState<ViewMode>('list')
    const [editingRoom, setEditingRoom] = useState<RoomEntity | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadRooms()
    }, [eventId]) // eslint-disable-line react-hooks/exhaustive-deps

    const loadRooms = async () => {
        try {
            setLoading(true)
            const result = await getRoomsByEventUseCase.execute({ eventId })
            setRooms(result.rooms)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load rooms')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateRoom = async (formData: RoomFormData) => {
        try {
            setIsSubmitting(true)
            setError('')

            await createRoomUseCase.execute({
                eventId,
                name: formData.name,
                description: formData.description
            })

            await loadRooms()
            setViewMode('list')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create room')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateRoom = async (formData: RoomFormData) => {
        if (!editingRoom) return

        try {
            setIsSubmitting(true)
            setError('')

            await updateRoomUseCase.execute({
                eventId,
                roomId: editingRoom.id,
                name: formData.name,
                description: formData.description
            })

            await loadRooms()
            setViewMode('list')
            setEditingRoom(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update room')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteRoom = async (room: RoomEntity) => {
        if (!confirm(`Are you sure you want to delete "${room.name}"? This action cannot be undone.`)) {
            return
        }

        try {
            setIsSubmitting(true)
            setError('')

            await deleteRoomUseCase.execute({
                eventId,
                roomId: room.id
            })

            await loadRooms()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete room')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditClick = (room: RoomEntity) => {
        setEditingRoom(room)
        setViewMode('edit')
    }


    const handleCancel = () => {
        setViewMode('list')
        setEditingRoom(null)
        setError('')
    }

    if (loading) {
        return (
            <Box p={4} textAlign="center">
                <Spinner size="md" />
                <Text mt={2} colorPalette="gray">Loading rooms...</Text>
            </Box>
        )
    }

    return (
        <Box colorPalette="gray">
            <VStack gap={6} align="stretch">
                <HStack justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="semibold" colorPalette="gray">
                        Event Rooms
                    </Text>
                    {isEventCreator && viewMode === 'list' && (
                        <Button 
                            colorPalette="blue" 
                            onClick={() => setViewMode('create')}
                            size="sm"
                        >
                            <IoAddCircleOutline style={{ marginRight: '8px' }} />
                            Add Room
                        </Button>
                    )}
                </HStack>

                {error && (
                    <Box 
                        p={3} 
                        bg="red.50" 
                        borderRadius="md" 
                        border="1px solid" 
                        borderColor="red.200"
                        colorPalette="red"
                    >
                        <HStack gap={2}>
                            <IoWarningOutline />
                            <Text fontSize="sm">
                                {error}
                            </Text>
                        </HStack>
                    </Box>
                )}

                {viewMode === 'list' && (
                    <RoomList
                        rooms={rooms}
                        isEventCreator={isEventCreator}
                        onEdit={isEventCreator ? handleEditClick : undefined}
                        onDelete={isEventCreator ? handleDeleteRoom : undefined}
                    />
                )}

                {viewMode === 'create' && (
                    <RoomForm
                        title="Create New Room"
                        onSubmit={handleCreateRoom}
                        onCancel={handleCancel}
                        isSubmitting={isSubmitting}
                        error={error}
                        submitButtonText="Create Room"
                    />
                )}

                {viewMode === 'edit' && editingRoom && (
                    <RoomForm
                        title="Edit Room"
                        initialData={{
                            name: editingRoom.name,
                            description: editingRoom.description
                        }}
                        onSubmit={handleUpdateRoom}
                        onCancel={handleCancel}
                        isSubmitting={isSubmitting}
                        error={error}
                        submitButtonText="Update Room"
                    />
                )}

            </VStack>
        </Box>
    )
}

export default RoomManagement
