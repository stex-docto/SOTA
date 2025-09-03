import { VStack, Box, Text } from '@chakra-ui/react'
import { EventEntity } from '@domain'
import { useMoment } from '../../hooks/useMoment'
import { useTalksForEvent } from '../../hooks/useTalksForEvent'
import { TalkCard } from '../../components/TalkCard'

interface UpcomingTalksProps {
    event: EventEntity
}

export function UpcomingTalks({ event }: UpcomingTalksProps) {
    const { now } = useMoment()
    const { upcomingTalks, currentTalks, talksMap, loading } = useTalksForEvent(event)

    const nowDate = now.toDate()

    if (loading) {
        return (
            <Box textAlign="center" py={8}>
                <Text colorPalette="gray">Loading upcoming talks...</Text>
            </Box>
        )
    }

    return (
        <VStack gap={6} align="stretch">
            {currentTalks.length + upcomingTalks.length > 0 ? (
                <VStack gap={4} align="stretch">
                    {[...currentTalks, ...upcomingTalks].map(talk => {
                        const talkWithRoom = talksMap.get(talk.id)
                        return (
                            <TalkCard key={talk.id.value} talk={talk} room={talkWithRoom?.room} />
                        )
                    })}
                </VStack>
            ) : (
                <Box textAlign="center" py={8}>
                    <Text colorPalette="gray">
                        No upcoming talks scheduled yet.
                        {event.startDate > nowDate && ' Submit your talk proposal!'}
                    </Text>
                </Box>
            )}
        </VStack>
    )
}
