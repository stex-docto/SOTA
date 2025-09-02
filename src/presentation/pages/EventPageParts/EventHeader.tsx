import { Badge, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { EventEntity, EventId } from '@domain'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import RoomManagement from '@presentation/components/RoomManagement.tsx'
import { EventActions } from '@presentation/pages/EventPageParts/EventActions.tsx'
import {useEffect, useState} from "react";
import {useAuth} from "@presentation/hooks/useAuth.ts";

interface EventHeaderProps {
    event: EventEntity
    eventId: string
}

export function EventHeader({ event, eventId }: EventHeaderProps) {
    const { currentUser } = useAuth()
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }
    const [isEventCreator, setIsEventCreator] = useState(false)

    useEffect(() => {
        // Check if current user is the event creator
        if (currentUser && event) {
            setIsEventCreator(currentUser.id.value === event.createdBy.value)
        }
    }, [currentUser, event])

    return (
        <Box
            colorPalette="blue"
            p={8}
            bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="colorPalette.200"
        >
            <VStack gap={4} align="stretch">
                <HStack gap={4} justify="space-between">
                    <Heading size="3xl" colorPalette="gray">
                        {event.title}
                    </Heading>
                    <EventActions event={event} isEventCreator={isEventCreator}/>
                </HStack>

                <Badge colorPalette="gray" size="sm" fontFamily="mono">
                    Event ID: {eventId}
                </Badge>
                <VStack gap={2} align="start" fontSize="sm" colorPalette="gray">
                    <Text>
                        <Text as="span" fontWeight="semibold">
                            Start:
                        </Text>{' '}
                        {formatDate(event.startDate)}
                    </Text>
                    <Text>
                        <Text as="span" fontWeight="semibold">
                            End:
                        </Text>{' '}
                        {formatDate(event.endDate)}
                    </Text>
                    {event.location && (
                        <Text>
                            <Text as="span" fontWeight="semibold">
                                Location:
                            </Text>{' '}
                            {event.location}
                        </Text>
                    )}
                </VStack>

                <Box
                    colorPalette="gray"
                    p={4}
                    bg={{ base: 'colorPalette.100', _dark: 'colorPalette.800' }}
                    borderWidth="1px"
                    borderColor="colorPalette.200"
                    borderRadius="md"
                    w="full"
                >
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                        {event.description}
                    </ReactMarkdown>
                </Box>

                <RoomManagement eventId={EventId.from(eventId)} edition={isEventCreator} />
            </VStack>
        </Box>
    )
}
