import { useEffect, useState } from 'react';
import { useDependencies } from '../hooks/useDependencies';
import { useAuth } from '../hooks/useAuth';
import { useSignInProvider } from '../hooks/useSignInProvider';
import styles from './AuthModal.module.scss';
import { Credential } from '@/domain';
import { AuthButton, CredentialDisplay, SignInForm, UserActions, UserProfile } from './auth';

export function AuthModal() {
    const { signInUseCase } = useDependencies();
    const { currentUser } = useAuth();
    const { answerAllRequests, hasPendingRequests } = useSignInProvider(signInUseCase);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [credential, setCredential] = useState<Credential | null>();

    useEffect(() => {
        setCredential(signInUseCase.getCurrentCredential());
    }, [signInUseCase]);

    // Watch for successful sign-in to resolve all pending requests
    useEffect(() => {
        if (currentUser && hasPendingRequests) {
            answerAllRequests(true);
        }
    }, [currentUser, hasPendingRequests, answerAllRequests]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking the overlay itself, not the modal content
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleClose = () => {
        // Reject all pending sign-in requests
        if (hasPendingRequests) {
            answerAllRequests(false);
        }
        setShowAuthModal(false);
    };

    return (
        <div className="auth-buttons">
            <AuthButton onClick={() => setShowAuthModal(true)} />

            {(showAuthModal || hasPendingRequests) && (
                <div className={styles.overlay} onClick={handleOverlayClick}>
                    <div className={styles.modal}>
                        <button className={styles.closeButton} onClick={handleClose}>
                            ×
                        </button>

                        <h2 className={styles.title}>Device Connection</h2>

                        {!currentUser ? (
                            <div className={styles.content}>
                                <SignInForm
                                    onCredentialSet={setCredential}
                                    onError={error => console.error(error)}
                                />
                            </div>
                        ) : (
                            <div className={styles.content}>
                                {credential && (
                                    <div className={styles.sharingActive}>
                                        <CredentialDisplay
                                            credential={credential}
                                            currentUser={currentUser}
                                        />
                                    </div>
                                )}

                                <div className={styles.profileSection}>
                                    <UserProfile currentUser={currentUser} />
                                </div>

                                <div className={styles.userSection}>
                                    <UserActions
                                        onSignOut={() => setCredential(null)}
                                        onDeleteAccount={() => setCredential(null)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
