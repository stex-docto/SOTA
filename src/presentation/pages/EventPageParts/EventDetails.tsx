import { Box, Flex, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { EventEntity } from '@domain'
import RoomManagement from '@presentation/components/RoomManagement.tsx'
import { useEffect, useState } from 'react'
import { useAuth } from '@/presentation/hooks/useAuth'
import { HiCalendar, HiMapPin } from 'react-icons/hi2'
import moment from 'moment'
import { FaArrowRightFromBracket, FaArrowRightToBracket } from 'react-icons/fa6'

interface EventDetailsProps {
    event: EventEntity
}

export function EventDetails({ event }: EventDetailsProps) {
    const [isEventCreator, setIsEventCreator] = useState(false)
    const { currentUser } = useAuth()

    useEffect(() => {
        // Check if current user is the event creator
        if (currentUser && event) {
            setIsEventCreator(currentUser.id.value === event.createdBy.value)
        }
    }, [currentUser, event])

    return (
        <VStack gap={6} align="stretch">
            {/* Event Dates */}
            <VStack gap={4} align="stretch">
                <Heading size="md" colorPalette="blue">
                    <HStack gap={2}>
                        <HiCalendar size={20} />
                        <Text>Event Schedule</Text>
                    </HStack>
                </Heading>
                <Stack
                    colorPalette="blue"
                    p={4}
                    bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                    borderRadius="lg"
                    borderWidth="1px"
                    gap={2}
                    borderColor={{ base: 'colorPalette.200', _dark: 'colorPalette.800' }}
                    direction={{ base: 'column', md: 'row' }}
                    align="space-between"
                    justify="stretch"
                >
                    <Flex gap={2} align="center">
                        <Text title="From">{moment(event.startDate).format('LLL')}</Text>
                    </Flex>

                    <Flex align="center" gap={2}>
                        {' '}
                        <FaArrowRightToBracket />
                        <Text colorPalette="gray" title="duration">
                            {moment
                                .duration(moment(event.endDate).diff(moment(event.startDate)))
                                .humanize()}
                        </Text>
                        <FaArrowRightFromBracket />
                    </Flex>

                    <Flex gap={2} align="center">
                        <Text title="up to">{moment(event.endDate).format('LLL')}</Text>
                    </Flex>
                </Stack>
            </VStack>

            {/* Location */}
            {event.location && (
                <VStack gap={4} align="stretch">
                    <Heading size="md" colorPalette="blue">
                        <HStack gap={2}>
                            <HiMapPin size={20} />
                            <Text>Location</Text>
                        </HStack>
                    </Heading>
                    <Box
                        colorPalette="blue"
                        p={4}
                        bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={{ base: 'colorPalette.200', _dark: 'colorPalette.800' }}
                    >
                        <Text>{event.location}</Text>
                    </Box>
                </VStack>
            )}

            {/* Event Description */}
            <Heading size="md" colorPalette="blue">
                Event Description
            </Heading>
            <Box
                colorPalette="blue"
                p={4}
                bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={{ base: 'colorPalette.200', _dark: 'colorPalette.800' }}
            >
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>{event.description}</ReactMarkdown>
            </Box>

            {/* Talk Guidelines */}
            <Heading size="md" colorPalette="green">
                Talk Guidelines
            </Heading>
            <Box
                colorPalette="green"
                p={4}
                bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={{ base: 'colorPalette.200', _dark: 'colorPalette.800' }}
            >
                <ReactMarkdown>{event.talkRules}</ReactMarkdown>
            </Box>

            {/* Room Management */}
            <RoomManagement eventId={event.id} edition={isEventCreator} />
        </VStack>
    )
}
