import { Box, Text } from '@chakra-ui/react'
import { EventEntity, TalkEntity } from '@domain'
import { useTalksForEvent } from '../../hooks/useTalksForEvent'
import { TalkList } from '../../components/TalkList'

interface PastTalksProps {
    event: EventEntity
    onEdit?: (talk: TalkEntity) => void
}

export function PastTalks({ event, onEdit }: PastTalksProps) {
    const { pastTalks, loading } = useTalksForEvent(event)

    if (loading) {
        return (
            <Box textAlign="center" py={8}>
                <Text colorPalette="gray">Loading past talks...</Text>
            </Box>
        )
    }

    return (
        <TalkList talks={pastTalks} onEdit={onEdit} emptyMessage="No past talks yet." past={true} />
    )
}
