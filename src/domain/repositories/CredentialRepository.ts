import {Code, Credential} from "@domain"

export interface CredentialRepository {
    get(): Credential | null
    set(codes: Code[]): Credential
    delete(): void
    create(): Credential
}