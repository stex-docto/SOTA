import { Box, Flex, HStack, Text, Link, IconButton } from '@chakra-ui/react'
import { ColorModeButton } from '@presentation/ui/color-mode'
import { VscGithub, VscIssues } from 'react-icons/vsc'

function Footer() {
    const handleReportIssue = () => {
        const issueUrl = new URL('https://github.com/stex-docto/SOTA/issues/new')
        issueUrl.searchParams.set('title', 'Bug Report: ')
        issueUrl.searchParams.set(
            'body',
            `**Describe the issue:**
Please provide a clear description of what went wrong.

**Steps to reproduce:**
1. 
2. 
3. 

**Expected behavior:**
What did you expect to happen?

**Actual behavior:**
What actually happened?

**Browser/Device:**
- Browser: 
- Device: 
- Operating System: 

**Additional context:**
Add any other context about the problem here.
`
        )

        window.open(issueUrl.toString(), '_blank')
    }

    return (
        <Box as="footer" bg="bg.subtle" borderTopWidth="1px" mt="auto" padding={1}>
            <Flex
                maxW="1200px"
                mx="auto"
                px={6}
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align="center"
                gap={1}
            >
                <HStack gap={4} wrap="wrap" justify="center">
                    <ColorModeButton />
                    <Link
                        href="https://github.com/stex-docto/SOTA"
                        target="_blank"
                        rel="noopener noreferrer"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontSize="sm"
                        _hover={{ textDecoration: 'none' }}
                    >
                        <VscGithub size={16} />
                        GitHub Repository
                    </Link>
                    <IconButton
                        onClick={handleReportIssue}
                        variant="ghost"
                        size="sm"
                        aria-label="Report Issue"
                        colorPalette="red"
                    >
                        <HStack gap={2}>
                            <VscIssues size={16} />
                            <Text>Report Issue</Text>
                        </HStack>
                    </IconButton>
                </HStack>
                <Text fontSize="sm" colorPalette="gray" textAlign={{ base: 'center', md: 'right' }}>
                    &copy; {new Date().getFullYear()} SOTA - Simple Open-Talk App
                </Text>
            </Flex>
        </Box>
    )
}

export default Footer
