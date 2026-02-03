import bcrypt from 'bcryptjs';

export class AuthService {
  /**
   * Hashes a plain text password.
   * @param password - The password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a candidate password with a hash.
   * @param candidatePassword - The plain text password to check.
   * @param hash - The hashed password from the database.
   * @returns A promise that resolves to true if they match, false otherwise.
   */
  public async comparePasswords(candidatePassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hash);
  }
}

export const authService = new AuthService();
