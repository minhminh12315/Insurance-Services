import React, { useState, useEffect } from 'react';
import type { InsuranceCategory } from '../../types';

interface CategoryFormProps {
    category: InsuranceCategory | null;
    onSubmit: (categoryData: Partial<InsuranceCategory>) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<InsuranceCategory>>({
        category_name: '',
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
            <div className="mb-6">
                <label className="block mb-2 text-[13px] font-semibold text-slate-500">Category Name *</label>
                <input
                    type="text"
                    name="category_name"
                    className="input"
                    value={formData.category_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Health Insurance"
                />
            </div>
            <div className="mb-8">
                <label className="block mb-2 text-[13px] font-semibold text-slate-500">Description</label>
                <textarea
                    name="description"
                    className="input h-[120px] resize-none"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Briefly describe what this category covers..."
                />
            </div>
            <div className="flex gap-3 justify-end">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                    {category ? 'Update Category' : 'Create Category'}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;
