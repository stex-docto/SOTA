import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { DependencyProvider } from '@presentation/context/DependencyProvider.tsx';
import { ProtectedRoute } from './presentation/routing';
import Header from './presentation/components/Header';
import Footer from './presentation/components/Footer';
import HomePage from './presentation/pages/HomePage';
import EventPage from './presentation/pages/EventPage';
import CreateEventPage from './presentation/pages/CreateEventPage';
import EditEventPage from './presentation/pages/EditEventPage';
import './App.scss';
import './sw-update'; // Import service worker update handler

function App() {
    return (
        <DependencyProvider>
            <Router>
                <div className="App">
                    <Header />
                    <main className="container">
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
                    </main>
                    <Footer />
                </div>
            </Router>
        </DependencyProvider>
    );
}

export default App;
