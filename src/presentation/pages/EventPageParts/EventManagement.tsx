import RoomManagement from '@/presentation/components/RoomManagement'
import { Box, Button, Grid, Heading, VStack } from '@chakra-ui/react'
import { EventId } from '@domain'

interface EventManagementProps {
    eventId: EventId
    isEventCreator: boolean
}

export function EventManagement({ eventId, isEventCreator }: EventManagementProps) {
    return (
        <Box
            colorPalette="blue"
            p={6}
            bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
            borderWidth="1px"
            borderColor="colorPalette.200"
            borderRadius="lg"
        >
            <VStack gap={6} align="stretch">
                <Heading size="xl" colorPalette="gray">
                    Event Management
                </Heading>

                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                    <VStack gap={4} align="stretch">
                        <Heading size="lg" colorPalette="gray">
                            Schedule Actions
                        </Heading>
                        <Button colorPalette="green" size="lg">
                            Generate Schedule
                        </Button>
                    </VStack>

                    <RoomManagement eventId={eventId} isEventCreator={isEventCreator} />
                </Grid>
            </VStack>
        </Box>
    )
}
