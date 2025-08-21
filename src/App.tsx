import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {DependencyProvider} from './presentation/context/DependencyContext';
import Header from './presentation/components/Header';
import HomePage from './presentation/pages/HomePage';
import EventPage from './presentation/pages/EventPage';
import AdminPage from './presentation/pages/AdminPage';
import CreateEventPage from './presentation/pages/CreateEventPage';
import './App.css';

function App() {
    return (
        <DependencyProvider>
            <Router>
                <div className="App">
                    <Header/>
                    <main className="container">
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/create-event" element={<CreateEventPage/>}/>
                            <Route path="/event/:eventId" element={<EventPage/>}/>
                            <Route path="/event/:eventId/admin/:adminToken" element={<AdminPage/>}/>
                        </Routes>
                    </main>
                </div>
            </Router>
        </DependencyProvider>
    );
}

export default App;