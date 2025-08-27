import { Code, Credential, CredentialRepository } from '@domain';

const LOCAL_STORAGE_KEY = 'sharing-cred';
const LOCAL_STORAGE_SEPARATOR = '-';

export class LocalCredentialDataStore implements CredentialRepository {
    create(): Credential {
        const credential = new Credential();
        localStorage.setItem(LOCAL_STORAGE_KEY, credential.codes.join(LOCAL_STORAGE_SEPARATOR));
        return credential;
    }

    delete(): void {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    get(): Credential | null {
        try {
            const localChain = localStorage.getItem(LOCAL_STORAGE_KEY);
            const codes = localChain?.split(LOCAL_STORAGE_SEPARATOR) || [];
            return new Credential(codes);
        } catch (_e) {
            return null;
        }
    }

    set(codes: Code[]): Credential {
        const credential = new Credential(codes);
        localStorage.setItem(LOCAL_STORAGE_KEY, credential.codes.join(LOCAL_STORAGE_SEPARATOR));
        return credential;
    }
}
