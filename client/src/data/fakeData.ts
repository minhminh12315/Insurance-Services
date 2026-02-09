import type {
    User, InsuranceCategory, InsuranceScheme, Policy,
    Claim, PremiumPayment, PolicyLoan, NewsAnnouncement,
    DashboardStats, Activity
} from '../types';

// --- User Management ---
export const fakeUsers: User[] = [
    {
        user_id: 1,
        full_name: 'Thanh Nguyen',
        email: 'thanh@example.com',
        phone_number: '0901234567',
        date_of_birth: '1990-05-15',
        gender: 'Male',
        address: '123 Le Loi St',
        city: 'Ho Chi Minh City',
        role: 'Admin',
        created_at: '2023-01-01T10:00:00Z',
        updated_at: '2023-01-01T10:00:00Z',
    },
    {
        user_id: 999,
        full_name: 'System Admin',
        email: 'admin',
        phone_number: '0000000000',
        date_of_birth: '1990-01-01',
        gender: 'Other',
        address: 'Admin HQ',
        city: 'Server',
        role: 'Admin',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        user_id: 2,
        full_name: 'Bao Tram',
        email: 'tram@example.com',
        phone_number: '0909876543',
        date_of_birth: '1995-08-20',
        gender: 'Female',
        address: '456 Nguyen Hue St',
        city: 'Ho Chi Minh City',
        role: 'Customer',
        created_at: '2023-02-15T09:30:00Z',
        updated_at: '2023-02-15T09:30:00Z',
    },
    {
        user_id: 3,
        full_name: 'Minh Hoang',
        email: 'hoang@example.com',
        phone_number: '0912345678',
        date_of_birth: '1988-12-10',
        gender: 'Male',
        address: '789 Tran Hung Dao St',
        city: 'Da Nang',
        role: 'Customer',
        created_at: '2023-03-10T14:20:00Z',
        updated_at: '2023-03-10T14:20:00Z',
    }
];

// --- Insurance Products ---
export const insuranceCategories: InsuranceCategory[] = [
    { category_id: 1, category_name: 'Life Insurance', description: 'Financial protection for your family.' },
    { category_id: 2, category_name: 'Health Insurance', description: 'Coverage for medical expenses.' },
    { category_id: 3, category_name: 'Motor Insurance', description: 'Protection for your vehicles.' },
    { category_id: 4, category_name: 'Home Insurance', description: 'Safeguard your property.' },
];

export const insuranceSchemes: InsuranceScheme[] = [
    {
        scheme_id: 1,
        category_id: 1,
        scheme_name: 'Term Life Plus',
        description: 'High coverage life insurance for a fixed period.',
        min_term: 10,
        max_term: 30,
        min_investment_amount: 1000,
        max_investment_amount: 50000,
        profit_ratio: 5.5,
        new_launch_date: '2023-01-10',
        is_active: true,
    },
    {
        scheme_id: 2,
        category_id: 2,
        scheme_name: 'Family Health Guard',
        description: 'Comprehensive medical coverage for the whole family.',
        min_term: 1,
        max_term: 5,
        min_investment_amount: 500,
        max_investment_amount: 10000,
        profit_ratio: 0.0,
        new_launch_date: '2023-02-20',
        is_active: true,
    },
    {
        scheme_id: 3,
        category_id: 3,
        scheme_name: 'Auto Secure Pro',
        description: 'Standard motor insurance with 24/7 roadside assistance.',
        min_term: 1,
        max_term: 3,
        min_investment_amount: 200,
        max_investment_amount: 5000,
        profit_ratio: 0.0,
        new_launch_date: '2023-03-05',
        is_active: true,
    }
];

// --- Financials ---
export const fakePolicies: Policy[] = [
    {
        policy_id: 1,
        user_id: 2,
        scheme_id: 1,
        policy_number: 'POL-1001',
        start_date: '2023-06-01',
        maturity_date: '2043-06-01',
        term_years: 20,
        payment_frequency: 'Monthly',
        sum_assured: 100000,
        premium_amount: 150,
        policy_status: 'Active',
        created_at: '2023-05-28T08:00:00Z',
    },
];

export const fakeClaims: Claim[] = [
    {
        claim_id: 1,
        policy_id: 1,
        user_id: 2,
        claim_date: '2023-11-20',
        claim_amount: 2500,
        reason: 'Hospitalization for surgery',
        status: 'Approved',
        admin_comment: 'Verified medical bills.',
    }
];

export const fakePayments: PremiumPayment[] = [
    {
        payment_id: 1,
        policy_id: 1,
        user_id: 2,
        amount_paid: 150,
        payment_date: '2023-07-01',
        payment_method: 'Credit Card',
        transaction_reference: 'TXN-998877',
        status: 'Success',
    }
];

export const fakeLoans: PolicyLoan[] = [
    {
        loan_id: 1,
        policy_id: 1,
        user_id: 2,
        loan_amount: 5000,
        interest_rate: 4.5,
        application_date: '2023-08-15',
        approval_date: '2023-08-20',
        loan_status: 'Approved',
    }
];

// --- Announcements ---
export const fakeNews: NewsAnnouncement[] = [
    {
        news_id: 1,
        title: 'New Policy Terms for 2024',
        content: 'We have updated our terms and conditions for all life insurance products.',
        published_date: '2023-12-01',
        author_id: 1,
    }
];

// --- Compatibility & Helpers ---
export const fakeProducts = insuranceSchemes.map(s => ({
    id: s.scheme_id.toString(),
    name: s.scheme_name,
    category: insuranceCategories.find(c => c.category_id === s.category_id)?.category_name || 'General',
    price: s.min_investment_amount || 0,
    stock: 100,
    imageUrl: '',
    createdAt: s.new_launch_date || '',
    ...s
}));

export const categories = insuranceCategories.map(c => c.category_name);

export const dashboardStats: DashboardStats = {
    totalPolicies: 1284,
    totalRevenue: 485920,
    activeClaims: 42,
    totalUsers: 3842,
    revenueChange: 8.2,
    policyChange: 12.5,
};

export const recentActivity: Activity[] = [
    { id: '1', type: 'policy', message: 'New Home Insurance policy #POL-8829 issued', time: '2 mins ago', icon: '📄' },
    { id: '2', type: 'claim', message: 'Claim #CLM-1022 status updated to "Approved"', time: '45 mins ago', icon: '✅' },
    { id: '3', type: 'user', message: 'New agent "Bao Tram" joined the platform', time: '2 hours ago', icon: '👤' },
    { id: '4', type: 'payment', message: 'Late payment reminder sent to 12 customers', time: '5 hours ago', icon: '🔔' },
    { id: '5', type: 'news', message: 'New regulation update published to news section', time: '1 day ago', icon: '📰' },
];
