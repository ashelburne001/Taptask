import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    })

    this.client.interceptors.request.use((config) => {
      const { token } = useAuthStore.getState()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async login(email: string, password: string) {
    const { data } = await this.client.post('/auth/login', { email, password })
    return data
  }

  async register(email: string, name: string, password: string) {
    const { data } = await this.client.post('/auth/register', { email, name, password })
    return data
  }

  async getMe() {
    const { data } = await this.client.get('/auth/me')
    return data.user
  }

  async getBin(binCode: string) {
    const { data } = await this.client.get(`/bins/${binCode}`)
    return data
  }

  async listBins(departmentId?: string, search?: string) {
    const { data } = await this.client.get('/bins', {
      params: { departmentId, search },
    })
    return data
  }

  async createRequest(binId: string, requestType: string, quantityRequested?: number, notes?: string, photoUrl?: string) {
    const { data } = await this.client.post('/requests', {
      binId,
      requestType,
      quantityRequested,
      notes,
      photoUrl,
    })
    return data
  }

  async listRequests(status?: string, departmentId?: string, technicianId?: string, limit = 50, offset = 0) {
    const { data } = await this.client.get('/requests', {
      params: { status, departmentId, technicianId, limit, offset },
    })
    return data
  }

  async updateRequest(requestId: string, updates: any) {
    const { data } = await this.client.patch(`/requests/${requestId}`, updates)
    return data
  }

  async getDashboardKpis() {
    const { data } = await this.client.get('/dashboard/kpis')
    return data
  }

  async getTechnicianStats() {
    const { data } = await this.client.get('/dashboard/technician-stats')
    return data
  }

  async getInventoryHealth() {
    const { data } = await this.client.get('/dashboard/inventory-health')
    return data
  }
}

export const apiClient = new ApiClient()
