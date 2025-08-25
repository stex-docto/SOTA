import {useState, useEffect} from 'react';
import {UserEntity} from '@/domain';
import {useDependencies} from '../../hooks/useDependencies';
import styles from '../AuthModal.module.scss';

interface UserProfileProps {
    currentUser: UserEntity;
}

export function UserProfile({currentUser}: UserProfileProps) {
    const {updateUserProfileUseCase} = useDependencies();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
        }
    }, [currentUser]);

    const handleSaveProfile = async () => {
        if (!displayName.trim()) return;

        setIsSavingProfile(true);
        try {
            await updateUserProfileUseCase.execute({
                displayName: displayName.trim()
            });
            setIsEditingProfile(false);
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert(error instanceof Error ? error.message : 'Failed to save profile. Please try again.');
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

    return (
        <>
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
        </>
    );
}