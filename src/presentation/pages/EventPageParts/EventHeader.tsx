import { Heading, HStack } from '@chakra-ui/react'
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
            <Heading size="3xl" colorPalette="gray">
                {event.title}
            </Heading>
            <EventActions event={event} isEventCreator={isEventCreator} />
        </HStack>
    )
}
