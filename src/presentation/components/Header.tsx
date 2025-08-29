import { Link } from 'react-router-dom'
import { AuthModal } from './AuthModal'
import CurrentEventsBar from './CurrentEventsBar'
import { HiHome } from 'react-icons/hi2'
import {
    Box,
    Container,
    HStack,
    Link as ChakraLink
} from '@chakra-ui/react'

function Header() {
    return (
        <Box
            as="header"
            bg="bg.panel"
            shadow="sm"
            position="sticky"
            top={0}
            zIndex={100}
            borderBottomWidth="1px"
            borderColor="border.subtle"
        >
            <Container maxW="1400px" px={8} py={4}>
                <HStack justify="space-between" align="center">
                    {/* Logo */}
                    <Box>
                        <ChakraLink
                            asChild
                            fontSize="2xl"
                            fontWeight="bold"
                            color="colorPalette.600"
                            textDecoration="none"
                            display="flex"
                            alignItems="center"
                            gap={2}
                            _hover={{
                                color: 'colorPalette.700',
                                textDecoration: 'none'
                            }}
                        >
                            <Link to="/" title="Simple Open-Talk App Main page">
                                <HiHome /> SOTA
                            </Link>
                        </ChakraLink>
                    </Box>

                    {/* Navigation */}
                    <Box as="nav" flex="1" display="flex" justifyContent="center">
                        <CurrentEventsBar />
                    </Box>

                    {/* Auth */}
                    <Box>
                        <AuthModal />
                    </Box>
                </HStack>
            </Container>
        </Box>
    )
}

export default Header
