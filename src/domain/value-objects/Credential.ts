export type Code = string

export const CODE_LENGTH = 5

const CODE_FORMAT = /^[a-z]{5}$/
export const CODE_BLOCK_ITERATION = 4
export const CODE_TOTAL_LENGTH = CODE_LENGTH * CODE_BLOCK_ITERATION

const characters = 'abcdefghijklmnopqrstuvwxyz'

export class Credential {
    readonly codes: Code[] = []

    constructor(codes?: Code[]) {
        this.codes = codes ? codes.map((c) => c.toLocaleLowerCase()) : Credential.generateCodes()
        this.check()
    }

    protected static generateRandomString(length: number): Code {
        const charactersLength = characters.length
        const randomValues = new Uint32Array(length)
        window.crypto.getRandomValues(randomValues)
        let result = ''
        for (let i = 0; i < length; i++) {
            const randomIndex = randomValues[i] % charactersLength
            result += characters.charAt(randomIndex)
        }
        return result
    }

    protected static generateCodes(): Code[] {
        return Array(CODE_BLOCK_ITERATION)
            .fill(null)
            .map(() => Credential.generateRandomString(CODE_LENGTH))
    }


    private check() {
        if (this.codes.length !== 4) throw new Error('Code length must be 4')
        for (const code of this.codes) {
            if (!CODE_FORMAT.test(code)) throw new Error(`Invalid code format for ${code}`)
        }
    }
}