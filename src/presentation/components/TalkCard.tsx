import { Badge, Card, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { HiMapPin, HiMicrophone, HiSignal } from 'react-icons/hi2'
import { RoomEntity, TalkEntity } from '@domain'
import { useMoment } from '../hooks/useMoment'
import moment from 'moment'
import { GiDuration } from 'react-icons/gi'
import { CiCalendarDate } from 'react-icons/ci'

interface TalkCardProps {
    talk: TalkEntity
    room?: RoomEntity
}

export function TalkCard({ talk, room }: TalkCardProps) {
    const { now, toNow } = useMoment()
    const nowDate = now.toDate()

    // Determine the actual status based on timing if variant is not explicitly set
    const getStatus = () => {
        if (talk.startDateTime <= nowDate && talk.endDateTime > nowDate) return 'current'
        if (talk.startDateTime > nowDate) return 'upcoming'
        return 'past'
    }

    const status = getStatus()

    const getBadgeProps = () => {
        switch (status) {
            case 'current':
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
            case 'upcoming':
                return {
                    colorPalette: 'green' as const,
                    children: (
                        <Text title="Upcoming in ">{toNow(talk.startDateTime).humanize(true)}</Text>
                    )
                }
            case 'past':
                return { colorPalette: 'gray' as const, children: <Text>Past</Text> }
        }
    }

    const badgeProps = getBadgeProps()
    const isPast = status === 'past'

    return (
        <Card.Root opacity={isPast ? 0.8 : 1}>
            <Card.Body p={6}>
                <VStack align="flex-start" gap={4}>
                    <HStack justify="space-between" w="full" align="flex-start">
                        <VStack align="flex-start" gap={2} flex={1}>
                            <HStack gap={2}>
                                <HiMicrophone size={20} />
                                {isPast ? (
                                    <Text fontSize="lg" fontWeight="semibold" colorPalette="gray">
                                        {talk.name}
                                    </Text>
                                ) : (
                                    <Heading size="md" colorPalette="gray">
                                        {talk.name}
                                    </Heading>
                                )}
                            </HStack>

                            {talk.pitch && (
                                <Text colorPalette="gray" fontSize="sm" lineHeight={1.5}>
                                    {talk.pitch}
                                </Text>
                            )}
                        </VStack>

                        <Badge
                            colorPalette={badgeProps.colorPalette}
                            borderRadius="full"
                            px={3}
                            py={1}
                        >
                            {badgeProps.children}
                        </Badge>
                    </HStack>

                    <VStack align="flex-start" gap={2} w="full">
                        <HStack gap={4} fontSize="sm" colorPalette="gray" flexWrap="wrap">
                            <HStack gap={1}>
                                <CiCalendarDate size={16} />
                                <Text>{moment(talk.startDateTime).format('LLL')}</Text>
                            </HStack>

                            <HStack gap={1}>
                                <GiDuration size={16} />
                                <Text>
                                    {moment
                                        .duration(talk.getDurationMinutes(), 'minutes')
                                        .humanize()}
                                </Text>
                            </HStack>

                            {room && (
                                <HStack gap={1}>
                                    <HiMapPin size={16} />
                                    <Text>{room.name}</Text>
                                </HStack>
                            )}
                        </HStack>
                    </VStack>
                </VStack>
            </Card.Body>
        </Card.Root>
    )
}
