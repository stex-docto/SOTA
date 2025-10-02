import { Box, Text } from '@chakra-ui/react'
import { EventEntity, TalkEntity } from '@domain'
import { useMoment } from '../../hooks/useMoment'
import { useTalksForEvent } from '../../hooks/useTalksForEvent'
import { TalkList } from '../../components/TalkList'

interface UpcomingTalksProps {
    event: EventEntity
    onEdit?: (talk: TalkEntity) => void
}

export function UpcomingTalks({ event, onEdit }: UpcomingTalksProps) {
    const { now } = useMoment()
    const { upcomingTalks, currentTalks, loading } = useTalksForEvent(event)

    const nowDate = now.toDate()
    const allTalks = [...currentTalks, ...upcomingTalks]

    if (loading) {
        return (
            <Box textAlign="center" py={8}>
                <Text colorPalette="gray">Loading upcoming talks...</Text>
            </Box>
        )
    }

    const emptyMessage = `No upcoming talks scheduled yet.${event.startDate > nowDate ? ' Submit your talk proposal!' : ''}`

    return <TalkList talks={allTalks} onEdit={onEdit} emptyMessage={emptyMessage} past={false} />
}
