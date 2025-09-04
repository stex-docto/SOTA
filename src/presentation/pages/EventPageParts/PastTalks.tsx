import { Box, Text, VStack } from '@chakra-ui/react'
import { EventEntity, TalkEntity } from '@domain'
import { useTalksForEvent } from '../../hooks/useTalksForEvent'
import { TalkCard } from '../../components/TalkCard'

interface PastTalksProps {
    event: EventEntity
    onEdit?: (talk: TalkEntity) => void
}

export function PastTalks({ event, onEdit }: PastTalksProps) {
    const { pastTalks, talksMap, loading } = useTalksForEvent(event)

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
                    {pastTalks.map(talk => {
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
            ) : (
                <Box textAlign="center" py={8}>
                    <Text colorPalette="gray">No past talks yet.</Text>
                </Box>
            )}
        </VStack>
    )
}
