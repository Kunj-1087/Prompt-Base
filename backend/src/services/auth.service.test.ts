import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = new AuthService();
  });
  
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'Test123!';
      const hashed = await authService.hashPassword(password);
      
      expect(hashed).not.toBe(password);
      // bcrypt hash length is typically 60
      expect(hashed.length).toBe(60); 
    });
  });
  
  describe('comparePasswords', () => {
    it('should return true for matching passwords', async () => {
      const password = 'Test123!';
      const hashed = await authService.hashPassword(password);
      const isMatch = await authService.comparePasswords(password, hashed);
      
      expect(isMatch).toBe(true);
    });
    
    it('should return false for non-matching passwords', async () => {
      const hashed = await authService.hashPassword('Test123!');
      const isMatch = await authService.comparePasswords('Wrong123!', hashed);
      
      expect(isMatch).toBe(false);
    });
  });
});
