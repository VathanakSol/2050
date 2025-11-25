/**
 * Feature Flag Utilities
 * Manages feature flags using cookies to override environment variables
 */

/**
 * Get the value of a feature flag
 * Checks cookies first, then falls back to environment variables
 * @param flagName - The name of the feature flag
 * @returns boolean indicating if the feature is enabled
 */
export function getFeatureFlag(flagName: string): boolean {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
        // Server-side: use environment variable
        return process.env.NEXT_PUBLIC_ENABLED_UI === 'true';
    }

    // Client-side: check cookie first
    const cookieName = `beta_${flagName}`;
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return value === 'true';
        }
    }

    // Fall back to environment variable
    return process.env.NEXT_PUBLIC_ENABLED_UI === 'true';
}

/**
 * Set a feature flag value in cookies
 * @param flagName - The name of the feature flag
 * @param enabled - Whether the feature should be enabled
 */
export function setFeatureFlag(flagName: string, enabled: boolean): void {
    if (typeof window === 'undefined') return;

    const cookieName = `beta_${flagName}`;
    const expiryDays = 30;
    const date = new Date();
    date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;

    document.cookie = `${cookieName}=${enabled};${expires};path=/;SameSite=Lax`;
}

/**
 * Clear a feature flag from cookies
 * @param flagName - The name of the feature flag to clear
 */
export function clearFeatureFlag(flagName: string): void {
    if (typeof window === 'undefined') return;

    const cookieName = `beta_${flagName}`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
