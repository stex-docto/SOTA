import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthWithProfile } from '../hooks/useAuthWithProfile';
import { SignInModal } from './SignInModal';

function Header() {
  const { currentUser } = useAuthWithProfile();
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            SOTA
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/create-event" className="nav-link">Create Event</Link>
        </nav>
        
        <div className="header-right">
            <div className="auth-buttons">
              <button 
                className="account-icon-btn" 
                onClick={() => setShowSignInModal(true)}
                title={currentUser ? 'User' : 'Sign In'}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
        </div>
      </div>
      
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </header>
  );
}

export default Header;