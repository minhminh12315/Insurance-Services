import { useState } from 'react';
import { insuranceCategories } from '../../data/fakeData';
// import api from '../../services/api';
import type { InsuranceCategory } from '../../types';
import CategoryForm from './CategoryForm';

const CategoryList = () => {
    const [categories, setCategories] = useState<InsuranceCategory[]>(insuranceCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<InsuranceCategory | null>(null);
    const [loading] = useState(false);

    // useEffect(() => {
    //     fetchCategories();
    // }, []);

    // const fetchCategories = async () => {
    //     try {
    //         const response = await api.get('/categories');
    //         setCategories(response.data);
    //     } catch (error) {
    //         console.error('Failed to fetch categories:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const filteredCategories = categories.filter((c) =>
        c.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this category? This might affect existing schemes.')) {
            setCategories(categories.filter(c => c.category_id !== id));
        }
    };

    const handleFormSubmit = (categoryData: Partial<InsuranceCategory>) => {
        if (editingCategory) {
            // Update
            setCategories(categories.map(c => c.category_id === editingCategory.category_id ? { ...c, ...categoryData } as InsuranceCategory : c));
        } else {
            // Create
            const newCategory = {
                ...categoryData,
                category_id: categories.length > 0 ? Math.max(...categories.map(c => c.category_id)) + 1 : 1,
            } as InsuranceCategory;
            setCategories([...categories, newCategory]);
        }
        setShowModal(false);
    };

    if (loading) {
        return <div className="p-5 text-center">Loading categories...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Insurance Categories</h1>
                    <p className="text-slate-500 text-[15px]">Organize and manage the different types of insurance products</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingCategory(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="glass-card p-5 mb-6 bg-white border border-slate-200">
                <div className="flex-1 min-w-[300px] relative">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="input pl-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-card table-container bg-white border border-slate-200">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="w-[300px] bg-slate-50">Category Name</th>
                            <th className="bg-slate-50">Description</th>
                            <th className="text-right bg-slate-50">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((category) => (
                            <tr key={category.category_id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                        </div>
                                        <span className="font-semibold text-slate-700">{category.category_name}</span>
                                    </div>
                                </td>
                                <td className="text-slate-500 text-sm">{category.description || 'No description provided.'}</td>
                                <td>
                                    <div className="flex justify-end gap-2">
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingCategory(category); setShowModal(true); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm p-1.5" onClick={() => handleDelete(category.category_id)}>
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
                    <div className="modal-content glass-card w-[500px] bg-white p-8" onClick={e => e.stopPropagation()}>
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
        </div>
    );
};

export default CategoryList;
