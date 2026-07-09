import axios from 'axios';
import { useAuthStore } from '../store/authStore';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
class ApiClient {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
        });
        this.client.interceptors.request.use((config) => {
            const { token } = useAuthStore.getState();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    async login(email, password) {
        const { data } = await this.client.post('/auth/login', { email, password });
        return data;
    }
    async register(email, name, password) {
        const { data } = await this.client.post('/auth/register', { email, name, password });
        return data;
    }
    async getMe() {
        const { data } = await this.client.get('/auth/me');
        return data.user;
    }
    async getBin(binCode) {
        const { data } = await this.client.get(`/bins/${binCode}`);
        return data;
    }
    async listBins(departmentId, search) {
        const { data } = await this.client.get('/bins', {
            params: { departmentId, search },
        });
        return data;
    }
    async createRequest(binId, requestType, quantityRequested, notes, photoUrl) {
        const { data } = await this.client.post('/requests', {
            binId,
            requestType,
            quantityRequested,
            notes,
            photoUrl,
        });
        return data;
    }
    async listRequests(status, departmentId, technicianId, limit = 50, offset = 0) {
        const { data } = await this.client.get('/requests', {
            params: { status, departmentId, technicianId, limit, offset },
        });
        return data;
    }
    async updateRequest(requestId, updates) {
        const { data } = await this.client.patch(`/requests/${requestId}`, updates);
        return data;
    }
    async getDashboardKpis() {
        const { data } = await this.client.get('/dashboard/kpis');
        return data;
    }
    async getTechnicianStats() {
        const { data } = await this.client.get('/dashboard/technician-stats');
        return data;
    }
    async getInventoryHealth() {
        const { data } = await this.client.get('/dashboard/inventory-health');
        return data;
    }
    // Users Management
    async listUsers(role, search, departmentId) {
        const { data } = await this.client.get('/users', {
            params: { role, search, departmentId },
        });
        return data;
    }
    async createUser(userData) {
        const { data } = await this.client.post('/users', userData);
        return data;
    }
    async updateUser(userId, userData) {
        const { data } = await this.client.patch(`/users/${userId}`, userData);
        return data;
    }
    async deleteUser(userId) {
        const { data } = await this.client.delete(`/users/${userId}`);
        return data;
    }
    // Departments Management
    async listDepartments() {
        const { data } = await this.client.get('/admin/departments');
        return data;
    }
    async createDepartment(deptData) {
        const { data } = await this.client.post('/admin/departments', deptData);
        return data;
    }
    async updateDepartment(deptId, deptData) {
        const { data } = await this.client.patch(`/admin/departments/${deptId}`, deptData);
        return data;
    }
    async deleteDepartment(deptId) {
        const { data } = await this.client.delete(`/admin/departments/${deptId}`);
        return data;
    }
    // Items Management
    async listItems() {
        const { data } = await this.client.get('/admin/items');
        return data;
    }
    async createItem(itemData) {
        const { data } = await this.client.post('/admin/items', itemData);
        return data;
    }
    async updateItem(itemId, itemData) {
        const { data } = await this.client.patch(`/admin/items/${itemId}`, itemData);
        return data;
    }
    async deleteItem(itemId) {
        const { data } = await this.client.delete(`/admin/items/${itemId}`);
        return data;
    }
}
export const apiClient = new ApiClient();
//# sourceMappingURL=client.js.map