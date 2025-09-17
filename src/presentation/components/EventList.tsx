import { Link } from 'react-router-dom'
import { UserEventItem } from '@application'
import { Badge, Card, Center, HStack, Text, VStack } from '@chakra-ui/react'
import { HiHeart, HiMapPin, HiUser } from 'react-icons/hi2'
import { TbCameraQuestion } from 'react-icons/tb'

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
            <Text colorPalette="gray" textAlign="center" py={8}>
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
                        <Card.Body>
                            <HStack justify="space-between" align="flex-start" gap={6}>
                                {/* Event thumbnail SVG */}

                                <Center alignSelf="center" width="7rem">
                                    {eventItem.event.svgContent ? (
                                        <img
                                            src={`data:image/svg+xml;base64,${btoa(eventItem.event.svgContent.value)}`}
                                            alt={eventItem.event.title}
                                            style={{
                                                height: 'auto',
                                                objectFit: 'contain',
                                                borderRadius: '8px',
                                                flexShrink: 0
                                            }}
                                            onError={e => {
                                                ;(e.target as HTMLImageElement).style.display =
                                                    'none'
                                            }}
                                        />
                                    ) : (
                                        <TbCameraQuestion size={30} />
                                    )}
                                </Center>

                                <VStack align="flex-start" gap={3} flex={1}>
                                    <Text fontSize="lg" fontWeight="semibold" colorPalette="gray">
                                        {eventItem.event.title}
                                    </Text>

                                    <VStack
                                        align="flex-start"
                                        gap={1}
                                        fontSize="sm"
                                        colorPalette="gray"
                                    >
                                        <Text>Start: {formatDate(eventItem.event.startDate)}</Text>
                                        <Text>End: {formatDate(eventItem.event.endDate)}</Text>
                                    </VStack>

                                    {eventItem.event.location && (
                                        <HStack gap={2}>
                                            <HiMapPin size={16} />
                                            <Text fontSize="sm" colorPalette="gray">
                                                {eventItem.event.location}
                                            </Text>
                                        </HStack>
                                    )}
                                </VStack>

                                <Badge
                                    colorPalette={eventItem.type === 'created' ? 'blue' : 'red'}
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                >
                                    <HStack gap={1}>
                                        {eventItem.type === 'created' ? (
                                            <>
                                                <HiUser size={14} />
                                                <Text>Created</Text>
                                            </>
                                        ) : (
                                            <>
                                                <HiHeart size={14} />
                                                <Text>Saved</Text>
                                            </>
                                        )}
                                    </HStack>
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
