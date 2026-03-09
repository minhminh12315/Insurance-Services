// --- User Management ---
export type UserRole = 'Customer' | 'Admin' | 'Employee' | 'Staff';
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
export type PolicyStatus = 'Active' | 'Pending' | 'Lapsed' | 'Claimed' | 'Cancelled' | 'Matured';
export type PaymentFrequency = 'Monthly' | 'Quarterly' | 'HalfYearly' | 'Yearly' | 'OneTime';
export type InsuranceType = 'Life' | 'Health' | 'Motor' | 'Home';

// Common Policy Interface
export interface Policy {
    policy_id: number;
    user_id: number;
    scheme_id: number;
    policy_number: string;
    insured_name?: string;
    type: InsuranceType; // Discriminator
    start_date: string;
    maturity_date: string;
    term_years: number;
    payment_frequency: PaymentFrequency;
    sum_assured: number;
    premium_amount: number;
    policy_status: PolicyStatus;
    created_at: string;
    // Union of detail types based on 'type'
    details: LifePolicyDetails | HealthPolicyDetails | MotorPolicyDetails | HomePolicyDetails;
}

// 1. Life Insurance Details
export interface LifePolicyDetails {
    // Main Product
    main_benefit: {
        coverage_scope: string; // e.g. "Death or Total Permanent Disability"
        end_age: number; // e.g. 99
        sum_assured: number;
    };
    // Supplementaries
    riders: {
        name: string;
        type: 'Accident' | 'CriticalIllness' | 'Waiver' | 'Hospital' | 'Other';
        sum_assured: number;
        premium: number;
        description?: string; // e.g. "100 diseases covered"
        is_waiver_active?: boolean; // For Waiver of Premium
    }[];
    beneficiaries: { name: string; relation: string; percentage: number }[];
    cash_value: {
        current_balance: number;
        surrender_value: number; // "Right now" value
    };
    premium_history: { year: number; status: 'Paid' | 'Due' | 'Future' }[];
}

// 2. Health Insurance Details (Usage Tracker)
export interface HealthPolicyDetails {
    // Main Benefit: Inpatient
    main_benefit: {
        total_limit_per_year: number;
        room_board_limit: number; // per day
        surgery_limit: number; // per case
        used_amount: number;
    };
    // Supplementary Benefits (Outpatient, Dental, Maternity)
    supplementary_benefits: {
        name: string; // e.g., "Outpatient", "Dental Care"
        type: 'Outpatient' | 'Dental' | 'Maternity' | 'Other';
        limit_per_year: number;
        used_amount: number;
        waiting_period_end_date?: string; // If active, show date
    }[];
    hospital_network_tier: string;
    is_family_floater: boolean;
    e_card_image?: string;
}

// 3. Motor Insurance Details
export interface MotorPolicyDetails {
    // 1. Compulsory Civil Liability (Compulsory)
    tnds_compulsory: {
        is_active: boolean;
        limit_per_person: number; // e.g. 150,000,000
        limit_property: number; // e.g. 100,000,000
        qr_code_url: string; // "E-Certificate"
    };
    // 2. Voluntary Material / Physical Damage (Material)
    voluntary_coverage?: {
        is_active: boolean;
        vehicle_value: number; // Sum assured for the car
        deductible_amount: number; // Deductible e.g. 500k
        riders: ('Hydrostatic' | 'PartsTheft' | 'GenuineGarage' | 'PassengerAccident' | 'NewReplacement')[];
    };
    // 3. Vehicle Info
    vehicle_info: {
        type: 'Car' | 'Bike';
        brand_model: string;
        license_plate: string;
        chassis_number: string;
        engine_number: string;
    };
    rescue_hotline?: string;
}

// 4. Home Insurance Details
// 4. Home Insurance Details
export interface HomePolicyDetails {
    // 1. Main: Structure & Risks
    main_benefit: {
        property_address: string;
        property_type: 'Apartment' | 'Villa' | 'Townhouse';
        structure_value: number; // The "Shell" value
        coverage_risks: ('Fire' | 'Flood' | 'Theft' | 'Lightning' | 'Explosion' | 'Earthquake')[];
    };
    // 2. Supplementary: Contents & Liability
    supplementary_benefits: {
        contents_value: number; // Interior assets (TV, Fridge...)
        liability_limit: number; // Compensation for neighbors
        rental_support_limit: number; // Temporary accommodation cost
    };
    asset_photos_urls?: string[]; // Proof of contents
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
