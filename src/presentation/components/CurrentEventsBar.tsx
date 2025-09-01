import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDependencies } from '../hooks/useDependencies'
import { UserEventItem } from '@application'
import moment from 'moment'
import { HiSignal, HiClock } from 'react-icons/hi2'
import { Box, HStack, Text, Badge, Separator } from '@chakra-ui/react'

function CurrentEventsBar() {
    const { currentUser } = useAuth()
    const { getUserAllEventsUseCase } = useDependencies()
    const [currentEvents, setCurrentEvents] = useState<UserEventItem[]>([])
    const [nextEvent, setNextEvent] = useState<UserEventItem | null>(null)
    const [timeToNext, setTimeToNext] = useState<string>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            if (!currentUser) {
                setCurrentEvents([])
                setNextEvent(null)
                setLoading(false)
                return
            }

            try {
                const result = await getUserAllEventsUseCase.execute()

                const now = new Date()

                // Get events that are currently happening (started but not ended)
                const current = result.events.filter(
                    eventItem => eventItem.event.startDate <= now && eventItem.event.endDate > now
                )

                // Get next upcoming event
                const upcoming = result.events
                    .filter(eventItem => eventItem.event.startDate > now)
                    .sort((a, b) => a.event.startDate.getTime() - b.event.startDate.getTime())

                setCurrentEvents(current)
                setNextEvent(upcoming.length > 0 ? upcoming[0] : null)
            } catch (error) {
                console.error('Failed to fetch events:', error)
                setCurrentEvents([])
                setNextEvent(null)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [currentUser, getUserAllEventsUseCase])

    useEffect(() => {
        if (!nextEvent) {
            setTimeToNext('')
            return
        }

        const updateCountdown = () => {
            const eventMoment = moment(nextEvent.event.startDate)
            const now = moment()

            if (eventMoment.isSameOrBefore(now)) {
                setTimeToNext('Starting now!')
                return
            }

            // Use moment's fromNow method but remove the "in " prefix since we add our own
            const timeUntil = eventMoment.fromNow().replace('in ', '')
            setTimeToNext(timeUntil)
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [nextEvent])

    if (!currentUser || loading) {
        return null
    }

    return (
        <Box colorPalette="gray" py={2}>
            <HStack gap={4} flexWrap="wrap" justify="center">
                {/* Live Events */}
                {currentEvents.length > 0 && (
                    <HStack gap={3} flexWrap="wrap">
                        {currentEvents.slice(0, 2).map(eventItem => (
                            <Link
                                key={`${eventItem.event.id.value}-${eventItem.type}`}
                                to={`/event/${eventItem.event.id.value}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <HStack
                                    gap={2}
                                    colorPalette="red"
                                    p={2}
                                    px={3}
                                    bg={{ base: 'colorPalette.50', _dark: 'colorPalette.900' }}
                                    borderWidth="1px"
                                    borderColor="colorPalette.200"
                                    borderRadius="4px"
                                    _hover={{
                                        bg: { base: 'colorPalette.100', _dark: 'colorPalette.800' }
                                    }}
                                >
                                    <HStack gap={1} align="center">
                                        <HiSignal size={18} color="red" />
                                        <Text
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            colorPalette="red"
                                        >
                                            Live
                                        </Text>
                                    </HStack>
                                    <Text
                                        fontSize="xs"
                                        fontWeight="medium"
                                        colorPalette="gray"
                                        maxW="150px"
                                        truncate
                                    >
                                        {eventItem.event.title}
                                    </Text>
                                </HStack>
                            </Link>
                        ))}
                        {currentEvents.length > 2 && (
                            <Badge colorPalette="gray" size="sm" borderRadius="full">
                                +{currentEvents.length - 2}
                            </Badge>
                        )}
                    </HStack>
                )}

                {/* Separator */}
                {currentEvents.length > 0 && nextEvent && timeToNext && (
                    <Separator orientation="vertical" height="20px" />
                )}

                {/* Next Event */}
                {nextEvent && timeToNext && (
                    <Link
                        to={`/event/${nextEvent.event.id.value}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <HStack
                            gap={2}
                            colorPalette="blue"
                            p={2}
                            px={3}
                            bg={{ base: 'colorPalette.50', _dark: 'colorPalette.900' }}
                            borderWidth="1px"
                            borderColor="colorPalette.200"
                            borderRadius="4px"
                            _hover={{
                                bg: { base: 'colorPalette.100', _dark: 'colorPalette.800' }
                            }}
                        >
                            <HStack gap={1} align="center">
                                <HiClock size={18} />
                                <Text fontSize="xs" fontWeight="semibold" colorPalette="blue">
                                    in {timeToNext}
                                </Text>
                            </HStack>
                            <Text
                                fontSize="xs"
                                fontWeight="medium"
                                colorPalette="gray"
                                maxW="150px"
                                truncate
                            >
                                {nextEvent.event.title}
                            </Text>
                        </HStack>
                    </Link>
                )}
            </HStack>
        </Box>
    )
}

export default CurrentEventsBar
