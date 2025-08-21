import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import {DependencyProvider} from '@presentation/context/DependencyProvider.tsx';
import Header from './presentation/components/Header';
import HomePage from './presentation/pages/HomePage';
import EventPage from './presentation/pages/EventPage';
import CreateEventPage from './presentation/pages/CreateEventPage';
import EditEventPage from './presentation/pages/EditEventPage';
import './App.scss';

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
                            <Route path="/event/:eventId/edit" element={<EditEventPage/>}/>
                        </Routes>
                    </main>
                </div>
            </Router>
        </DependencyProvider>
    );
}

export default App;