import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { UI_Provider } from '@presentation/ui'
import { DependencyProvider } from '@presentation/context/DependencyProvider.tsx'
import { ProtectedRoute } from './presentation/routing'
import Header from './presentation/components/Header'
import Footer from './presentation/components/Footer'
import HomePage from './presentation/pages/HomePage'
import EventPage from './presentation/pages/EventPage'
import CreateEventPage from './presentation/pages/CreateEventPage'
import EditEventPage from './presentation/pages/EditEventPage'
import { Container, Flex } from '@chakra-ui/react'
import './sw-update' // Import service worker update handler

function App() {
    return (
        <UI_Provider>
            <DependencyProvider>
                <Router>
                    <Flex direction="column" minH="100vh">
                        <Header />
                        <Container as="main" flex="1" mx="auto" py={4}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route
                                    path="/create-event"
                                    element={
                                        <ProtectedRoute requireAuth={true}>
                                            <CreateEventPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="/event/:eventId" element={<EventPage />} />
                                <Route
                                    path="/event/:eventId/edit"
                                    element={
                                        <ProtectedRoute requireAuth={true}>
                                            <EditEventPage />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </Container>
                        <Footer />
                    </Flex>
                </Router>
            </DependencyProvider>
        </UI_Provider>
    )
}

export default App
