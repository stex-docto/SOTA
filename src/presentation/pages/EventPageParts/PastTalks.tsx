import { Box, Text, VStack } from '@chakra-ui/react'
import { EventEntity, TalkEntity } from '@domain'
import { useTalksForEvent } from '../../hooks/useTalksForEvent'
import { TalkCard } from '../../components/TalkCard'
import { useMoment } from '../../hooks/useMoment'
import moment from 'moment'

interface PastTalksProps {
    event: EventEntity
    onEdit?: (talk: TalkEntity) => void
}

export function PastTalks({ event, onEdit }: PastTalksProps) {
    const { now } = useMoment()
    const { pastTalks, talksMap, loading } = useTalksForEvent(event)

    // Group talks by date
    const groupedTalks = pastTalks.reduce(
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

    // Sort date keys in descending order (most recent first)
    const sortedDates = Object.keys(groupedTalks).sort().reverse()

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
                <VStack gap={6} align="stretch">
                    {sortedDates.map(dateKey => {
                        const talks = groupedTalks[dateKey]
                        const date = moment(dateKey)
                        const isToday = now.isSame(date, 'day')
                        const isYesterday = now.clone().subtract(1, 'day').isSame(date, 'day')

                        return (
                            <VStack key={dateKey} gap={3} align="stretch">
                                <Text
                                    fontSize="lg"
                                    fontWeight="semibold"
                                    colorPalette="gray"
                                    borderBottomWidth="2px"
                                    borderColor="colorPalette.200"
                                    pb={2}
                                >
                                    {isToday
                                        ? 'Today'
                                        : isYesterday
                                          ? 'Yesterday'
                                          : date.format('dddd, MMMM D, YYYY')}
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
                    <Text colorPalette="gray">No past talks yet.</Text>
                </Box>
            )}
        </VStack>
    )
}
