// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
    skipAuth?: boolean;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { skipAuth = false, ...fetchOptions } = options;
        const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers };

        if (!skipAuth) {
            const token = this.getToken();
            if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, { ...fetchOptions, headers });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || `HTTP error ${response.status}`);
        }
        return response.json();
    }

    // Auth
    async login(email: string, password: string) {
        return this.request<{ user: User; token: string }>('/api/auth/login', {
            method: 'POST', body: JSON.stringify({ email, password }), skipAuth: true,
        });
    }

    async register(email: string, password: string, name: string) {
        return this.request<{ user: User; token: string }>('/api/auth/register', {
            method: 'POST', body: JSON.stringify({ email, password, name }), skipAuth: true,
        });
    }

    async getMe() { return this.request<User>('/api/auth/me'); }

    // Products
    async getProducts(params?: { tag?: string; search?: string }) {
        const query = new URLSearchParams();
        if (params?.tag) query.set('tag', params.tag);
        if (params?.search) query.set('search', params.search);
        return this.request<Product[]>(`/api/products${query.toString() ? `?${query}` : ''}`, { skipAuth: true });
    }

    async getProduct(id: string) {
        return this.request<Product>(`/api/products/${id}`, { skipAuth: true });
    }

    async createProduct(data: Omit<Product, 'id'>) {
        return this.request<Product>('/api/products', { method: 'POST', body: JSON.stringify(data) });
    }

    async updateProduct(id: string, data: Partial<Product>) {
        return this.request<Product>(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    }

    async deleteProduct(id: string) {
        return this.request<{ message: string }>(`/api/products/${id}`, { method: 'DELETE' });
    }

    async generateAIDescription(productId: string) {
        return this.request<Product>(`/api/products/${productId}/ai-description`, { method: 'POST' });
    }

    // Chat
    async sendMessage(message: string) {
        return this.request<{ conversationId: string; message: Message; shouldHandover: boolean }>(
            '/api/chat/send', { method: 'POST', body: JSON.stringify({ message }) }
        );
    }

    async getChatHistory(conversationId: string) {
        return this.request<Message[]>(`/api/chat/history/${conversationId}`);
    }

    // Admin
    async getDashboard() { return this.request<DashboardStats>('/api/admin/dashboard'); }
    async getConversations() { return this.request<Conversation[]>('/api/admin/conversations'); }
    async getInventory() { return this.request<InventoryStats>('/api/admin/inventory'); }

    // Admin Orders
    async getOrders() { return this.request<Order[]>('/api/admin/orders'); }
    async updateOrderStatus(orderId: string, status: OrderStatus) {
        return this.request<Order>(`/api/admin/orders/${orderId}/status`, {
            method: 'PATCH', body: JSON.stringify({ status })
        });
    }

    // Admin Customers
    async getCustomers() { return this.request<Customer[]>('/api/admin/customers'); }
    async createCustomer(data: { email: string; password: string; name: string; role?: 'CUSTOMER' | 'ADMIN' }) {
        return this.request<Customer>('/api/admin/customers', { method: 'POST', body: JSON.stringify(data) });
    }
    async toggleCustomerLock(customerId: string) {
        return this.request<Customer>(`/api/admin/customers/${customerId}/lock`, { method: 'PATCH' });
    }

    // User Orders
    async createOrder(data: CreateOrderRequest) {
        return this.request<{ order: UserOrder; paymentMethod: string }>('/api/orders', { method: 'POST', body: JSON.stringify(data) });
    }
    async getUserOrders() {
        return this.request<UserOrder[]>('/api/orders');
    }
    async getUserOrder(id: string) {
        return this.request<UserOrder>(`/api/orders/${id}`);
    }

    // Payment
    async createMomoPayment(orderId: string) {
        return this.request<{ payUrl: string; orderId: string }>('/api/payment/momo', { method: 'POST', body: JSON.stringify({ orderId }) });
    }
    async createVnpayPayment(orderId: string) {
        return this.request<{ payUrl: string; orderId: string }>('/api/payment/vnpay', { method: 'POST', body: JSON.stringify({ orderId }) });
    }
    async confirmCodOrder(orderId: string) {
        return this.request<{ success: boolean; orderId: string }>('/api/payment/cod', { method: 'POST', body: JSON.stringify({ orderId }) });
    }
}

// Types
export interface User {
    id: string; email: string; name: string; role: 'CUSTOMER' | 'ADMIN' | 'SUPPORT'; preferences?: Record<string, unknown>;
}

export interface Product {
    id: string; name: string; slug: string; price: number; oldPrice?: number;
    description?: string; descriptionAi?: string; image: string; images: string[]; tags: string[]; stock: number;
}

export interface Message {
    id: string; conversationId: string; content: string; sender: 'USER' | 'AI' | 'ADMIN'; isInternal: boolean; createdAt: string;
}

export interface Conversation {
    id: string; userId: string; status: 'ACTIVE' | 'RESOLVED' | 'PENDING_HUMAN';
    sentimentScore?: number; summary?: string; tags: string[];
    user?: { name: string; email: string }; messages?: Message[]; createdAt: string; updatedAt: string;
}

export interface DashboardStats {
    todayOrders: number; todayRevenue: number; pendingConversations: number;
    lowStockProducts: { id: string; name: string; stock: number }[]; averageSentiment: number; totalCustomers: number;
}

export interface InventoryStats {
    products: { id: string; name: string; stock: number; price: number }[];
    totalValue: number; lowStockCount: number; outOfStockCount: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
    id: string; productId: string; quantity: number; price: number;
    product: { id: string; name: string; image: string };
}

export interface Order {
    id: string; userId: string; status: OrderStatus; total: number; note?: string;
    createdAt: string; updatedAt: string;
    user: { id: string; name: string; email: string };
    items: OrderItem[];
}

export interface Customer {
    id: string; email: string; name: string; role: 'CUSTOMER' | 'ADMIN' | 'SUPPORT';
    isLocked: boolean; createdAt: string;
    orderCount: number; totalSpent: number;
}

export interface ShippingAddress {
    name: string; phone: string; address: string; city: string; district?: string; ward?: string;
}

export interface CreateOrderRequest {
    items: { productId: string; quantity: number }[];
    shippingAddress: ShippingAddress;
    note?: string;
    paymentMethod: 'MOMO' | 'VNPAY' | 'COD' | 'BANK';
}

export interface UserOrder {
    id: string; userId: string; status: OrderStatus; total: number; note?: string;
    createdAt: string; updatedAt: string;
    items: OrderItem[];
}

export const api = new ApiClient(API_BASE_URL);
