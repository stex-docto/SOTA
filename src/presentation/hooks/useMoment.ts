import { useEffect, useState } from 'react'
import moment, { Moment } from 'moment'

// Import locales
import 'moment/dist/locale/en-gb'
import 'moment/dist/locale/fr'

// Initialize moment with browser locale
const initializeMoment = () => {
    const browserLocale = navigator.language || navigator.languages?.[0] || 'en'
    console.log('Locale used for Moment', { browserLocale })

    // Try to set the browser locale, fallback to 'en' if not available
    const localeLower = browserLocale.toLowerCase()
    const locale = moment.locale(localeLower)

    // If locale wasn't found, try without country code (e.g., 'en' instead of 'en-us')
    if (locale === 'en' && localeLower !== 'en') {
        const baseLocale = localeLower.split('-')[0]
        moment.locale(baseLocale)
    }

    console.log('Active Moment locale:', moment.locale())
}

// Singleton time manager with global interval
class TimeManager {
    private static instance: TimeManager
    private currentNow: Moment = moment()
    private listeners: (() => void)[] = []
    private interval: number | null = null
    private updateInterval: number = 60000

    public static getInstance(): TimeManager {
        if (!TimeManager.instance) {
            TimeManager.instance = new TimeManager()
        }
        return TimeManager.instance
    }

    public addListener(listener: () => void, intervalMs?: number): () => void {
        if (intervalMs && intervalMs < this.updateInterval) {
            this.updateInterval = intervalMs
            this.restartInterval()
        }

        this.listeners.push(listener)
        this.startIntervalIfNeeded()

        return () => {
            this.listeners = this.listeners.filter(l => l !== listener)
            if (this.listeners.length === 0) {
                this.stopInterval()
            }
        }
    }

    public now(): Moment {
        return this.currentNow.clone()
    }

    private startIntervalIfNeeded(): void {
        if (!this.interval && this.listeners.length > 0) {
            this.interval = window.setInterval(() => {
                this.currentNow = moment()
                this.listeners.forEach(listener => listener())
            }, this.updateInterval)
        }
    }

    private stopInterval(): void {
        if (this.interval) {
            window.clearInterval(this.interval)
            this.interval = null
        }
    }

    private restartInterval(): void {
        this.stopInterval()
        this.startIntervalIfNeeded()
    }
}

// Initialize moment on module load
initializeMoment()

const timeManager = TimeManager.getInstance()

export interface MomentHook {
    now: Moment
    setLocale: (locale: string) => void
}

export function useMoment(updateInterval: number = 60000): {
    now: moment.Moment
    setLocale: (locale: string) => void
    toNow: (date: moment.Moment | Date | string) => moment.Duration
} {
    const [now, setNow] = useState<Moment>(() => timeManager.now())

    useEffect(() => {
        return timeManager.addListener(() => {
            setNow(timeManager.now())
        }, updateInterval)
    }, [updateInterval])

    const setLocale = (locale: string) => {
        moment.locale(locale)
    }

    const toNow = (date: Moment | Date | string): moment.Duration => {
        return moment.duration(moment(date).diff(now))
    }

    return { now, setLocale, toNow }
}
