import DOMPurify from 'dompurify'

export class SvgContent {
    private constructor(private readonly _value: string) {}

    static from(svgContent: string): SvgContent {
        const trimmed = svgContent.trim()

        if (trimmed.length == 0) {
            throw new Error('SVG content must be a non-empty string')
        }

        // Validate as XML
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(trimmed, 'image/svg+xml')
            const errorNode = doc.querySelector('parsererror')
            if (errorNode) {
                throw new Error('Invalid SVG XML format')
            }
        } catch {
            throw new Error('Invalid SVG XML format')
        }

        // Sanitize using DOMPurify
        const sanitized = DOMPurify.sanitize(trimmed, {
            USE_PROFILES: { svg: true, svgFilters: true }
        })

        if (!sanitized) {
            throw new Error('SVG content failed sanitization')
        }

        return new SvgContent(sanitized)
    }

    static fromOptional(svgContent: string | null, noError: boolean = false): SvgContent | null {
        if (!svgContent) {
            return null
        }
        try {
            return SvgContent.from(svgContent)
        } catch (e) {
            if (noError) return null
            throw e
        }
    }

    get value(): string {
        return this._value
    }

    toString(): string {
        return this._value
    }

    equals(other: SvgContent): boolean {
        return this._value === other._value
    }
}
