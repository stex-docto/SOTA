import { Button, VStack } from '@chakra-ui/react'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2'

interface EventActionsProps {
    isEventCreator: boolean
    isEventSaved: boolean
    isSaving: boolean
    showManagement: boolean
    onSaveToggle: () => void
    onToggleManagement: () => void
    onEditEvent: () => void
    onDeleteEvent: () => void
}

export function EventActions({
    isEventCreator,
    isEventSaved,
    isSaving,
    showManagement,
    onSaveToggle,
    onToggleManagement,
    onEditEvent,
    onDeleteEvent
}: EventActionsProps) {
    return (
        <VStack gap={3} align="stretch">
            {!isEventCreator && (
                <Button
                    onClick={onSaveToggle}
                    disabled={isSaving}
                    loading={isSaving}
                    variant={isEventSaved ? 'solid' : 'outline'}
                    colorPalette={isEventSaved ? 'red' : 'gray'}
                    size="lg"
                >
                    {isEventSaved ? <HiHeart /> : <HiOutlineHeart />}
                    {isEventSaved ? 'Saved' : 'Save Event'}
                </Button>
            )}
            {isEventCreator && (
                <>
                    <Button onClick={onEditEvent} colorPalette="blue" variant="outline" size="lg">
                        Edit Event
                    </Button>
                    <Button onClick={onDeleteEvent} colorPalette="red" variant="outline" size="lg">
                        Delete Event
                    </Button>
                    <Button onClick={onToggleManagement} colorPalette="blue" size="lg">
                        {showManagement ? 'Hide Management' : 'Manage Event'}
                    </Button>
                </>
            )}
        </VStack>
    )
}
