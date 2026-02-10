import React, { useState, useEffect } from 'react';
// import { insuranceCategories } from '../../data/fakeData';
import type { InsuranceScheme, InsuranceCategory } from '../../types';

interface SchemeFormProps {
    scheme: InsuranceScheme | null;
    categories: InsuranceCategory[];
    onSubmit: (schemeData: Partial<InsuranceScheme>) => void;
    onCancel: () => void;
}

const SchemeForm: React.FC<SchemeFormProps> = ({ scheme, categories, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<InsuranceScheme>>({
        scheme_name: '',
        category_id: categories[0]?.category_id || 0,
        description: '',
        min_term: 1,
        max_term: 20,
        min_investment_amount: 1000,
        max_investment_amount: 100000,
        profit_ratio: 5,
        new_launch_date: new Date().toISOString().split('T')[0],
        is_active: true,
    });

    useEffect(() => {
        if (scheme) {
            setFormData({
                ...scheme,
                new_launch_date: scheme.new_launch_date ? new Date(scheme.new_launch_date).toISOString().split('T')[0] : '',
            });
        }
    }, [scheme]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let finalValue: any = value;
        if (type === 'number') finalValue = value === '' ? 0 : parseFloat(value);
        if (name === 'category_id') finalValue = value === '' ? 0 : parseInt(value);
        if (name === 'is_active') finalValue = value === 'true';

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Scheme Name *</label>
                    <input
                        type="text"
                        name="scheme_name"
                        className="input"
                        value={formData.scheme_name || ''}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Premium Health Shield"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Category *</label>
                    <select
                        name="category_id"
                        className="select"
                        value={formData.category_id || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Status</label>
                    <select
                        name="is_active"
                        className="select"
                        value={formData.is_active ? 'true' : 'false'}
                        onChange={handleChange}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Min Term (Years)</label>
                    <input
                        type="number"
                        name="min_term"
                        className="input"
                        value={formData.min_term ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Max Term (Years)</label>
                    <input
                        type="number"
                        name="max_term"
                        className="input"
                        value={formData.max_term ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Min Investment ($)</label>
                    <input
                        type="number"
                        name="min_investment_amount"
                        className="input"
                        value={formData.min_investment_amount ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Max Investment ($)</label>
                    <input
                        type="number"
                        name="max_investment_amount"
                        className="input"
                        value={formData.max_investment_amount ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Profit Ratio (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="profit_ratio"
                        className="input"
                        value={formData.profit_ratio ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Launch Date</label>
                    <input
                        type="date"
                        name="new_launch_date"
                        className="input"
                        value={formData.new_launch_date || ''}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Description</label>
                    <textarea
                        name="description"
                        className="input"
                        style={{ height: '80px', resize: 'none' }}
                        value={formData.description || ''}
                        onChange={handleChange}
                        placeholder="Detail the scheme benefits..."
                    />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                    {scheme ? 'Update Scheme' : 'Create Scheme'}
                </button>
            </div>
        </form>
    );
};

export default SchemeForm;
