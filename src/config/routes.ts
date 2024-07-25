/**
 * An array of routes that are accessible without authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/"]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to the /me route
 * @type {string[]}
 */
export const authRoutes: string[] = ["/login", "/register"]

/**
 * An array of routes that are protected
 * These routes will redirect unauthenticated users to the /login route
 * @type {string[]}
 */
export const protectedRoutes: string[] = ["/me"]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for authentication
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth"

/**
 * The default route for redirecting authenticated users
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/me"
