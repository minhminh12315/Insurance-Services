import { useState } from 'react';
import { insuranceSchemes, insuranceCategories } from '../../data/fakeData';
// import api from '../../services/api';
import type { InsuranceScheme, InsuranceCategory } from '../../types';
import SchemeForm from './SchemeForm';

const SchemeList = () => {
    const [schemes, setSchemes] = useState<InsuranceScheme[]>(insuranceSchemes);
    const [categories] = useState<InsuranceCategory[]>(insuranceCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editingScheme, setEditingScheme] = useState<InsuranceScheme | null>(null);
    const [loading] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [schemesRes, categoriesRes] = await Promise.all([
    //                 api.get('/schemes'),
    //                 api.get('/categories')
    //             ]);
    //             setSchemes(schemesRes.data);
    //             setCategories(categoriesRes.data);
    //         } catch (error) {
    //             console.error('Failed to fetch data:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const filteredSchemes = schemes.filter((s) => {
        const matchesSearch = s.scheme_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || s.category_id === parseInt(categoryFilter);
        return matchesSearch && matchesCategory;
    });

    const getCategoryName = (id: number | null) => {
        return categories.find(c => c.category_id === id)?.category_name || 'Uncategorized';
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this insurance scheme?')) {
            setSchemes(schemes.filter(s => s.scheme_id !== id));
        }
    };

    const handleFormSubmit = (schemeData: Partial<InsuranceScheme>) => {
        if (editingScheme) {
            // Update
            setSchemes(schemes.map(s => s.scheme_id === editingScheme.scheme_id ? { ...s, ...schemeData } as InsuranceScheme : s));
        } else {
            // Create
            const newScheme = {
                ...schemeData,
                scheme_id: schemes.length > 0 ? Math.max(...schemes.map(s => s.scheme_id)) + 1 : 1,
                is_active: schemeData.is_active ?? true // default to true if not set
            } as InsuranceScheme;
            setSchemes([...schemes, newScheme]);
        }
        setShowModal(false);
    };

    if (loading) {
        return <div className="p-5 text-center">Loading schemes...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Insurance Schemes</h1>
                    <p className="text-slate-500 text-[15px]">Configure and monitor specific insurance products and their terms</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingScheme(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    New Scheme
                </button>
            </div>

            <div className="glass-card p-5 mb-6 bg-white border border-slate-200">
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[300px] relative">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search schemes..."
                            className="input pl-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-[220px]">
                        <select
                            className="select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-card table-container bg-white border border-slate-200">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="bg-slate-50">Scheme Name</th>
                            <th className="bg-slate-50">Category</th>
                            <th className="bg-slate-50">Terms</th>
                            <th className="bg-slate-50">Min Investment</th>
                            <th className="bg-slate-50">Profit Ratio</th>
                            <th className="bg-slate-50">Status</th>
                            <th className="text-right bg-slate-50">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSchemes.map((scheme) => (
                            <tr key={scheme.scheme_id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700">{scheme.scheme_name}</p>
                                            <p className="text-slate-400 text-xs">ID: SCH-{scheme.scheme_id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="text-slate-500 font-medium">{getCategoryName(scheme.category_id)}</span></td>
                                <td><span className="text-slate-500">{scheme.min_term} - {scheme.max_term} Years</span></td>
                                <td className="font-semibold text-slate-800">${scheme.min_investment_amount?.toLocaleString()}</td>
                                <td className="font-semibold text-emerald-600">{scheme.profit_ratio}%</td>
                                <td>
                                    <span className={`badge ${scheme.is_active ? 'badge-success' : 'badge-danger'}`}>
                                        {scheme.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex justify-end gap-2">
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingScheme(scheme); setShowModal(true); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm p-1.5" onClick={() => handleDelete(scheme.scheme_id)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content glass-card w-[700px] bg-white p-8" onClick={e => e.stopPropagation()}>
                        <h2 className="text-[22px] font-extrabold text-slate-800 mb-6">
                            {editingScheme ? 'Edit Insurance Scheme' : 'Launch New Scheme'}
                        </h2>
                        <SchemeForm
                            scheme={editingScheme}
                            categories={categories}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchemeList;
