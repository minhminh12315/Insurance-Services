import React, { useState, useEffect } from 'react';
import type { InsuranceCategoryModel } from '../../services/insuranceApi';

interface CategoryFormProps {
    category: InsuranceCategoryModel | null;
    onSubmit: (categoryData: Partial<InsuranceCategoryModel>) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<InsuranceCategoryModel>>({
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
            <div className="mb-6">
                <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Category Name *</label>
                <input
                    type="text"
                    name="categoryName"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.categoryName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Health Insurance"
                />
            </div>
            <div className="mb-8">
                <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Description</label>
                <textarea
                    name="description"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white h-[120px] resize-none"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Briefly describe what this category covers..."
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                <button type="button" className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium shadow-sm order-2 sm:order-1" onClick={onCancel}>Cancel</button>
                <button type="submit" className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm order-1 sm:order-2">
                    {category ? 'Update Category' : 'Create Category'}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;
