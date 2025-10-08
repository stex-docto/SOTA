import { Card, Grid, GridItem, IconButton, Tag, Text, VStack } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { HiMapPin, HiMiniChevronDown, HiMiniChevronUp, HiPencil, HiUser } from 'react-icons/hi2'
import { RoomEntity, TalkEntity, UserEntity } from '@domain'
import { useMoment } from '../hooks/useMoment'
import { useAuth } from '../hooks/useAuth'
import moment from 'moment'
import { GiDuration } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import { FaUserAstronaut } from 'react-icons/fa'
import { useDependencies } from '@presentation/hooks/useDependencies.ts'

interface TalkCardProps {
    talk: TalkEntity
    room?: RoomEntity
    onEdit?: (talk: TalkEntity) => void
}

export function TalkCard({ talk, room, onEdit }: TalkCardProps) {
    const { now } = useMoment()
    const { currentUser } = useAuth()
    const { getUserUseCase } = useDependencies()
    const nowDate = now.toDate()

    // State for user info and pitch expand/collapse
    const [creator, setCreator] = useState<UserEntity | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)

    // Check if current user is the creator of this talk
    const isCreator = currentUser && talk.createdBy.equals(currentUser.id)

    // Fetch creator information
    useEffect(() => {
        getUserUseCase.get(talk.createdBy).then(result => {
            setCreator(result)
        })
    }, [talk.createdBy, getUserUseCase])

    // Determine the actual status based on timing if variant is not explicitly set
    const getStatus = () => {
        if (talk.startDateTime <= nowDate && talk.endDateTime > nowDate) return 'current'
        if (talk.startDateTime > nowDate) return 'upcoming'
        return 'past'
    }

    const status = getStatus()

    const isPast = status === 'past'
    const attributeMaxWidth = '100px'

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't trigger card click if clicking on edit button
        if ((e.target as HTMLElement).closest('button')) {
            return
        }
        setIsExpanded(!isExpanded)
    }

    return (
        <Card.Root
            flex={1}
            opacity={isPast ? 0.8 : 1}
            cursor="pointer"
            onClick={handleCardClick}
            _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}
            transition="background-color 0.2s"
        >
            <Card.Body p={2}>
                <VStack align="stretch" p={2}>
                    <Text textStyle="md" colorPalette="gray" flex={1} wordBreak="break-word">
                        {talk.name}
                    </Text>

                    <Grid
                        alignItems="center"
                        justifyContent="start"
                        gap={2}
                        fontSize="sm"
                        colorPalette="gray"
                        templateColumns={`repeat(auto-fill, minmax(${attributeMaxWidth}, min-content))`}
                    >
                        {room && (
                            <GridItem>
                                <Tag.Root maxW={attributeMaxWidth} title={room.name}>
                                    <Tag.StartElement>
                                        <HiMapPin />
                                    </Tag.StartElement>
                                    <Tag.Label>{room.name}</Tag.Label>
                                </Tag.Root>
                            </GridItem>
                        )}

                        <GridItem>
                            <Tag.Root
                                maxW={attributeMaxWidth}
                                title={moment
                                    .duration(talk.getDurationMinutes(), 'minutes')
                                    .humanize()}
                            >
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

                        <GridItem>
                            <Tag.Root
                                maxW={attributeMaxWidth}
                                title={
                                    isCreator
                                        ? "You're the creator"
                                        : creator?.displayName || 'Anonymous user'
                                }
                            >
                                <Tag.StartElement>
                                    {isCreator ? <FaUserAstronaut /> : <HiUser />}
                                </Tag.StartElement>
                                <Tag.Label>{creator?.displayName || 'Anonymous User'}</Tag.Label>
                            </Tag.Root>
                        </GridItem>
                        <GridItem>
                            {talk.pitch && isExpanded && <HiMiniChevronUp title="Fold pitch" />}
                            {talk.pitch && !isExpanded && <HiMiniChevronDown title="Open pitch" />}
                        </GridItem>
                    </Grid>

                    {isExpanded && (
                        <>
                            {talk.pitch ? (
                                <ReactMarkdown>{talk.pitch}</ReactMarkdown>
                            ) : (
                                <Text color="fg.subtle">
                                    No pitch ¯\_(ツ)_/¯, hope title is enough 😅
                                </Text>
                            )}
                            {isCreator && onEdit && (
                                <IconButton
                                    alignSelf="end"
                                    variant="solid"
                                    colorPalette="blue"
                                    onClick={() => onEdit(talk)}
                                    title="Edit talk"
                                >
                                    <HiPencil />
                                </IconButton>
                            )}
                        </>
                    )}
                </VStack>
            </Card.Body>
        </Card.Root>
    )
}
