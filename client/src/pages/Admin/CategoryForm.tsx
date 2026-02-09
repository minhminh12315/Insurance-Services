import React, { useState, useEffect } from 'react';
import type { InsuranceCategory } from '../../types';

interface CategoryFormProps {
    category: InsuranceCategory | null;
    onSubmit: (categoryData: Partial<InsuranceCategory>) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<InsuranceCategory>>({
        categoryName: '',
        description: '',
    });

    useEffect(() => {
        if (category) {
            setFormData({ ...category });
        }
    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Category Name *</label>
                <input
                    type="text"
                    name="categoryName"
                    className="input"
                    value={formData.categoryName || ''}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Health Insurance"
                />
            </div>
            <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Description</label>
                <textarea
                    name="description"
                    className="input"
                    style={{ height: '120px', resize: 'none' }}
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Briefly describe what this category covers..."
                />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                    {category ? 'Update Category' : 'Create Category'}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;
