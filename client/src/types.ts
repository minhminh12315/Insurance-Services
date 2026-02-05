// --- User Management ---
export type UserRole = 'Customer' | 'Admin' | 'Staff';
export type Gender = 'Male' | 'Female' | 'Other';

export interface User {
    user_id: number;
    full_name: string;
    email: string;
    password_hash?: string;
    phone_number: string | null;
    date_of_birth: string;
    gender: Gender | null;
    address: string | null;
    city: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

// --- Insurance Products ---
export interface InsuranceCategory {
    category_id: number;
    category_name: string;
    description: string | null;
}

export interface InsuranceScheme {
    scheme_id: number;
    category_id: number | null;
    scheme_name: string;
    description: string | null;
    min_term: number | null;
    max_term: number | null;
    min_investment_amount: number | null;
    max_investment_amount: number | null;
    profit_ratio: number | null;
    new_launch_date: string | null;
    is_active: boolean;
}

// --- Policies & Details ---
export type PolicyStatus = 'Active' | 'Pending' | 'Lapsed' | 'Claimed' | 'Cancelled';
export type PaymentFrequency = 'Monthly' | 'Quarterly' | 'Yearly' | 'OneTime';

export interface Policy {
    policy_id: number;
    user_id: number;
    scheme_id: number;
    policy_number: string;
    start_date: string;
    maturity_date: string;
    term_years: number;
    payment_frequency: PaymentFrequency;
    sum_assured: number;
    premium_amount: number;
    policy_status: PolicyStatus;
    created_at: string;
}

export interface HomePolicyDetail {
    detail_id: number;
    policy_id: number | null;
    property_address: string;
    property_value: number | null;
    structure_type: string | null;
    built_year: number | null;
}

export interface LifePolicyDetail {
    detail_id: number;
    policy_id: number | null;
    nominee_name: string | null;
    nominee_relation: string | null;
}

export interface MedicalPolicyDetail {
    detail_id: number;
    policy_id: number | null;
    pre_existing_diseases: string | null;
    hospital_network_tier: string | null;
    is_family_floater: boolean;
}

export interface MotorPolicyDetail {
    detail_id: number;
    policy_id: number | null;
    vehicle_reg_number: string | null;
    vehicle_model: string | null;
    vehicle_type: 'Car' | 'Bike' | 'Truck' | null;
    engine_number: string | null;
    chassis_number: string | null;
    manufacturing_year: number | null;
}

// --- Financials ---
export type ClaimStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';

export interface Claim {
    claim_id: number;
    policy_id: number;
    user_id: number;
    claim_date: string;
    claim_amount: number;
    reason: string;
    status: ClaimStatus;
    admin_comment: string | null;
}

export type LoanStatus = 'Requested' | 'Approved' | 'Rejected' | 'Repaid';

export interface PolicyLoan {
    loan_id: number;
    policy_id: number;
    user_id: number;
    loan_amount: number;
    interest_rate: number;
    application_date: string;
    approval_date: string | null;
    loan_status: LoanStatus;
}

export type PaymentMethod = 'Credit Card' | 'Bank Transfer' | 'E-Wallet' | 'Cash';
export type PaymentStatus = 'Success' | 'Failed' | 'Pending';

export interface PremiumPayment {
    payment_id: number;
    policy_id: number;
    user_id: number;
    amount_paid: number;
    payment_date: string;
    payment_method: PaymentMethod | null;
    transaction_reference: string | null;
    status: PaymentStatus;
}

// --- Announcements ---
export interface NewsAnnouncement {
    news_id: number;
    title: string;
    content: string;
    published_date: string;
    author_id: number | null;
}

// --- Dashboard & UI Helpers ---
export interface DashboardStats {
    totalPolicies: number;
    totalRevenue: number;
    activeClaims: number;
    totalUsers: number;
    revenueChange: number;
    policyChange: number;
}

export interface Activity {
    id: string;
    type: 'policy' | 'claim' | 'user' | 'payment' | 'news';
    message: string;
    time: string;
    icon?: string;
}

// Re-map Legacy Types for Compatibility (Optional, but good for migration)
export interface Product extends InsuranceScheme {
    id: string; // compatibility with existing components
    name: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
    createdAt: string;
}
