import React, { useState, useEffect } from 'react';
import { type InsuranceSchemeModel, type InsuranceCategoryModel } from '../../services/insuranceApi';

interface SchemeFormProps {
    scheme: InsuranceSchemeModel | null;
    categories: InsuranceCategoryModel[];
    onSubmit: (schemeData: Partial<InsuranceSchemeModel>) => void;
    onCancel: () => void;
}

const SchemeForm: React.FC<SchemeFormProps> = ({ scheme, categories, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<InsuranceSchemeModel>>({
        schemeName: '',
        categoryId: categories[0]?.categoryId || 0,
        description: '',
        minTerm: 1,
        maxTerm: 20,
        minInvestmentAmount: 1000,
        maxInvestmentAmount: 100000,
        profitRatio: 5,
        isActive: true,
    });

    useEffect(() => {
        if (scheme) {
            setFormData({
                ...scheme,
            });
        }
    }, [scheme]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let finalValue: any = value;
        if (type === 'number') finalValue = value === '' ? 0 : parseFloat(value);
        if (name === 'categoryId') finalValue = value === '' ? 0 : parseInt(value);
        if (name === 'isActive') finalValue = value === 'true';

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="col-span-2">
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Scheme Name *</label>
                    <input
                        type="text"
                        name="schemeName"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.schemeName || ''}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Premium Health Shield"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Category *</label>
                    <select
                        name="categoryId"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.categoryId || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Status</label>
                    <select
                        name="isActive"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.isActive ? 'true' : 'false'}
                        onChange={handleChange}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Min Term (Years)</label>
                    <input
                        type="number"
                        name="minTerm"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.minTerm ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Max Term (Years)</label>
                    <input
                        type="number"
                        name="maxTerm"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.maxTerm ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Min Investment ($)</label>
                    <input
                        type="number"
                        name="minInvestmentAmount"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.minInvestmentAmount ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Max Investment ($)</label>
                    <input
                        type="number"
                        name="maxInvestmentAmount"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.maxInvestmentAmount ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Profit Ratio (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="profitRatio"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.profitRatio ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-span-2">
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Description</label>
                    <textarea
                        name="description"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white h-20 resize-none"
                        value={formData.description || ''}
                        onChange={handleChange}
                        placeholder="Detail the scheme benefits..."
                    />
                </div>
            </div>
            <div className="flex gap-3 justify-end">
                <button type="button" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium shadow-sm" onClick={onCancel}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                    {scheme ? 'Update Scheme' : 'Create Scheme'}
                </button>
            </div>
        </form>
    );
};

export default SchemeForm;
