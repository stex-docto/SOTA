import { useDependencies } from '../../hooks/useDependencies';
import styles from '../AuthModal.module.scss';

interface UserActionsProps {
    onSignOut: () => void;
    onDeleteAccount: () => void;
}

export function UserActions({ onSignOut, onDeleteAccount }: UserActionsProps) {
    const { signInUseCase } = useDependencies();

    const handleLogout = async () => {
        try {
            await signInUseCase.signOut();
            onSignOut();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await signInUseCase.delete();
            onDeleteAccount();
        } catch (error) {
            console.error('Account deletion failed:', error);
        }
    };

    return (
        <div className={styles.buttonGroup}>
            <button className={styles.secondaryButton} onClick={handleLogout}>
                Sign Out
            </button>
            <button className={styles.dangerButton} onClick={handleDeleteAccount}>
                Delete Account
            </button>
        </div>
    );
}
