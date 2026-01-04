export const AUTH_CONSTANTS = {
    SALT_ROUNDS: 10,
    JWT_EXPIRATION: '7d',
    MESSAGES: {
        EMAIL_ALREADY_EXISTS: 'Email already registered',
        INVALID_CREDENTIALS: 'Invalid credentials',
        USER_NOT_FOUND: 'User not found',
        INCORRECT_PASSWORD: 'Current password is incorrect',
        PASSWORD_CHANGED: 'Password changed successfully',
        ACCOUNT_DELETED: 'Account deleted successfully',
    },
} as const;
