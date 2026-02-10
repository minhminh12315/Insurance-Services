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
    { category_id: 1, category_name: 'Bảo hiểm nhân thọ', description: 'Bảo vệ tài chính cho gia đình bạn.' },
    { category_id: 2, category_name: 'Bảo hiểm y tế', description: 'Chi trả chi phí khám chữa bệnh.' },
    { category_id: 3, category_name: 'Bảo hiểm xe cơ giới', description: 'Bảo vệ phương tiện của bạn.' },
    { category_id: 4, category_name: 'Bảo hiểm nhà ở', description: 'Bảo vệ ngôi nhà và tài sản.' },
];

export const insuranceSchemes: InsuranceScheme[] = [
    {
        scheme_id: 1,
        category_id: 1,
        scheme_name: 'An Gia Hạnh Phúc',
        description: 'Bảo hiểm nhân thọ trọn đời với nhiều quyền lợi vượt trội.',
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
        scheme_name: 'Sống Khỏe Mỗi Ngày',
        description: 'Chăm sóc sức khỏe toàn diện cho cả gia đình.',
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
        scheme_name: 'Vững Tâm Tay Lái',
        description: 'Bảo hiểm ô tô/xe máy với dịch vụ cứu hộ 24/7.',
        min_term: 1,
        max_term: 3,
        min_investment_amount: 200,
        max_investment_amount: 5000,
        profit_ratio: 0.0,
        new_launch_date: '2023-03-05',
        is_active: true,
    },
    {
        scheme_id: 4,
        category_id: 4,
        scheme_name: 'Tổ Ấm An Bình',
        description: 'Bảo vệ toàn diện cho ngôi nhà và tài sản bên trong.',
        min_term: 1,
        max_term: 10,
        min_investment_amount: 300,
        max_investment_amount: 20000,
        profit_ratio: 0.0,
        new_launch_date: '2023-05-12',
        is_active: true,
    }
];

// --- Financials ---
// --- Financials ---
// --- Financials ---
export const fakePolicies: Policy[] = [
    // 1. LIFE: Standard Active Policy
    {
        policy_id: 1,
        user_id: 2,
        scheme_id: 1,
        policy_number: 'POL-LIFE-001',
        insured_name: 'Nguyễn Văn A',
        type: 'Life',
        start_date: '2023-01-01',
        maturity_date: '2043-01-01',
        term_years: 20,
        payment_frequency: 'Monthly',
        sum_assured: 100000,
        premium_amount: 150,
        policy_status: 'Active',
        created_at: '2022-12-25T08:00:00Z',
        details: {
            main_benefit: {
                coverage_scope: 'Death or Total Permanent Disability',
                end_age: 99,
                sum_assured: 100000
            },
            beneficiaries: [
                { name: 'Nguyễn Thị B (Vợ)', relation: 'Wife', percentage: 60 },
                { name: 'Nguyễn Văn C (Con)', relation: 'Child', percentage: 40 }
            ],
            cash_value: {
                current_balance: 5000,
                surrender_value: 3500
            },
            riders: [
                { name: 'Accident Guard', type: 'Accident', sum_assured: 50000, premium: 20, description: 'Double payout for public transport' },
                { name: 'Critical Illness Protection', type: 'CriticalIllness', sum_assured: 30000, premium: 30, description: 'Covers 134 critical illnesses' },
                { name: 'Waiver of Premium', type: 'Waiver', sum_assured: 0, premium: 10, description: 'Premiums waived upon diagnosis', is_waiver_active: false }
            ],
            premium_history: [
                { year: 2023, status: 'Paid' },
                { year: 2024, status: 'Paid' }
            ]
        }
    },
    // 2. LIFE: Matured Policy (Ended, Ready for Payout)
    {
        policy_id: 2,
        user_id: 2,
        scheme_id: 1,
        policy_number: 'POL-LIFE-002',
        insured_name: 'Nguyễn Văn A',
        type: 'Life',
        start_date: '2014-01-01',
        maturity_date: '2024-01-01',
        term_years: 10,
        payment_frequency: 'Yearly',
        sum_assured: 50000,
        premium_amount: 4800,
        policy_status: 'Matured',
        created_at: '2013-12-20T09:00:00Z',
        details: {
            main_benefit: {
                coverage_scope: 'Education Fund Builder',
                end_age: 25,
                sum_assured: 50000
            },
            beneficiaries: [{ name: 'Nguyễn Thị B', relation: 'Wife', percentage: 100 }],
            cash_value: { current_balance: 55000, surrender_value: 55000 },
            riders: [],
            premium_history: Array.from({ length: 10 }, (_, i) => ({ year: 2014 + i, status: 'Paid' }))
        }
    },
    // 3. LIFE: Lapsed Policy (Missed Payments)
    {
        policy_id: 3,
        user_id: 2,
        scheme_id: 1,
        policy_number: 'POL-LIFE-003',
        insured_name: 'Nguyễn Văn A',
        type: 'Life',
        start_date: '2022-06-01',
        maturity_date: '2032-06-01',
        term_years: 10,
        payment_frequency: 'Quarterly',
        sum_assured: 200000,
        premium_amount: 1200,
        policy_status: 'Lapsed',
        created_at: '2022-05-20T10:00:00Z',
        details: {
            main_benefit: {
                coverage_scope: 'Term Life Protection',
                end_age: 70,
                sum_assured: 200000
            },
            beneficiaries: [{ name: 'Nguyễn Văn C', relation: 'Child', percentage: 100 }],
            cash_value: { current_balance: 2000, surrender_value: 500 },
            riders: [],
            premium_history: [
                { year: 2022, status: 'Paid' },
                { year: 2023, status: 'Due' }
            ]
        }
    },
    // 4. HEALTH: Active (Low Usage)
    {
        policy_id: 4,
        user_id: 2,
        scheme_id: 2,
        policy_number: 'POL-HEALTH-001',
        insured_name: 'Bao Tram',
        type: 'Health',
        start_date: '2024-01-01',
        maturity_date: '2025-01-01',
        term_years: 1,
        payment_frequency: 'Yearly',
        sum_assured: 200000,
        premium_amount: 800,
        policy_status: 'Active',
        created_at: '2023-12-28T11:00:00Z',
        details: {
            main_benefit: {
                total_limit_per_year: 200000000,
                room_board_limit: 2000000,
                surgery_limit: 40000000,
                used_amount: 0
            },
            supplementary_benefits: [
                { name: 'General Outpatient', type: 'Outpatient', limit_per_year: 10000000, used_amount: 500000 },
                { name: 'Dental Care', type: 'Dental', limit_per_year: 2000000, used_amount: 0, waiting_period_end_date: '2024-03-01' }
            ],
            hospital_network_tier: 'Gold',
            is_family_floater: false,
            e_card_image: 'https://via.placeholder.com/300x200?text=Health+Card+Gold'
        }
    },
    // 5. HEALTH: Active (High Usage - Near Limit)
    {
        policy_id: 5,
        user_id: 2,
        scheme_id: 2,
        policy_number: 'POL-HEALTH-002',
        insured_name: 'Bao Tram (Mother)',
        type: 'Health',
        start_date: '2023-06-15',
        maturity_date: '2024-06-15',
        term_years: 1,
        payment_frequency: 'Yearly',
        sum_assured: 150000,
        premium_amount: 1100,
        policy_status: 'Active',
        created_at: '2023-06-10T14:00:00Z',
        details: {
            main_benefit: {
                total_limit_per_year: 500000000,
                room_board_limit: 5000000,
                surgery_limit: 100000000,
                used_amount: 450000000 // High usage
            },
            supplementary_benefits: [
                { name: 'General Outpatient', type: 'Outpatient', limit_per_year: 15000000, used_amount: 12000000 },
                { name: 'Maternity', type: 'Maternity', limit_per_year: 30000000, used_amount: 0, waiting_period_end_date: '2024-03-15' }
            ],
            hospital_network_tier: 'Diamond',
            is_family_floater: true
        }
    },
    // 6. MOTOR: Car (Active)
    {
        policy_id: 6,
        user_id: 2,
        scheme_id: 3,
        policy_number: 'POL-CAR-001',
        insured_name: 'Bao Tram',
        type: 'Motor',
        start_date: '2024-02-01',
        maturity_date: '2025-02-01',
        term_years: 1,
        payment_frequency: 'Yearly',
        sum_assured: 800000, // Car value
        premium_amount: 1500,
        policy_status: 'Active',
        created_at: '2024-01-25T09:00:00Z',
        details: {
            tnds_compulsory: {
                is_active: true,
                limit_per_person: 150000000,
                limit_property: 100000000,
                qr_code_url: 'https://via.placeholder.com/150?text=TNDS+QR'
            },
            voluntary_coverage: {
                is_active: true,
                vehicle_value: 1200000000, // 1.2 Billion
                deductible_amount: 1000000,
                riders: ['Hydrostatic', 'PartsTheft', 'GenuineGarage', 'PassengerAccident']
            },
            vehicle_info: {
                type: 'Car',
                brand_model: 'Mercedes C300 2023',
                license_plate: '51H-999.99',
                chassis_number: 'WDB-12345678',
                engine_number: 'M274-999999'
            },
            rescue_hotline: '1900-8888'
        }
    },
    // 7. MOTOR: Bike (Active, TNDS only)
    {
        policy_id: 7,
        user_id: 2,
        scheme_id: 3,
        policy_number: 'POL-BIKE-001',
        insured_name: 'Bao Tram',
        type: 'Motor',
        start_date: '2023-05-10',
        maturity_date: '2025-05-10', // 2 years
        term_years: 2,
        payment_frequency: 'OneTime',
        sum_assured: 0, // TNDS usually has fixed liability, car value irrelevant
        premium_amount: 20, // Cheap
        policy_status: 'Active',
        created_at: '2023-05-05T10:00:00Z',
        details: {
            tnds_compulsory: {
                is_active: true,
                limit_per_person: 150000000,
                limit_property: 50000000,
                qr_code_url: 'https://via.placeholder.com/150?text=Bike+TNDS'
            },
            // No voluntary coverage for this bike
            vehicle_info: {
                type: 'Bike',
                brand_model: 'Honda Vision',
                license_plate: '59-B1 123.45',
                chassis_number: 'RLH-11122233',
                engine_number: 'JFE-44455566'
            }
        }
    },
    // 8. HOME: Apartment (Pending)
    {
        policy_id: 8,
        user_id: 2,
        scheme_id: 4,
        policy_number: 'POL-HOME-001',
        insured_name: 'Bao Tram',
        type: 'Home',
        start_date: '2024-03-01',
        maturity_date: '2025-03-01',
        term_years: 1,
        payment_frequency: 'Yearly',
        sum_assured: 150000,
        premium_amount: 300,
        policy_status: 'Pending', // Waiting for inspection
        created_at: '2024-02-20T16:00:00Z',
        details: {
            main_benefit: {
                property_address: 'Room 1204, Happy Valley, D7, HCMC',
                property_type: 'Apartment',
                structure_value: 3000000000,
                coverage_risks: ['Fire', 'Explosion']
            },
            supplementary_benefits: {
                contents_value: 500000000,
                liability_limit: 50000000,
                rental_support_limit: 10000000
            },
            asset_photos_urls: [
                'https://via.placeholder.com/150?text=Living+Room',
                'https://via.placeholder.com/150?text=Kitchen'
            ]
        }
    },
    // 9. HOME: Villa (Active)
    {
        policy_id: 9,
        user_id: 2,
        scheme_id: 4,
        policy_number: 'POL-HOME-002',
        insured_name: 'Bao Tram',
        type: 'Home',
        start_date: '2023-08-01',
        maturity_date: '2026-08-01',
        term_years: 3,
        payment_frequency: 'Yearly',
        sum_assured: 500000,
        premium_amount: 1200,
        policy_status: 'Active',
        created_at: '2023-07-25T13:00:00Z',
        details: {
            main_benefit: {
                property_address: '15 Thao Dien, D2, HCMC',
                property_type: 'Villa',
                structure_value: 15000000000,
                coverage_risks: ['Fire', 'Flood', 'Theft', 'Lightning']
            },
            supplementary_benefits: {
                contents_value: 2000000000,
                liability_limit: 200000000,
                rental_support_limit: 50000000
            }
        }
    }
];

export const fakeClaims: Claim[] = [
    {
        claim_id: 1,
        policy_id: 5, // Health High Usage
        user_id: 2,
        claim_date: '2023-11-20',
        claim_amount: 2500,
        reason: 'Inpatient Surgery - Appendicitis',
        status: 'Approved',
        admin_comment: 'Verified medical bills and discharge summary.',
    },
    {
        claim_id: 2,
        policy_id: 6, // Car
        user_id: 2,
        claim_date: '2024-02-10',
        claim_amount: 800,
        reason: 'Minor collision - Bumper repair',
        status: 'Under Review',
        admin_comment: null,
    }
];

export const fakePayments: PremiumPayment[] = [
    // Policy 1: Monthly Life (Active)
    { payment_id: 1, policy_id: 1, user_id: 2, amount_paid: 150, payment_date: '2023-01-01', payment_method: 'Credit Card', transaction_reference: 'TXN-L1-01', status: 'Success' },
    { payment_id: 2, policy_id: 1, user_id: 2, amount_paid: 150, payment_date: '2023-02-01', payment_method: 'Credit Card', transaction_reference: 'TXN-L1-02', status: 'Success' },
    { payment_id: 3, policy_id: 1, user_id: 2, amount_paid: 150, payment_date: '2023-03-01', payment_method: 'Credit Card', transaction_reference: 'TXN-L1-03', status: 'Success' },
    // ... skipped some for brevity
    { payment_id: 4, policy_id: 1, user_id: 2, amount_paid: 150, payment_date: '2024-01-01', payment_method: 'Credit Card', transaction_reference: 'TXN-L1-13', status: 'Success' },

    // Policy 3: Lapsed Life (Quarterly 1200) - Paid initially then stopped
    { payment_id: 5, policy_id: 3, user_id: 2, amount_paid: 1200, payment_date: '2022-06-01', payment_method: 'Bank Transfer', transaction_reference: 'TXN-L3-01', status: 'Success' },
    { payment_id: 6, policy_id: 3, user_id: 2, amount_paid: 1200, payment_date: '2022-09-01', payment_method: 'Bank Transfer', transaction_reference: 'TXN-L3-02', status: 'Success' },
    // Missed Dec 2022 onwards

    // Policy 4: Health Basic (Yearly 800)
    { payment_id: 7, policy_id: 4, user_id: 2, amount_paid: 800, payment_date: '2023-12-28', payment_method: 'E-Wallet', transaction_reference: 'TXN-H1-01', status: 'Success' },

    // Policy 6: Car (Yearly 1500)
    { payment_id: 8, policy_id: 6, user_id: 2, amount_paid: 1500, payment_date: '2024-01-25', payment_method: 'Credit Card', transaction_reference: 'TXN-C1-01', status: 'Success' },

    // Policy 9: Home Villa (Yearly 1200)
    { payment_id: 9, policy_id: 9, user_id: 2, amount_paid: 1200, payment_date: '2023-07-25', payment_method: 'Bank Transfer', transaction_reference: 'TXN-HM1-01', status: 'Success' }
];

export const fakeLoans: PolicyLoan[] = [
    {
        loan_id: 1,
        policy_id: 1, // Life Active
        user_id: 2,
        loan_amount: 2000,
        interest_rate: 4.5,
        application_date: '2023-11-15',
        approval_date: '2023-11-18',
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
    category: insuranceCategories.find(c => c.categoryId === s.category_id)?.categoryName || 'General',
    price: s.min_investment_amount || 0,
    stock: 100,
    imageUrl: '',
    createdAt: s.new_launch_date || '',
    ...s
}));

export const categories = insuranceCategories.map(c => c.categoryName);

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
