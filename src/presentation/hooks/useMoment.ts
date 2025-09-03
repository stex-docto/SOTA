import { useEffect, useState } from 'react'
import moment, { Moment } from 'moment'

// Initialize moment with browser locale
const initializeMoment = () => {
    const browserLocale = navigator.language || navigator.languages?.[0] || 'en'
    console.log('Locale used for Moment', { browserLocale })

    moment.defineLocale('en-us', {
        parentLocale: 'en',
        longDateFormat: {
            LT: 'h:mm A',
            LTS: 'h:mm:ss A',
            L: 'MM/DD/YYYY',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY h:mm A',
            LLLL: 'dddd, MMMM D, YYYY h:mm A'
        }
    })

    moment.locale(browserLocale.toLowerCase())
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

    public now(): Moment {
        return this.currentNow.clone()
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
