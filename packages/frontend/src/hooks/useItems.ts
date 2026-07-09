import { useState, useCallback } from 'react'
import { apiClient } from '../api/client'

export interface ItemData {
  id: string
  itemNumber: string
  name: string
  description?: string
  gtin?: string
  upc?: string
  unitOfMeasure: string
  parLevel: number
  binSize: number
  imageUrl?: string
  isActive: boolean
}

export interface CreateItemData {
  itemNumber: string
  name: string
  description?: string
  gtin?: string
  upc?: string
  unitOfMeasure: string
  parLevel: number
  binSize: number
  imageUrl?: string
}

export interface UpdateItemData {
  itemNumber?: string
  name?: string
  description?: string
  gtin?: string
  upc?: string
  unitOfMeasure?: string
  parLevel?: number
  binSize?: number
  imageUrl?: string
  isActive?: boolean
}

interface UseItemsReturn {
  items: ItemData[]
  loading: boolean
  error: string | null
  fetchItems: (search?: string) => Promise<void>
  createItem: (data: CreateItemData) => Promise<string>
  updateItem: (itemId: string, data: UpdateItemData) => Promise<void>
  deleteItem: (itemId: string) => Promise<void>
  clearError: () => void
}

export function useItems(): UseItemsReturn {
  const [items, setItems] = useState<ItemData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const { items: data } = await apiClient.listItems()

      // Filter by search if provided
      const filtered = search
        ? data.filter(
            (item: any) =>
              item.itemNumber.toLowerCase().includes(search.toLowerCase()) ||
              item.name.toLowerCase().includes(search.toLowerCase())
          )
        : data

      setItems(filtered)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }, [])

  const createItem = useCallback(
    async (data: CreateItemData): Promise<string> => {
      try {
        setError(null)
        const result = await apiClient.createItem(data)
        await fetchItems()
        return result.id
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to create item'
        setError(errorMsg)
        throw new Error(errorMsg)
      }
    },
    [fetchItems]
  )

  const updateItem = useCallback(
    async (itemId: string, data: UpdateItemData) => {
      try {
        setError(null)
        await apiClient.updateItem(itemId, data)
        await fetchItems()
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to update item'
        setError(errorMsg)
        throw new Error(errorMsg)
      }
    },
    [fetchItems]
  )

  const deleteItem = useCallback(
    async (itemId: string) => {
      try {
        setError(null)
        await apiClient.deleteItem(itemId)
        await fetchItems()
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to delete item'
        setError(errorMsg)
        throw new Error(errorMsg)
      }
    },
    [fetchItems]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    clearError,
  }
}
