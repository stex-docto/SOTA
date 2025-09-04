import {
    Badge,
    Card,
    Grid,
    GridItem,
    HStack,
    IconButton,
    StackSeparator,
    Tag,
    Text,
    VStack
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { HiMapPin, HiMicrophone, HiPencil, HiSignal, HiUser } from 'react-icons/hi2'
import { RoomEntity, TalkEntity, UserEntity } from '@domain'
import { useMoment } from '../hooks/useMoment'
import { useAuth } from '../hooks/useAuth'
import { useDependencies } from '../hooks/useDependencies'
import moment from 'moment'
import { GiDuration } from 'react-icons/gi'
import { CiCalendarDate } from 'react-icons/ci'
import { useEffect, useState } from 'react'
import { FaUserAstronaut } from 'react-icons/fa'

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
    const [loadingUser, setLoadingUser] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

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
    const attributeMaxWidth = '150px'

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't trigger card click if clicking on edit button
        if ((e.target as HTMLElement).closest('button')) {
            return
        }
        setIsExpanded(!isExpanded)
    }

    return (
        <Card.Root
            opacity={isPast ? 0.8 : 1}
            cursor="pointer"
            onClick={handleCardClick}
            _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}
            transition="background-color 0.2s"
        >
            <Card.Body p={4}>
                <VStack align="stretch" gap={4}>
                    <HStack justify="space-between" w="full" align="center">
                        <HiMicrophone size={20} />
                        <Text textStyle="md" colorPalette="gray" truncate flex={1}>
                            {talk.name}
                        </Text>

                        <StackSeparator />

                        {isCreator && onEdit && (
                            <IconButton
                                size="sm"
                                variant="ghost"
                                colorPalette="gray"
                                onClick={() => onEdit(talk)}
                                title="Edit talk"
                            >
                                <HiPencil />
                            </IconButton>
                        )}

                        <Badge colorPalette={badgeProps.colorPalette} px={3} py={1}>
                            {badgeProps.children}
                        </Badge>
                    </HStack>

                    <Grid
                        gap={2}
                        fontSize="sm"
                        colorPalette="gray"
                        templateColumns={`repeat(auto-fill, minmax(${attributeMaxWidth}, min-content))`}
                    >
                        <GridItem>
                            <Tag.Root maxW={attributeMaxWidth}>
                                <Tag.StartElement>
                                    <CiCalendarDate />
                                </Tag.StartElement>
                                <Tag.Label>
                                    {moment(talk.startDateTime).format(
                                        now.isSame(talk.startDateTime, 'date') ? 'LT' : 'L LT'
                                    )}
                                </Tag.Label>
                            </Tag.Root>
                        </GridItem>

                        <GridItem>
                            <Tag.Root maxW={attributeMaxWidth}>
                                <Tag.StartElement>
                                    <GiDuration />
                                </Tag.StartElement>
                                <Tag.Label>
                                    {moment
                                        .duration(talk.getDurationMinutes(), 'minutes')
                                        .humanize()}
                                </Tag.Label>
                            </Tag.Root>
                        </GridItem>

                        {/* Creator information */}

                        <GridItem>
                            <Tag.Root
                                maxW={attributeMaxWidth}
                                title={isCreator ? "You're the creator" : 'creator'}
                            >
                                <Tag.StartElement>
                                    {isCreator ? <FaUserAstronaut /> : <HiUser />}
                                </Tag.StartElement>
                                <Tag.Label>{creator?.displayName || 'Anonymous User'}</Tag.Label>
                            </Tag.Root>
                        </GridItem>

                        {room && (
                            <GridItem>
                                <Tag.Root maxW={attributeMaxWidth}>
                                    <Tag.StartElement>
                                        <HiMapPin />
                                    </Tag.StartElement>
                                    <Tag.Label>{room.name}</Tag.Label>
                                </Tag.Root>
                            </GridItem>
                        )}
                    </Grid>

                    {isExpanded && talk.pitch && <ReactMarkdown>{talk.pitch}</ReactMarkdown>}
                </VStack>
            </Card.Body>
        </Card.Root>
    )
}
