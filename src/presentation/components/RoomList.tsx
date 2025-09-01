import { Box, Button, Card, HStack, Text, VStack } from '@chakra-ui/react'
import { IoPencilOutline, IoTrashOutline } from 'react-icons/io5'

import { RoomEntity } from '@domain'

export interface RoomListProps {
    rooms: RoomEntity[]
    isEventCreator: boolean
    onEdit?: (room: RoomEntity) => void
    onDelete?: (room: RoomEntity) => void
}

function RoomList({ rooms, isEventCreator, onEdit, onDelete }: RoomListProps) {
    if (rooms.length === 0) {
        return (
            <Box
                p={6}
                textAlign="center"
                borderRadius="md"
                border="1px dashed"
                colorPalette="gray"
                bg={{ base: 'colorPalette.50', _dark: 'colorPalette.900' }}
                borderColor={{ base: 'colorPalette.300', _dark: 'colorPalette.600' }}
            >
                <Text mb={2} colorPalette="gray">
                    No rooms have been created for this event yet.
                </Text>
                {isEventCreator && (
                    <Text
                        fontSize="sm"
                        colorPalette="gray"
                        color={{ base: 'colorPalette.500', _dark: 'colorPalette.400' }}
                    >
                        Add rooms where talks will be held.
                    </Text>
                )}
            </Box>
        )
    }

    return (
        <VStack gap={4} align="stretch">
            {rooms.map(room => (
                <Card.Root
                    key={room.id.value}
                    bg={{ base: 'colorPalette.50', _dark: 'colorPalette.900' }}
                >
                    <Card.Body p={4}>
                        <HStack justify="space-between" align="flex-start">
                            <VStack align="flex-start" gap={1} flex={1}>
                                <Text fontSize="md" fontWeight="semibold" colorPalette="gray">
                                    {room.name}
                                </Text>
                                {room.description && (
                                    <Text fontSize="sm" colorPalette="gray">
                                        {room.description}
                                    </Text>
                                )}
                            </VStack>

                            {isEventCreator && (onEdit || onDelete) && (
                                <HStack gap={2}>
                                    {onEdit && (
                                        <Button
                                            onClick={() => onEdit(room)}
                                            colorPalette="blue"
                                            variant="outline"
                                            size="sm"
                                            aria-label={`Edit room ${room.name}`}
                                        >
                                            <IoPencilOutline style={{ marginRight: '4px' }} />
                                            Edit
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            onClick={() => onDelete(room)}
                                            colorPalette="red"
                                            variant="outline"
                                            size="sm"
                                            aria-label={`Delete room ${room.name}`}
                                        >
                                            <IoTrashOutline style={{ marginRight: '4px' }} />
                                            Delete
                                        </Button>
                                    )}
                                </HStack>
                            )}
                        </HStack>
                    </Card.Body>
                </Card.Root>
            ))}
        </VStack>
    )
}

export default RoomList
