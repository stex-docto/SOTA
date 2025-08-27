import { Credential, UserEntity } from '@/domain'
import styles from '../AuthModal.module.scss'

interface CredentialDisplayProps {
    credential: Credential
    currentUser: UserEntity
}

export function CredentialDisplay({ credential, currentUser }: CredentialDisplayProps) {
    const formatCredentialDisplay = (codes: string[]) => {
        return codes.join('-')
    }

    return (
        <>
            <p className={styles.description}>
                Save this code, it allows to reconnect on any device with this code
            </p>
            <div className={styles.credentialDisplay}>
                {formatCredentialDisplay(credential.codes)}
            </div>
            <p className={styles.userInfo}>Signed in as: {String(currentUser.id)}</p>
        </>
    )
}
