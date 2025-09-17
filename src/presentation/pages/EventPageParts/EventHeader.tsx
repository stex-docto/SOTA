import { Heading, HStack, Box } from '@chakra-ui/react'
import { EventEntity } from '@domain'
import { EventActions } from '@presentation/pages/EventPageParts/EventActions.tsx'
import { useEffect, useState } from 'react'
import { useAuth } from '@presentation/hooks/useAuth.ts'

interface EventHeaderProps {
    event: EventEntity
}

export function EventHeader({ event }: EventHeaderProps) {
    const { currentUser } = useAuth()
    const [isEventCreator, setIsEventCreator] = useState(false)

    useEffect(() => {
        // Check if current user is the event creator
        if (currentUser && event) {
            setIsEventCreator(currentUser.id.value === event.createdBy.value)
        }
    }, [currentUser, event])

    return (
        <HStack gap={4} justify="space-between" w="full">
            <HStack gap={4} align="center">
                {event.svgContent && (
                    <Box flexShrink={0} w="60px" h="60px" overflow="hidden" p={2}>
                        <img
                            src={`data:image/svg+xml;base64,${btoa(event.svgContent.value)}`}
                            alt={`${event.title} logo`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                            onError={e => {
                                ;(e.target as HTMLImageElement).style.display = 'none'
                            }}
                        />
                    </Box>
                )}
                <Heading size="3xl" colorPalette="gray">
                    {event.title}
                </Heading>
            </HStack>
            <EventActions event={event} isEventCreator={isEventCreator} />
        </HStack>
    )
}
