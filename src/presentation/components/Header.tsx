import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignInModal } from './SignInModal';

function Header() {
  const { currentUser, signOut } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            Open Talk Sessions
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/create-event" className="nav-link">Create Event</Link>
        </nav>
        
        <div className="header-right">
          {currentUser ? (
            <div className="user-menu">
              <span className="user-name">
                Hello, {currentUser.displayName}
              </span>
              <button onClick={handleSignOut} className="sign-out-btn">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="sign-in-btn" 
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            </div>
          )}
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