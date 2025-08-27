export interface RouteConfig {
    path: string
    authRequired?: boolean
    component?: string // Could reference component name if needed
}

export const routes: RouteConfig[] = [
    { path: '/', authRequired: false },
    { path: '/create-event', authRequired: true },
    { path: '/event/:eventId', authRequired: false },
    { path: '/event/:eventId/edit', authRequired: true }
    // Add more routes as needed
]

export function isAuthRequiredForPath(pathname: string): boolean {
    // Find exact match first
    const exactMatch = routes.find(route => route.path === pathname)
    if (exactMatch) {
        return exactMatch.authRequired ?? false
    }

    // Check for parameterized routes (like /edit-event/:id)
    const parameterizedMatch = routes.find(route => {
        if (!route.path.includes(':')) return false

        const routePattern = route.path.replace(/:[\w-]+/g, '[^/]+')
        const regex = new RegExp(`^${routePattern}$`)
        return regex.test(pathname)
    })

    return parameterizedMatch?.authRequired ?? false
}
