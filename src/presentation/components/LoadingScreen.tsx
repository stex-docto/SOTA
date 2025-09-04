import React from 'react'
import LoadingImage from '@/assets/loading.jpeg'
import { Box, Spinner, Text, VStack } from '@chakra-ui/react'

export const LoadingScreen: React.FC = () => {
    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgImage={`url(${LoadingImage})`}
            bgSize="cover"
            bgPos="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Box
                bg={{ base: 'white', _dark: 'gray.800' }}
                borderRadius="lg"
                p={8}
                shadow="xl"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
            >
                <VStack gap={4}>
                    <Spinner size="xl" colorPalette="blue" />
                    <Text fontSize="lg" fontWeight="medium" colorPalette="gray">
                        Loading...
                    </Text>
                </VStack>
            </Box>
        </Box>
    )
}
