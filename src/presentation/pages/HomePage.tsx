import { useAuth } from '../hooks/useAuth';
import LandingPage from '../components/LandingPage';
import UserDashboard from '../components/UserDashboard';

function HomePage() {
    const { currentUser } = useAuth();

    if (currentUser) {
        return <UserDashboard />;
    }

    return <LandingPage />;
}

export default HomePage;
