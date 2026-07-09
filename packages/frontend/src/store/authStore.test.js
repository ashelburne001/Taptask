import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
describe('authStore', () => {
    beforeEach(() => {
        const { logout } = useAuthStore.getState();
        logout();
    });
    it('should initialize with null user and token', () => {
        const { user, token } = useAuthStore.getState();
        expect(user).toBeNull();
        expect(token).toBeNull();
    });
    it('should login and set user and token', () => {
        const { login } = useAuthStore.getState();
        const testUser = {
            id: '123',
            email: 'test@example.com',
            name: 'Test User',
            role: 'employee',
        };
        const testToken = 'test-token';
        login(testToken, testUser);
        const { user, token } = useAuthStore.getState();
        expect(user).toEqual(testUser);
        expect(token).toBe(testToken);
    });
    it('should logout and clear user and token', () => {
        const { login, logout } = useAuthStore.getState();
        const testUser = {
            id: '123',
            email: 'test@example.com',
            name: 'Test User',
            role: 'employee',
        };
        login('test-token', testUser);
        logout();
        const { user, token } = useAuthStore.getState();
        expect(user).toBeNull();
        expect(token).toBeNull();
    });
});
//# sourceMappingURL=authStore.test.js.map