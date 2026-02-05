import React, { useState, useEffect } from 'react';
// import { fakeUsers, insuranceSchemes } from '../../data/fakeData';
import type { Policy, PolicyStatus, PaymentFrequency, User, InsuranceScheme } from '../../types';

interface PolicyFormProps {
    policy: Policy | null;
    users: User[];
    schemes: InsuranceScheme[];
    onSubmit: (policyData: Partial<Policy>) => void;
    onCancel: () => void;
}

const PolicyForm: React.FC<PolicyFormProps> = ({ policy, users, schemes, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Policy>>({
        user_id: users[0]?.user_id || 0,
        scheme_id: schemes[0]?.scheme_id || 0,
        policy_number: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        start_date: new Date().toISOString().split('T')[0],
        maturity_date: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0],
        term_years: 10,
        payment_frequency: 'Monthly',
        sum_assured: 100000,
        premium_amount: 100,
        policy_status: 'Pending',
    });

    useEffect(() => {
        if (policy) {
            setFormData({
                ...policy,
                start_date: policy.start_date ? new Date(policy.start_date).toISOString().split('T')[0] : '',
                maturity_date: policy.maturity_date ? new Date(policy.maturity_date).toISOString().split('T')[0] : '',
            });
        }
    }, [policy]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let finalValue: any = value;
        if (type === 'number') finalValue = value === '' ? 0 : parseFloat(value);
        if (name === 'user_id' || name === 'scheme_id' || name === 'term_years') finalValue = value === '' ? 0 : parseInt(value);

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Policy Number *</label>
                    <input
                        type="text"
                        name="policy_number"
                        className="input"
                        value={formData.policy_number || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Status</label>
                    <select
                        name="policy_status"
                        className="select"
                        value={formData.policy_status}
                        onChange={handleChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Lapsed">Lapsed</option>
                        <option value="Claimed">Claimed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Customer *</label>
                    <select
                        name="user_id"
                        className="select"
                        value={formData.user_id || ''}
                        onChange={handleChange}
                        required
                    >
                        {users.map(user => (
                            <option key={user.user_id} value={user.user_id}>{user.full_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Insurance Scheme *</label>
                    <select
                        name="scheme_id"
                        className="select"
                        value={formData.scheme_id || ''}
                        onChange={handleChange}
                        required
                    >
                        {schemes.map(scheme => (
                            <option key={scheme.scheme_id} value={scheme.scheme_id}>{scheme.scheme_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Sum Assured ($)</label>
                    <input
                        type="number"
                        name="sum_assured"
                        className="input"
                        value={formData.sum_assured ?? ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Premium Amount ($)</label>
                    <input
                        type="number"
                        name="premium_amount"
                        className="input"
                        value={formData.premium_amount ?? ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Payment Frequency</label>
                    <select
                        name="payment_frequency"
                        className="select"
                        value={formData.payment_frequency}
                        onChange={handleChange}
                    >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="OneTime">One-Time</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Term (Years)</label>
                    <input
                        type="number"
                        name="term_years"
                        className="input"
                        value={formData.term_years ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Start Date</label>
                    <input
                        type="date"
                        name="start_date"
                        className="input"
                        value={formData.start_date || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Maturity Date</label>
                    <input
                        type="date"
                        name="maturity_date"
                        className="input"
                        value={formData.maturity_date || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                    {policy ? 'Update Policy' : 'Issue Policy'}
                </button>
            </div>
        </form>
    );
};

export default PolicyForm;
