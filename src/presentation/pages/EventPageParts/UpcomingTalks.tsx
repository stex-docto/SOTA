import { Box, Text, VStack } from '@chakra-ui/react'
import { EventEntity, TalkEntity } from '@domain'
import { useMoment } from '../../hooks/useMoment'
import { useTalksForEvent } from '../../hooks/useTalksForEvent'
import { TalkCard } from '../../components/TalkCard'
import moment from 'moment'

interface UpcomingTalksProps {
    event: EventEntity
    onEdit?: (talk: TalkEntity) => void
}

export function UpcomingTalks({ event, onEdit }: UpcomingTalksProps) {
    const { now } = useMoment()
    const { upcomingTalks, currentTalks, talksMap, loading } = useTalksForEvent(event)

    const nowDate = now.toDate()

    // Group talks by date
    const groupedTalks = [...currentTalks, ...upcomingTalks].reduce(
        (groups, talk) => {
            const dateKey = moment(talk.startDateTime).format('YYYY-MM-DD')
            if (!groups[dateKey]) {
                groups[dateKey] = []
            }
            groups[dateKey].push(talk)
            return groups
        },
        {} as Record<string, TalkEntity[]>
    )

    // Sort date keys
    const sortedDates = Object.keys(groupedTalks).sort()

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
                <VStack gap={6} align="stretch">
                    {sortedDates.map(dateKey => {
                        const talks = groupedTalks[dateKey]
                        const date = moment(dateKey)
                        const isToday = now.isSame(date, 'day')

                        return (
                            <VStack key={dateKey} gap={3} align="stretch">
                                <Text
                                    fontSize="lg"
                                    fontWeight="semibold"
                                    colorPalette="blue"
                                    borderBottomWidth="2px"
                                    borderColor="colorPalette.200"
                                    pb={2}
                                >
                                    {isToday ? 'Today' : date.format('dddd, MMMM D, YYYY')}
                                </Text>
                                <VStack gap={3} align="stretch">
                                    {talks.map(talk => {
                                        const talkWithRoom = talksMap.get(talk.id)
                                        return (
                                            <TalkCard
                                                key={talk.id.value}
                                                talk={talk}
                                                room={talkWithRoom?.room}
                                                onEdit={onEdit}
                                            />
                                        )
                                    })}
                                </VStack>
                            </VStack>
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
