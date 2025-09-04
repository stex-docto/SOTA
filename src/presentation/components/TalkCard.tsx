import { Badge, Button, Card, Heading, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import {
    HiChevronDown,
    HiChevronRight,
    HiMapPin,
    HiMicrophone,
    HiPencil,
    HiSignal,
    HiUser
} from 'react-icons/hi2'
import { RoomEntity, TalkEntity, UserEntity } from '@domain'
import { useMoment } from '../hooks/useMoment'
import { useAuth } from '../hooks/useAuth'
import { useDependencies } from '../hooks/useDependencies'
import moment from 'moment'
import { GiDuration } from 'react-icons/gi'
import { CiCalendarDate } from 'react-icons/ci'
import { useEffect, useState } from 'react'

interface TalkCardProps {
    talk: TalkEntity
    room?: RoomEntity
    onEdit?: (talk: TalkEntity) => void
}

export function TalkCard({ talk, room, onEdit }: TalkCardProps) {
    const { now, toNow } = useMoment()
    const { currentUser } = useAuth()
    const { getUserUseCase } = useDependencies()
    const nowDate = now.toDate()

    // State for user info and pitch expand/collapse
    const [creator, setCreator] = useState<UserEntity | null>(null)
    const [isPitchExpanded, setIsPitchExpanded] = useState(false)
    const [loadingUser, setLoadingUser] = useState(false)

    // Check if current user is the creator of this talk
    const isCreator = currentUser && talk.createdBy.equals(currentUser.id)

    // Fetch creator information
    useEffect(() => {
        const fetchCreator = async () => {
            if (loadingUser) return
            setLoadingUser(true)
            try {
                const result = await getUserUseCase.execute({ userId: talk.createdBy })
                setCreator(result.user)
            } catch (error) {
                console.error('Failed to fetch talk creator:', error)
            } finally {
                setLoadingUser(false)
            }
        }

        fetchCreator()
    }, [talk.createdBy, getUserUseCase, loadingUser])

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

    // Helper functions for pitch display
    const PITCH_MAX_LENGTH = 150
    const shouldTruncatePitch = talk.pitch && talk.pitch.length > PITCH_MAX_LENGTH
    const displayPitch =
        shouldTruncatePitch && !isPitchExpanded
            ? `${talk.pitch.slice(0, PITCH_MAX_LENGTH)}...`
            : talk.pitch

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

                            {/* Creator information */}
                            {creator && (
                                <HStack gap={1} fontSize="sm" colorPalette="gray">
                                    <HiUser size={14} />
                                    <Text fontWeight="medium">
                                        {creator.displayName || 'Anonymous User'}
                                        {isCreator && ' (You)'}
                                    </Text>
                                </HStack>
                            )}

                            {/* Pitch with expand/collapse functionality */}
                            {talk.pitch && (
                                <VStack align="flex-start" gap={2} w="full">
                                    <Text colorPalette="gray" fontSize="sm" lineHeight={1.5}>
                                        {displayPitch}
                                    </Text>
                                    {shouldTruncatePitch && (
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            colorPalette="blue"
                                            onClick={() => setIsPitchExpanded(!isPitchExpanded)}
                                            leftIcon={
                                                isPitchExpanded ? (
                                                    <HiChevronDown size={12} />
                                                ) : (
                                                    <HiChevronRight size={12} />
                                                )
                                            }
                                        >
                                            {isPitchExpanded ? 'Show less' : 'Read more'}
                                        </Button>
                                    )}
                                </VStack>
                            )}
                        </VStack>

                        <HStack gap={2}>
                            {isCreator && onEdit && (
                                <IconButton
                                    size="sm"
                                    variant="ghost"
                                    colorPalette="gray"
                                    onClick={() => onEdit(talk)}
                                    title="Edit talk"
                                >
                                    <HiPencil size={14} />
                                </IconButton>
                            )}
                            <Badge
                                colorPalette={badgeProps.colorPalette}
                                borderRadius="full"
                                px={3}
                                py={1}
                            >
                                {badgeProps.children}
                            </Badge>
                        </HStack>
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
