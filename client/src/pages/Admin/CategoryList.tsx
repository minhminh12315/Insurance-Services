import { useState } from 'react';
import { insuranceCategories } from '../../data/fakeData';
import type { InsuranceCategory } from '../../types';
import CategoryForm from './CategoryForm';
import '../../assets/styles/layout.css';
import '../../assets/styles/table.css';
import '../../assets/styles/modal.css';

const CategoryList = () => {
    const [categories, setCategories] = useState<InsuranceCategory[]>(insuranceCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<InsuranceCategory | null>(null);
    const [loading] = useState(false);

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
            setCategories(categories.map(c => c.category_id === editingCategory.category_id ? { ...c, ...categoryData } as InsuranceCategory : c));
        } else {
            const newCategory = {
                ...categoryData,
                category_id: categories.length > 0 ? Math.max(...categories.map(c => c.category_id)) + 1 : 1,
            } as InsuranceCategory;
            setCategories([...categories, newCategory]);
        }
        setShowModal(false);
    };

    if (loading) {
        return <div className="loading-container">Loading categories...</div>;
    }

    return (
        <div>
            <div className="page-header">
                <div className="page-header-content">
                    <h1>Insurance Categories</h1>
                    <p>Organize and manage the different types of insurance products</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingCategory(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="glass-card filter-bar">
                <div className="search-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-card table-container table-card">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: '300px' }}>Category Name</th>
                            <th>Description</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((category) => (
                            <tr key={category.category_id}>
                                <td>
                                    <div className="category-cell">
                                        <div className="category-icon">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                        </div>
                                        <span className="category-name">{category.category_name}</span>
                                    </div>
                                </td>
                                <td className="text-description">{category.description || 'No description provided.'}</td>
                                <td>
                                    <div className="action-cell">
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingCategory(category); setShowModal(true); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(category.category_id)}>
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
                    <div className="modal-dialog modal-sm glass-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                        </div>
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
