import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export function TalkSchedule() {
    return (
        <Box
            colorPalette="purple"
            p={6}
            bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
            borderWidth="1px"
            borderColor="colorPalette.200"
            borderRadius="lg"
        >
            <VStack gap={4} align="stretch">
                <Heading size="xl" colorPalette="gray">
                    Talk Schedule
                </Heading>
                <Box
                    colorPalette="purple"
                    p={6}
                    textAlign="center"
                    bg={{ base: 'colorPalette.100', _dark: 'colorPalette.800' }}
                    borderWidth="1px"
                    borderColor="colorPalette.200"
                    borderRadius="md"
                >
                    <Text colorPalette="gray" fontStyle="italic">
                        Schedule will be displayed here once talks are submitted and approved.
                    </Text>
                </Box>
            </VStack>
        </Box>
    )
}
