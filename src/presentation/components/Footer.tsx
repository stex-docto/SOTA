import { Box, Container, HStack, IconButton, Link, StackSeparator, Text } from '@chakra-ui/react'
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
        <Box
            as="footer"
            bg="bg.subtle"
            borderTopWidth="1px"
            width="100%"
            padding={1}
            justify-content="center"
        >
            <Container>
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
                        title="GitHub Repository"
                    >
                        <VscGithub />
                    </Link>
                    <IconButton
                        onClick={handleReportIssue}
                        variant="ghost"
                        size="sm"
                        aria-label="Report Issue"
                        colorPalette="red"
                        title="Report Issue"
                    >
                        <VscIssues />
                    </IconButton>

                    <StackSeparator flex={1} />

                    <Text
                        fontSize="sm"
                        colorPalette="gray"
                        textAlign={{ base: 'center', md: 'right' }}
                        title={`&copy; {new Date().getFullYear()} SOTA - Simple Open-Talk App`}
                    >
                        &copy; {new Date().getFullYear()} SOTA
                    </Text>
                </HStack>
            </Container>
        </Box>
    )
}

export default Footer
