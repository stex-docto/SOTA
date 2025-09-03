import { useEffect, useState } from 'react'
import { VStack, HStack, Text, Card, Badge, Box, Heading } from '@chakra-ui/react'
import { HiMicrophone, HiClock, HiMapPin, HiUser } from 'react-icons/hi2'
import { EventEntity, TalkEntity } from '@domain'
import { useDependencies } from '../../hooks/useDependencies'

interface UpcomingTalksProps {
    event: EventEntity
}

export function UpcomingTalks({ event }: UpcomingTalksProps) {
    const { getTalksByEventUseCase } = useDependencies()
    const [talks, setTalks] = useState<TalkEntity[]>([])
    const [loading, setLoading] = useState(true)

    const rooms = event.getRooms()

    useEffect(() => {
        setLoading(true)

        const unsubscribe = getTalksByEventUseCase.subscribe({ eventId: event.id }, result => {
            setTalks(result.talks)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [event.id, getTalksByEventUseCase])

    const getRoomForTalk = (talk: TalkEntity) => {
        return rooms.find(r => r.id.equals(talk.roomId))
    }

    const now = new Date()
    const upcomingTalks = talks
        .filter(talk => talk.startDateTime > now)
        .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())

    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    const formatDuration = (talk: TalkEntity) => {
        const minutes = talk.getDurationMinutes()
        return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`
    }

    const TalkCard = ({ talk }: { talk: TalkEntity }) => (
        <Card.Root>
            <Card.Body p={6}>
                <VStack align="flex-start" gap={4}>
                    <HStack justify="space-between" w="full" align="flex-start">
                        <VStack align="flex-start" gap={2} flex={1}>
                            <HStack gap={2}>
                                <HiMicrophone size={20} />
                                <Heading size="md" colorPalette="gray">
                                    {talk.name}
                                </Heading>
                            </HStack>

                            {talk.pitch && (
                                <Text colorPalette="gray" fontSize="sm" lineHeight={1.5}>
                                    {talk.pitch}
                                </Text>
                            )}
                        </VStack>

                        <Badge colorPalette="green" borderRadius="full" px={3} py={1}>
                            Upcoming
                        </Badge>
                    </HStack>

                    <VStack align="flex-start" gap={2} w="full">
                        <HStack gap={4} fontSize="sm" colorPalette="gray" flexWrap="wrap">
                            <HStack gap={1}>
                                <HiClock size={16} />
                                <Text>{formatDateTime(talk.startDateTime)}</Text>
                            </HStack>

                            <HStack gap={1}>
                                <HiUser size={16} />
                                <Text>{formatDuration(talk)}</Text>
                            </HStack>

                            {getRoomForTalk(talk) && (
                                <HStack gap={1}>
                                    <HiMapPin size={16} />
                                    <Text>{getRoomForTalk(talk)!.name}</Text>
                                </HStack>
                            )}
                        </HStack>
                    </VStack>
                </VStack>
            </Card.Body>
        </Card.Root>
    )

    if (loading) {
        return (
            <Box textAlign="center" py={8}>
                <Text colorPalette="gray">Loading upcoming talks...</Text>
            </Box>
        )
    }

    return (
        <VStack gap={6} align="stretch">
            {upcomingTalks.length > 0 ? (
                <VStack gap={4} align="stretch">
                    {upcomingTalks.map(talk => (
                        <TalkCard key={talk.id.value} talk={talk} />
                    ))}
                </VStack>
            ) : (
                <Box textAlign="center" py={8}>
                    <Text colorPalette="gray">
                        No upcoming talks scheduled yet.
                        {event.startDate > now && ' Submit your talk proposal!'}
                    </Text>
                </Box>
            )}
        </VStack>
    )
}
