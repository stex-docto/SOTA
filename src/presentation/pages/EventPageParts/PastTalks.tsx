import { useEffect, useState } from 'react'
import { VStack, HStack, Text, Card, Badge, Box } from '@chakra-ui/react'
import { HiMicrophone, HiClock, HiMapPin, HiUser } from 'react-icons/hi2'
import { EventEntity, TalkEntity } from '@domain'
import { useDependencies } from '../../hooks/useDependencies'

interface PastTalksProps {
    event: EventEntity
}

export function PastTalks({ event }: PastTalksProps) {
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
    const pastTalks = talks
        .filter(talk => talk.endDateTime <= now)
        .sort((a, b) => b.startDateTime.getTime() - a.startDateTime.getTime())

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
        <Card.Root opacity={0.8}>
            <Card.Body p={6}>
                <VStack align="flex-start" gap={4}>
                    <HStack justify="space-between" w="full" align="flex-start">
                        <VStack align="flex-start" gap={2} flex={1}>
                            <HStack gap={2}>
                                <HiMicrophone size={20} />
                                <Text fontSize="lg" fontWeight="semibold" colorPalette="gray">
                                    {talk.name}
                                </Text>
                            </HStack>

                            {talk.pitch && (
                                <Text colorPalette="gray" fontSize="sm" lineHeight={1.5}>
                                    {talk.pitch}
                                </Text>
                            )}
                        </VStack>

                        <Badge colorPalette="gray" borderRadius="full" px={3} py={1}>
                            Past
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
                <Text colorPalette="gray">Loading past talks...</Text>
            </Box>
        )
    }

    return (
        <VStack gap={6} align="stretch">
            {pastTalks.length > 0 ? (
                <VStack gap={4} align="stretch">
                    {pastTalks.map(talk => (
                        <TalkCard key={talk.id.value} talk={talk} />
                    ))}
                </VStack>
            ) : (
                <Box textAlign="center" py={8}>
                    <Text colorPalette="gray">No past talks yet.</Text>
                </Box>
            )}
        </VStack>
    )
}
