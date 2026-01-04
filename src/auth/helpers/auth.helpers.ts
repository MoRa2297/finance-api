import * as bcrypt from 'bcrypt';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

/**
 * Hash a password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, AUTH_CONSTANTS.SALT_ROUNDS);
};

/**
 * Compare password with hash.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

/**
 * Exclude password from user object.
 */
export const excludePassword = <T extends { password?: string | null }>(
    user: T,
): Omit<T, 'password'> => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
