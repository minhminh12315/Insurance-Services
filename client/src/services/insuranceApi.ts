import api from './api';
import type { AuthSession } from './authStorage';
import type { Gender, User, UserRole } from '../types';

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface PaginatedResponse<T> {
    items: T;
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

interface LoginApiResponse {
    success: boolean;
    message: string;
    token?: string;
    refreshToken?: string;
    user?: BackendUser;
}

interface BackendUser {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    dateOfBirth: string;
    gender?: string | null;
    address?: string | null;
    city?: string | null;
    role?: string | null;
    createdAt?: string | null;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
    dateOfBirth: string;
    gender?: string;
    address?: string;
    city?: string;
}

export interface InsuranceSchemeModel {
    schemeId: number;
    categoryId?: number | null;
    categoryName?: string | null;
    schemeName: string;
    description?: string | null;
    minTerm?: number | null;
    maxTerm?: number | null;
    minInvestmentAmount?: number | null;
    maxInvestmentAmount?: number | null;
    profitRatio?: number | null;
    isActive?: boolean | null;
}

export type PremiumFrequency = 'Monthly' | 'Quarterly' | 'HalfYearly' | 'Yearly';

export interface CalculatePremiumPayload {
    schemeId: number;
    sumAssured: number;
    termYears: number;
    paymentFrequency: PremiumFrequency;
}

export interface PremiumCalculationModel {
    schemeId: number;
    schemeName: string;
    sumAssured: number;
    termYears: number;
    paymentFrequency: PremiumFrequency;
    annualPremium: number;
    premiumPerInstallment: number;
    numberOfInstallments: number;
    totalPremiumPayable: number;
    calculationDetails: string;
}

export interface CreatePolicyPayload {
    schemeId: number;
    termYears: number;
    paymentFrequency: PremiumFrequency;
    sumAssured: number;
    lifeDetails?: {
        nomineeName: string;
        nomineeRelation: string;
    };
    medicalDetails?: {
        preExistingDiseases?: string;
        hospitalNetworkTier?: string;
        isFamilyFloater?: boolean;
    };
    motorDetails?: {
        vehicleRegNumber: string;
        vehicleModel: string;
        vehicleType?: string;
        engineNumber?: string;
        chassisNumber?: string;
        manufacturingYear?: number;
    };
    homeDetails?: {
        propertyAddress: string;
        propertyValue?: number;
        structureType?: string;
        builtYear?: number;
    };
}

export interface PolicyModel {
    policyId: number;
    policyNumber: string;
    schemeId: number;
    schemeName: string;
    userId: number;
}

export interface PolicyOverviewModel {
    policyId: number;
    userId: number;
    userName: string;
    schemeId: number;
    schemeName: string;
    categoryName: string;
    policyNumber: string;
    startDate: string;
    maturityDate: string;
    termYears: number;
    paymentFrequency: string;
    sumAssured: number;
    premiumAmount: number;
    policyStatus?: string | null;
}

export interface PolicyDetailModel extends PolicyOverviewModel {
    policyDetails?: Record<string, unknown> | null;
}

export interface CreatePaymentPayload {
    policyId: number;
    amountPaid: number;
    paymentMethod: string;
    transactionReference?: string;
}

export interface PaymentModel {
    paymentId: number;
    policyId: number;
    amountPaid: number;
    paymentDate?: string | null;
    paymentMethod?: string | null;
    transactionReference?: string | null;
    status?: string | null;
}

export interface VNPayRequestPayload {
    orderID: number;
    amount: number;
    paymentMethod?: string;
    orderDescription?: string;
}

export interface VNPayPaymentResponse {
    success: boolean;
    paymentUrl?: string;
    message?: string;
}

const normalizeRole = (role?: string | null): UserRole => {
    if (role === 'Admin' || role === 'Employee' || role === 'Staff') {
        return role;
    }
    return 'Customer';
};

const normalizeGender = (gender?: string | null): Gender | null => {
    if (gender === 'Male' || gender === 'Female' || gender === 'Other') {
        return gender;
    }
    return null;
};

const mapBackendUser = (user: BackendUser): User => ({
    user_id: user.userId,
    full_name: user.fullName,
    email: user.email,
    phone_number: user.phoneNumber || null,
    date_of_birth: user.dateOfBirth,
    gender: normalizeGender(user.gender),
    address: user.address || null,
    city: user.city || null,
    role: normalizeRole(user.role),
    created_at: user.createdAt || new Date().toISOString(),
    updated_at: user.createdAt || new Date().toISOString(),
});

const ensureAuthSession = (response: LoginApiResponse): AuthSession => {
    if (!response.success || !response.user || !response.token) {
        throw new Error(response.message || 'Invalid authentication response.');
    }

    return {
        user: mapBackendUser(response.user),
        token: response.token,
        refreshToken: response.refreshToken,
    };
};

const isLifeCategory = (categoryName?: string | null): boolean => {
    if (!categoryName) {
        return false;
    }
    const normalized = categoryName.toLowerCase();
    return normalized.includes('life') || normalized.includes('nhan tho') || normalized.includes('nhân thọ');
};

export const authApi = {
    async login(email: string, password: string): Promise<AuthSession> {
        const { data } = await api.post<LoginApiResponse>('/auth/login', { email, password });
        return ensureAuthSession(data);
    },

    async register(payload: RegisterPayload): Promise<AuthSession> {
        const { data } = await api.post<LoginApiResponse>('/auth/register', payload);
        return ensureAuthSession(data);
    },

    async changePassword(email: string, oldPassword: string, newPassword: string): Promise<any> {
        const { data } = await api.post('/auth/change-password', { email, oldPassword, newPassword });
        return data;
    },

    async forgotPassword(payload: { email: string; otpCode?: string; newPassword?: string }): Promise<any> {
        const { data } = await api.post('/auth/forgot-password', payload);
        return data;
    },
};

export const schemeApi = {
    async getLifeSchemes(categoryId?: number): Promise<InsuranceSchemeModel[]> {
        const { data } = await api.get<ApiResponse<PaginatedResponse<InsuranceSchemeModel[]>>>('/insurancescheme', {
            params: { isActive: true, pageSize: 100, categoryId },
        });

        const schemes = data.data.items || [];
        if (categoryId) return schemes;
        const lifeSchemes = schemes.filter((scheme) => isLifeCategory(scheme.categoryName));
        return lifeSchemes.length > 0 ? lifeSchemes : schemes;
    },

    async calculatePremium(payload: CalculatePremiumPayload): Promise<PremiumCalculationModel> {
        const { data } = await api.post<ApiResponse<PremiumCalculationModel>>('/insurancescheme/calculate-premium', payload);
        return data.data;
    },

    async getAdminSchemes(page = 1, pageSize = 10, search = '', categoryId?: number): Promise<PaginatedResponse<InsuranceSchemeModel[]>> {
        const { data } = await api.get<ApiResponse<PaginatedResponse<InsuranceSchemeModel[]>>>('/insurancescheme', {
            params: { page, pageSize, search, categoryId },
        });
        return data.data;
    },

    async createScheme(payload: Partial<InsuranceSchemeModel>): Promise<InsuranceSchemeModel> {
        const { data } = await api.post<ApiResponse<InsuranceSchemeModel>>('/insurancescheme', payload);
        return data.data;
    },

    async updateScheme(id: number, payload: Partial<InsuranceSchemeModel>): Promise<InsuranceSchemeModel> {
        const { data } = await api.put<ApiResponse<InsuranceSchemeModel>>(`/insurancescheme/${id}`, payload);
        return data.data;
    },

    async deleteScheme(id: number): Promise<boolean> {
        const { data } = await api.delete<ApiResponse<any>>(`/insurancescheme/${id}`);
        return data.success;
    },
};

export const policyApi = {
    async getMyPolicies(activeOnly = false): Promise<PolicyOverviewModel[]> {
        const { data } = await api.get<ApiResponse<PolicyOverviewModel[]>>('/policy/my-policies', {
            params: { activeOnly },
        });
        return data.data;
    },

    async createPolicy(payload: CreatePolicyPayload): Promise<PolicyModel> {
        const { data } = await api.post<ApiResponse<PolicyModel>>('/policy', payload);
        return data.data;
    },

    async getPolicyById(policyId: number): Promise<PolicyDetailModel> {
        const { data } = await api.get<ApiResponse<PolicyDetailModel>>(`/policy/${policyId}`);
        return data.data;
    },
};

export const paymentApi = {
    async createPayment(payload: CreatePaymentPayload): Promise<PaymentModel> {
        const { data } = await api.post<ApiResponse<PaymentModel>>('/premiumpayment', payload);
        return data.data;
    },

    async getMyPayments(): Promise<PaymentModel[]> {
        const { data } = await api.get<ApiResponse<PaymentModel[]>>('/premiumpayment/my-payments');
        return data.data;
    },

    async getPaymentByOrderCode(orderCode: string): Promise<PaymentModel> {
        const { data } = await api.get<ApiResponse<PaymentModel>>(`/premiumpayment/by-order/${orderCode}`);
        return data.data;
    },
};

export const vnPayApi = {
    async createPaymentUrl(payload: VNPayRequestPayload): Promise<VNPayPaymentResponse> {
        const { data } = await api.post<VNPayPaymentResponse>('/vnpay/create-payment', payload);
        return data;
    },
};

// Category API
export interface InsuranceCategoryModel {
    categoryId: number;
    categoryName: string;
    description?: string | null;
}

export const categoryApi = {
    async getAllCategories(): Promise<InsuranceCategoryModel[]> {
        const { data } = await api.get<ApiResponse<InsuranceCategoryModel[]>>('/insurancecategory');
        return data.data;
    },

    async getAdminCategories(page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<InsuranceCategoryModel[]>> {
        const { data } = await api.get<PaginatedResponse<InsuranceCategoryModel[]>>('/InsuranceCategories', {
            params: { page, pageSize, search },
        });
        return data;
    },

    async deleteCategory(id: number): Promise<boolean> {
        const { data } = await api.delete<ApiResponse<any>>(`/insurancecategory/${id}`);
        return data.success;
    },
};

// News API
export interface NewsModel {
    newsId: number;
    title: string;
    content?: string | null;
    publishedDate?: string | null;
    authorId?: number | null;
    authorName?: string | null;
}

export const newsApi = {
    async getAllNews(): Promise<NewsModel[]> {
        const { data } = await api.get<ApiResponse<NewsModel[]>>('/news');
        return data.data;
    },
};

// Scheme API - Get all active schemes
export const schemeFullApi = {
    async getAllActiveSchemes(): Promise<InsuranceSchemeModel[]> {
        const { data } = await api.get<ApiResponse<PaginatedResponse<InsuranceSchemeModel[]>>>('/insurancescheme', {
            params: { isActive: true, pageSize: 100 },
        });
        return data.data.items || [];
    },
};
// User Profile API
export interface UpdateUserProfileDto {
    fullName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
}

export const userApi = {
    async getMyProfile(): Promise<User> {
        const { data } = await api.get<ApiResponse<BackendUser>>('/userprofile/me');
        return mapBackendUser(data.data);
    },

    async updateProfile(payload: UpdateUserProfileDto): Promise<User> {
        const { data } = await api.put<ApiResponse<BackendUser>>('/userprofile/me', payload);
        return mapBackendUser(data.data);
    },
};

// Interaction API
export interface ContactPayload {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const interactionApi = {
    async submitContact(payload: ContactPayload): Promise<ApiResponse<any>> {
        const { data } = await api.post<ApiResponse<any>>('/publicinteraction/contact', payload);
        return data;
    },
};

