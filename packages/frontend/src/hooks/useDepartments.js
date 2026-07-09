import { useState, useCallback } from 'react';
import { apiClient } from '../api/client';
export function useDepartments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchDepartments = useCallback(async (search) => {
        try {
            setLoading(true);
            setError(null);
            const { departments: data } = await apiClient.listDepartments();
            // Filter by search if provided
            const filtered = search
                ? data.filter((d) => d.code.toLowerCase().includes(search.toLowerCase()) ||
                    d.name.toLowerCase().includes(search.toLowerCase()))
                : data;
            setDepartments(filtered);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch departments');
        }
        finally {
            setLoading(false);
        }
    }, []);
    const createDepartment = useCallback(async (data) => {
        try {
            setError(null);
            const result = await apiClient.createDepartment(data);
            await fetchDepartments();
            return result.id;
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to create department';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, [fetchDepartments]);
    const updateDepartment = useCallback(async (deptId, data) => {
        try {
            setError(null);
            await apiClient.updateDepartment(deptId, data);
            await fetchDepartments();
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to update department';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, [fetchDepartments]);
    const deleteDepartment = useCallback(async (deptId) => {
        try {
            setError(null);
            await apiClient.deleteDepartment(deptId);
            await fetchDepartments();
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to delete department';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, [fetchDepartments]);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    return {
        departments,
        loading,
        error,
        fetchDepartments,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        clearError,
    };
}
//# sourceMappingURL=useDepartments.js.map