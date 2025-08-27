import { Link } from 'react-router-dom'
import { AuthModal } from './AuthModal'
import CurrentEventsBar from './CurrentEventsBar'

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <Link to="/" className="logo" title="Simple Open-Talk App Main page">
                        SOTA 🏠
                    </Link>
                </div>

                <nav className="header-nav">
                    <CurrentEventsBar />
                </nav>

                <div className="header-right">
                    <AuthModal />
                </div>
            </div>
        </header>
    )
}

export default Header
