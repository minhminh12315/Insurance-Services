import { useState, useEffect, useCallback } from 'react';
import { categoryApi, type InsuranceCategoryModel } from '../../services/insuranceApi';
// import { insuranceCategories } from '../../data/fakeData';
// import api from '../../services/api';
import CategoryForm from './CategoryForm';
import ConfirmationModal from '../../components/ConfirmationModal';

const CategoryList = () => {
    const [categories, setCategories] = useState<InsuranceCategoryModel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<InsuranceCategoryModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Deletion states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            console.log('Fetching categories...');
            const response = await categoryApi.getAdminCategories(page, pageSize, searchTerm);
            setCategories(response.items || []);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalCount);
            console.log('Categories:', response);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, searchTerm]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCategories();
        }, 300); // Simple debounce for search

        return () => clearTimeout(timeoutId);
    }, [fetchCategories]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on new search
    };

    const handleDeleteClick = (id: number) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;

        setIsDeleting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const success = await categoryApi.deleteCategory(deletingId);
            if (success) {
                setSuccessMessage('Category deleted successfully');
                fetchCategories();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage('Failed to delete category. It may have associated schemes.');
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete category. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeletingId(null);
        }
    };

    const handleFormSubmit = (categoryData: Partial<InsuranceCategoryModel>) => {
        // In a real app, you would call the create/update API here
        console.log('Submitting category:', categoryData);
        // After success, close modal and refetch
        setShowModal(false);
        fetchCategories();
    };

    if (loading) {
        return <div className="p-5 text-center">Loading categories...</div>;
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
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Insurance Categories</h1>
                    <p className="text-slate-500 text-[15px]">Organize and manage the different types of insurance products</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm text-center" onClick={() => { setEditingCategory(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-6">
                <div className="flex-1 min-w-[300px] relative">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full px-4 py-2 pl-11 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-[14px]">
                    <thead>
                        <tr>
                            <th className="w-[300px] bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Category Name</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Description</th>
                            <th className="text-right bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.categoryId}>
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                        </div>
                                        <span className="font-semibold text-slate-700">{category.categoryName}</span>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-50 text-slate-500 text-sm">{category.description || 'No description provided.'}</td>
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex justify-end gap-2">
                                        <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium" onClick={() => { setEditingCategory(category); setShowModal(true); }}>Edit</button>
                                        <button className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" onClick={() => handleDeleteClick(category.categoryId)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && !loading && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-slate-400">
                                    No categories found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-sm text-slate-500">
                    Showing <span className="font-medium text-slate-700">{totalItems === 0 ? 0 : (page - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-medium text-slate-700">{Math.min(page * pageSize, totalItems)}</span> of{' '}
                    <span className="font-medium text-slate-700">{totalItems}</span> categories
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${page === i + 1
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading || totalPages === 0}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-xl w-[500px] p-8" onClick={e => e.stopPropagation()}>
                        <h2 className="text-[22px] font-extrabold text-slate-800 mb-6">
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <CategoryForm
                            category={editingCategory}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Category"
                message="Are you sure you want to delete this category? This will affect all associated insurance schemes. This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmLabel={isDeleting ? "Deleting..." : "Delete"}
                isDanger={true}
            />
        </div>
    );
};

export default CategoryList;
