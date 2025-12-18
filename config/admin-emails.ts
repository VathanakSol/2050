// Configuration for admin emails
// Add or remove emails from this list to control access to the manage-images page

export const ADMIN_EMAILS = [
    'admin@example.com',
    'user@example.com',
    // Add more emails here as needed
];

// Helper function to check if an email is authorized
export function isAuthorizedEmail(email: string): boolean {
    return ADMIN_EMAILS.includes(email.toLowerCase());
}