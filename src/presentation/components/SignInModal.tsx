import {useEffect, useState} from 'react';
import { useDependencies } from '../hooks/useDependencies';
import { useAuth } from '../hooks/useAuth';
import {
  CODE_LENGTH,
  CODE_BLOCK_ITERATION,
  CODE_TOTAL_LENGTH,
} from '@/domain/value-objects/Credential';
import styles from './SignInModal.module.scss';
import {Credential, UserEntity} from "@/domain";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { userRepository, credentialRepository } = useDependencies();
  const { currentUser } = useAuth();

  const [phrase, setPhrase] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [credential, setCredential] = useState<Credential|null>();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [credentialError, setCredentialError] = useState<string>('');

  useEffect(() => {
    setCredential(credentialRepository.get)
  }, [credentialRepository])

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser])

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const credential = credentialRepository.create()
      await userRepository.signIn(credential, true);
      setCredential(credential);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await userRepository.signOut();
      credentialRepository.delete();
      setCredential(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!credential) return
      await userRepository.deleteCurrentUser(credential);
      credentialRepository.delete();
      setCredential(null);
    } catch (error) {
      console.error('Account deletion failed:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !displayName.trim()) return;

    setIsSavingProfile(true);
    try {
      const updatedUser = new UserEntity(
        currentUser.id,
        currentUser.savedEventUrls,
        displayName.trim()
      );
      await userRepository.saveUser(updatedUser);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setIsEditingProfile(false);
    }
  };

  const handleCredentialInput = async (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z]/g, '');
    setPhrase(cleanValue);
    
    // Clear error message when user starts typing
    if (credentialError) {
      setCredentialError('');
    }
    
    if (cleanValue.length === CODE_TOTAL_LENGTH) {
      try {
        const codes = [];
        for (let i = 0; i < CODE_BLOCK_ITERATION; i++) {
          const start = i * CODE_LENGTH;
          const end = start + CODE_LENGTH;
          codes.push(cleanValue.slice(start, end));
        }
        const credential = credentialRepository.set(codes)
        setCredential(credential);
        await userRepository.signIn(credential);
        setPhrase('');
      } catch (error) {
        console.error('Invalid credential:', error);
        setCredentialError('Invalid credential. Please check your sharing code and try again.');
        setPhrase('');
        credentialRepository.delete();
      }
    }
  };

  const formatCredentialDisplay = (codes: string[]) => {
    return codes.join('-');
  };

  const formatInputValue = (value: string) => {
    const chunks = [];
    for (let i = 0; i < value.length; i += CODE_LENGTH) {
      chunks.push(value.slice(i, i + CODE_LENGTH));
    }
    return chunks.join('-');
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the overlay itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>Device Connection</h2>

        {!currentUser ? (
          <div className={styles.content}>
            <p className={styles.description}>Anonymous sign in to connect your devices</p>
            
            <button 
              className={styles.primaryButton} 
              onClick={handleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Enter sharing code from another device
              </label>
              <input
                type="text"
                className={styles.codeInput}
                value={formatInputValue(phrase)}
                onPaste={(e) => handleCredentialInput(e.clipboardData.getData('Text'))}
                onChange={(e) => handleCredentialInput(e.target.value)}
                placeholder="xxxxx-xxxxx-xxxxx-xxxxx"
                maxLength={CODE_TOTAL_LENGTH + 3} // +3 for dashes
              />
              {credentialError && (
                <div className={styles.errorMessage}>
                  {credentialError}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            {credential && (
              <div className={styles.sharingActive}>
                <p className={styles.description}>
                  Save this code, it allows to reconnect on any device with this code
                </p>
                <div className={styles.credentialDisplay}>
                  {formatCredentialDisplay(credential.codes)}
                </div>
              </div>
            )}

            <div className={styles.profileSection}>
              <h3 className={styles.sectionTitle}>Profile</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Display Name</label>
                {isEditingProfile ? (
                  <div className={styles.editMode}>
                    <input
                      type="text"
                      className={styles.profileInput}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                      disabled={isSavingProfile}
                      maxLength={50}
                    />
                    <div className={styles.profileActions}>
                      <button 
                        className={styles.primaryButton} 
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile || !displayName.trim()}
                      >
                        {isSavingProfile ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        className={styles.secondaryButton} 
                        onClick={handleCancelEditProfile}
                        disabled={isSavingProfile}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.displayMode}>
                    <span className={styles.displayValue}>
                      {currentUser.displayName || 'No display name set'}
                    </span>
                    <button className={styles.editButton} onClick={handleEditProfile}>
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {!currentUser.displayName && (
                <p className={styles.helpText}>
                  Set your display name to be shown to other users in events.
                </p>
              )}
            </div>
            
            <div className={styles.userSection}>
              <p className={styles.userInfo}>Signed in as: {String(currentUser.id)}</p>
              <div className={styles.buttonGroup}>
                <button className={styles.secondaryButton} onClick={handleLogout}>
                  Sign Out
                </button>
                <button className={styles.dangerButton} onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}