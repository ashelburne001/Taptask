import { useState, useCallback } from 'react';
import { apiClient } from '../api/client';
export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchUsers = useCallback(async (search, role, departmentId) => {
        try {
            setLoading(true);
            setError(null);
            const { users: data } = await apiClient.listUsers(role, search, departmentId);
            setUsers(data);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch users');
        }
        finally {
            setLoading(false);
        }
    }, []);
    const createUser = useCallback(async (data) => {
        try {
            setError(null);
            const result = await apiClient.createUser(data);
            await fetchUsers();
            return result.id;
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to create user';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, [fetchUsers]);
    const updateUser = useCallback(async (userId, data) => {
        try {
            setError(null);
            await apiClient.updateUser(userId, data);
            await fetchUsers();
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to update user';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, [fetchUsers]);
    const deleteUser = useCallback(async (userId) => {
        try {
            setError(null);
            await apiClient.deleteUser(userId);
            await fetchUsers();
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to delete user';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, [fetchUsers]);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        clearError,
    };
}
//# sourceMappingURL=useUsers.js.map