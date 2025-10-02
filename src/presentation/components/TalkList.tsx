import { Badge, Box, Icon, Text, Timeline, VStack } from '@chakra-ui/react'
import { TalkEntity } from '@domain'
import { useMoment } from '../hooks/useMoment'
import { TalkCard } from './TalkCard'
import moment from 'moment'
import { HiMicrophone, HiSignal } from 'react-icons/hi2'
import { TalkWithRoom } from '@presentation/hooks/useTalksForEvent.ts'
import { CiCalendarDate } from 'react-icons/ci'

interface TalkListProps {
    talks: TalkWithRoom[]
    onEdit?: (talk: TalkEntity) => void
    emptyMessage: string
    past: boolean
}

export function TalkList({ talks, onEdit, emptyMessage, past = true }: TalkListProps) {
    const { now, toNow } = useMoment()
    const nowDate = now.toDate()

    // Group talks by date
    const groupedTalks = talks.reduce(
        (groups, talk) => {
            const dateKey = moment(talk.talk.startDateTime).format('YYYY-MM-DD')
            const timeKey = moment(talk.talk.startDateTime).format('HH:mm')
            if (!groups[dateKey]) {
                groups[dateKey] = {}
            }
            if (!groups[dateKey][timeKey]) {
                groups[dateKey][timeKey] = []
            }
            groups[dateKey][timeKey].push(talk)
            return groups
        },
        {} as Record<string, Record<string, TalkWithRoom[]>>
    )

    // Sort date keys (ascending or descending based on colorPalette)
    const sortKeys = (obj: Record<string, unknown>) =>
        past
            ? Object.keys(obj).sort().reverse() // Past talks: most recent first
            : Object.keys(obj).sort() // Upcoming talks: earliest first

    const getBadgeProps = (talk: TalkEntity) => {
        if (talk.startDateTime <= nowDate && talk.endDateTime > nowDate) {
            return {
                colorPalette: 'blue' as const,
                text: 'Current',
                children: (
                    <>
                        <HiSignal size={18} />
                        <Text> Live</Text>
                    </>
                )
            }
        }
        if (talk.startDateTime > nowDate) {
            return {
                colorPalette: 'green' as const,
                children: (
                    <Text title="Upcoming in ">{toNow(talk.startDateTime).humanize(true)}</Text>
                )
            }
        }
        return { colorPalette: 'gray' as const, children: <Text>Past</Text> }
    }

    if (talks.length === 0) {
        return (
            <Box textAlign="center" py={8}>
                <Text colorPalette="gray">{emptyMessage}</Text>
            </Box>
        )
    }

    return (
        <VStack gap={6} align="stretch">
            {sortKeys(groupedTalks).map(dateKey => {
                const dateTalks = groupedTalks[dateKey]
                const date = moment(dateKey)
                const isToday = now.isSame(date, 'day')
                const isYesterday = now.clone().subtract(1, 'day').isSame(date, 'day')

                // Determine date label
                const dateLabel = isToday
                    ? 'Today'
                    : past && isYesterday
                      ? 'Yesterday'
                      : date.format('dddd, MMMM D, YYYY')

                return (
                    <VStack key={dateKey} gap={3} align="stretch">
                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            colorPalette={past ? 'gray' : 'blue'}
                            borderBottomWidth="2px"
                            borderColor="colorPalette.200"
                            pb={2}
                        >
                            {dateLabel}
                        </Text>
                        <Timeline.Root>
                            {sortKeys(dateTalks).map(timeKey => {
                                const talks = dateTalks[timeKey]
                                const firstTalk = talks[0]
                                const date = moment(firstTalk.talk.startDateTime)
                                const badgeProps = getBadgeProps(firstTalk.talk)
                                return (
                                    <Timeline.Item key={`${dateKey}-${timeKey}`}>
                                        <Timeline.Connector>
                                            <Timeline.Separator />
                                            <Timeline.Indicator>
                                                <Icon fontSize="xs">
                                                    <HiMicrophone />
                                                </Icon>
                                            </Timeline.Indicator>
                                        </Timeline.Connector>
                                        <Timeline.Content>
                                            <Timeline.Title
                                                title={date.format('L LT')}
                                                whiteSpace="nowrap"
                                            >
                                                <Icon>
                                                    <CiCalendarDate />
                                                </Icon>
                                                <Text flex={1}>{date.format('LT')}</Text>
                                                <Badge
                                                    colorPalette={badgeProps.colorPalette}
                                                    px={3}
                                                    py={1}
                                                >
                                                    {badgeProps.children}
                                                </Badge>
                                            </Timeline.Title>
                                            <VStack align="stretch">
                                                {talks.map(talk => (
                                                    <TalkCard
                                                        key={talk.talk.id.value}
                                                        talk={talk.talk}
                                                        room={talk?.room}
                                                        onEdit={onEdit}
                                                    />
                                                ))}
                                            </VStack>
                                        </Timeline.Content>
                                    </Timeline.Item>
                                )
                            })}
                        </Timeline.Root>
                    </VStack>
                )
            })}
        </VStack>
    )
}
