import {useState} from 'react';
import {CODE_BLOCK_ITERATION, CODE_LENGTH, CODE_TOTAL_LENGTH} from '@/domain/value-objects/Credential';
import {useDependencies} from '../../hooks/useDependencies';
import {Credential} from '@/domain';
import styles from '../AuthModal.module.scss';

interface SignInFormProps {
    onCredentialSet: (credential: Credential) => void;
    onError: (error: string) => void;
}

export function SignInForm({onCredentialSet, onError}: SignInFormProps) {
    const {signInUseCase} = useDependencies();
    const [phrase, setPhrase] = useState<string>('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [credentialError, setCredentialError] = useState<string>('');

    const handleLogin = async () => {
        try {
            setIsLoggingIn(true);
            const credential = await signInUseCase.signIn();
            onCredentialSet(credential);
        } catch (error) {
            console.error('Login failed:', error);
            onError('Login failed. Please try again.');
        } finally {
            setIsLoggingIn(false);
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
                const credential = await signInUseCase.signinWithCredential(codes);
                onCredentialSet(credential);
                setPhrase('');
            } catch (error) {
                console.error('Invalid credential:', error);
                setCredentialError('Invalid credential. Please check your sharing code and try again.');
                setPhrase('');
            }
        }
    };

    const formatInputValue = (value: string) => {
        const chunks = [];
        for (let i = 0; i < value.length; i += CODE_LENGTH) {
            chunks.push(value.slice(i, i + CODE_LENGTH));
        }
        return chunks.join('-');
    };

    return (
        <>
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
        </>
    );
}