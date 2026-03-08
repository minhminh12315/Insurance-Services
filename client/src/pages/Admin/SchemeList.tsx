import { useState, useEffect, useCallback } from 'react';
import { schemeApi, categoryApi, type InsuranceSchemeModel, type InsuranceCategoryModel } from '../../services/insuranceApi';
import SchemeForm from './SchemeForm';
import DeleteConfirm from '../../components/DeleteConfirm';

const SchemeList = () => {
    const [schemes, setSchemes] = useState<InsuranceSchemeModel[]>([]);
    const [categories, setCategories] = useState<InsuranceCategoryModel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editingScheme, setEditingScheme] = useState<InsuranceSchemeModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Deletion and Feedback states
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const fetchInitialData = useCallback(async () => {
        try {
            const cats = await categoryApi.getAllCategories();
            setCategories(cats);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    const fetchSchemes = useCallback(async () => {
        setLoading(true);
        try {
            const catId = categoryFilter ? parseInt(categoryFilter) : undefined;
            const response = await schemeApi.getAdminSchemes(page, pageSize, searchTerm, catId);
            setSchemes(response.items || []);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalCount);
        } catch (error) {
            console.error('Failed to fetch schemes:', error);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, searchTerm, categoryFilter]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSchemes();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [fetchSchemes]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryFilter(e.target.value);
        setPage(1);
    };


    const confirmDelete = async (id: number) => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const success = await schemeApi.deleteScheme(id);
            if (success) {
                setSuccessMessage('Insurance scheme deleted successfully');
                fetchSchemes();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage('Failed to delete scheme. It may have associated policies.');
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete scheme. Please try again.');
        }
    };

    const handleFormSubmit = async (schemeData: Partial<InsuranceSchemeModel>) => {
        try {
            if (editingScheme) {
                await schemeApi.updateScheme(editingScheme.schemeId, schemeData);
            } else {
                await schemeApi.createScheme(schemeData);
            }
            setShowModal(false);
            fetchSchemes();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'An error occurred while saving the scheme.');
        }
    };

    if (loading && schemes.length === 0) {
        return <div className="p-8 text-center text-slate-500">Loading schemes...</div>;
    }

    return (
        <div className="relative">
            {/* Global Notification Banner */}
            <div className="fixed top-24 right-6 z-[110] flex flex-col gap-3 min-w-[320px] max-w-md pointer-events-none">
                {successMessage && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-xl shadow-emerald-500/10 flex items-center gap-3 text-emerald-600 animate-in slide-in-from-right duration-500 pointer-events-auto">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold">{successMessage}</p>
                    </div>
                )}
                {errorMessage && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 shadow-xl shadow-red-500/10 flex items-center gap-3 text-red-600 animate-in slide-in-from-right duration-500 pointer-events-auto">
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold">{errorMessage}</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Insurance Schemes</h1>
                    <p className="text-slate-500 text-[15px]">Configure and monitor specific insurance products and their terms</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm" onClick={() => { setEditingScheme(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    New Scheme
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-6">
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[300px] relative">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search schemes by name or description..."
                            className="w-full px-4 py-2 pl-11 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="w-[220px]">
                        <select
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                            value={categoryFilter}
                            onChange={handleCategoryFilterChange}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-[14px]">
                    <thead>
                        <tr>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Scheme Name</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Category</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Term (Years)</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Min Investment</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Profit Ratio</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Status</th>
                            <th className="text-right bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schemes.map((scheme) => (
                            <tr key={scheme.schemeId} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700">{scheme.schemeName}</p>
                                            <p className="text-slate-400 text-xs font-medium">SCH-{scheme.schemeId.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-50"><span className="text-slate-600 font-medium px-2 py-1 bg-slate-100 rounded-md text-xs">{scheme.categoryName || 'Uncategorized'}</span></td>
                                <td className="p-4 border-b border-slate-50"><span className="text-slate-500 font-medium">{scheme.minTerm} - {scheme.maxTerm}</span></td>
                                <td className="p-4 border-b border-slate-50 font-semibold text-slate-700">${scheme.minInvestmentAmount?.toLocaleString()}</td>
                                <td className="p-4 border-b border-slate-50 font-bold text-emerald-600">+{scheme.profitRatio}%</td>
                                <td className="p-4 border-b border-slate-50">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${scheme.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                        {scheme.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex justify-end gap-2">
                                        <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-semibold border border-slate-200" onClick={() => { setEditingScheme(scheme); setShowModal(true); }}>Edit</button>
                                        <DeleteConfirm
                                            onConfirm={() => confirmDelete(scheme.schemeId)}
                                            title="Delete Scheme?"
                                            message="Are you sure? This will affect existing policies."
                                        >
                                            <button className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </DeleteConfirm>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {schemes.length === 0 && !loading && (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                                    No insurance schemes found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-sm text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-700">{totalItems === 0 ? 0 : (page - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-bold text-slate-700">{Math.min(page * pageSize, totalItems)}</span> of{' '}
                    <span className="font-bold text-slate-700">{totalItems}</span> schemes
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-1.5">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${page === i + 1
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 border border-blue-600'
                                    : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading || totalPages === 0}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        Next
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[22px] font-extrabold text-slate-800">
                                {editingScheme ? 'Edit Insurance Scheme' : 'Launch New Scheme'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
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
