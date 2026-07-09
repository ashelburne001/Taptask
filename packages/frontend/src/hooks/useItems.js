import { useState, useCallback } from 'react';
import { apiClient } from '../api/client';
export function useItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchItems = useCallback(async (search) => {
        try {
            setLoading(true);
            setError(null);
            const { items: data } = await apiClient.listItems();
            // Filter by search if provided
            const filtered = search
                ? data.filter((item) => item.itemNumber.toLowerCase().includes(search.toLowerCase()) ||
                    item.name.toLowerCase().includes(search.toLowerCase()))
                : data;
            setItems(filtered);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch items');
        }
        finally {
            setLoading(false);
        }
    }, []);
    const createItem = useCallback(async (data) => {
        try {
            setError(null);
            const result = await apiClient.createItem(data);
            await fetchItems();
            return result.id;
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to create item';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, [fetchItems]);
    const updateItem = useCallback(async (itemId, data) => {
        try {
            setError(null);
            await apiClient.updateItem(itemId, data);
            await fetchItems();
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to update item';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, [fetchItems]);
    const deleteItem = useCallback(async (itemId) => {
        try {
            setError(null);
            await apiClient.deleteItem(itemId);
            await fetchItems();
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to delete item';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, [fetchItems]);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    return {
        items,
        loading,
        error,
        fetchItems,
        createItem,
        updateItem,
        deleteItem,
        clearError,
    };
}
//# sourceMappingURL=useItems.js.map