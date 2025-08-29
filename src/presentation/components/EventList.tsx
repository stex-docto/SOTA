import { Link } from 'react-router-dom'
import { UserEventItem } from '@application'
import { VStack, HStack, Text, Card, Badge } from '@chakra-ui/react'

interface EventListProps {
    events: UserEventItem[]
    isPastEvent?: boolean
    emptyMessage: string
}

function EventList({ events, isPastEvent = false, emptyMessage }: EventListProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    if (events.length === 0) {
        return (
            <Text color="fg.muted" textAlign="center" py={8}>
                {emptyMessage}
            </Text>
        )
    }

    return (
        <VStack gap={4} align="stretch">
            {events.map(eventItem => (
                <Link
                    key={`${eventItem.event.id.value}-${eventItem.type}`}
                    to={`/event/${eventItem.event.id.value}`}
                    style={{ textDecoration: 'none' }}
                >
                    <Card.Root
                        opacity={isPastEvent ? 0.7 : 1}
                        _hover={{
                            transform: 'translateY(-2px)',
                            shadow: 'md'
                        }}
                        transition="all 0.2s ease"
                        cursor="pointer"
                    >
                        <Card.Body p={6}>
                            <HStack justify="space-between" align="flex-start">
                                <VStack align="flex-start" gap={3} flex={1}>
                                    <Text fontSize="lg" fontWeight="semibold" color="fg.emphasized">
                                        {eventItem.event.title}
                                    </Text>

                                    <VStack
                                        align="flex-start"
                                        gap={1}
                                        fontSize="sm"
                                        color="fg.muted"
                                    >
                                        <Text>Start: {formatDate(eventItem.event.startDate)}</Text>
                                        <Text>End: {formatDate(eventItem.event.endDate)}</Text>
                                    </VStack>

                                    {eventItem.event.location && (
                                        <HStack gap={2}>
                                            <Text fontSize="sm">📍</Text>
                                            <Text fontSize="sm" color="fg.muted">
                                                {eventItem.event.location}
                                            </Text>
                                        </HStack>
                                    )}
                                </VStack>

                                <Badge
                                    colorScheme={eventItem.type === 'created' ? 'blue' : 'red'}
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                >
                                    {eventItem.type === 'created' ? '👤 Created' : '❤️ Saved'}
                                </Badge>
                            </HStack>
                        </Card.Body>
                    </Card.Root>
                </Link>
            ))}
        </VStack>
    )
}

export default EventList
