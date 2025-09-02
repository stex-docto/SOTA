import { Box, Heading, VStack } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'

interface TalkRulesProps {
    talkRules: string
}

export function TalkRules({ talkRules }: TalkRulesProps) {
    return (
        <Box
            colorPalette="green"
            p={6}
            bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
            borderWidth="1px"
            borderColor="colorPalette.200"
            borderRadius="lg"
        >
            <VStack gap={4} align="stretch">
                <Heading size="xl" colorPalette="gray">
                    Talk Rules
                </Heading>
                <Box
                    colorPalette="green"
                    p={4}
                    bg={{ base: 'colorPalette.100', _dark: 'colorPalette.800' }}
                    borderWidth="1px"
                    borderColor="colorPalette.200"
                    borderRadius="md"
                >
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>{talkRules}</ReactMarkdown>
                </Box>
            </VStack>
        </Box>
    )
}
