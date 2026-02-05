import { useState, useEffect } from 'react';
import { insuranceCategories } from '../../data/fakeData';
// import api from '../../services/api';
import type { InsuranceCategory } from '../../types';
import CategoryForm from './CategoryForm';

const CategoryList = () => {
    const [categories, setCategories] = useState<InsuranceCategory[]>(insuranceCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<InsuranceCategory | null>(null);
    const [loading, setLoading] = useState(false);

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
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading categories...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Insurance Categories</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Organize and manage the different types of insurance products</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingCategory(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="input"
                        style={{ paddingLeft: '44px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-card table-container" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: '300px', background: '#f8fafc' }}>Category Name</th>
                            <th style={{ background: '#f8fafc' }}>Description</th>
                            <th style={{ textAlign: 'right', background: '#f8fafc' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((category) => (
                            <tr key={category.category_id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                        </div>
                                        <span style={{ fontWeight: 600, color: '#334155' }}>{category.category_name}</span>
                                    </div>
                                </td>
                                <td style={{ color: '#64748b', fontSize: '14px' }}>{category.description || 'No description provided.'}</td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingCategory(category); setShowModal(true); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" style={{ padding: '6px' }} onClick={() => handleDelete(category.category_id)}>
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
                    <div className="modal-content glass-card" style={{ width: '500px', background: '#fff', padding: '32px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>
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
