import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fakeProducts as initialProducts, categories } from '../../data/fakeData';
import type { Product } from '../../types';
import ProductForm from './ProductForm';

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
        const newProduct: Product = {
            ...productData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split('T')[0],
        };
        setProducts([newProduct, ...products]);
        setShowModal(false);
    };

    const handleEditProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
        if (!editingProduct) return;
        const updatedProducts = products.map((p) =>
            p.id === editingProduct.id ? { ...p, ...productData } : p
        );
        setProducts(updatedProducts);
        setEditingProduct(null);
        setShowModal(false);
    };

    const handleDeleteProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id));
        setDeleteConfirm(null);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const getStockBadge = (stock: number) => {
        if (stock > 50) return <span className="badge badge-success">High Stock</span>;
        if (stock > 20) return <span className="badge badge-warning">Medium</span>;
        return <span className="badge badge-danger">Low Stock</span>;
    };

    return (
        <div>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Insurance Schemes</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Manage and monitor all active insurance products</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Scheme
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or category..."
                            className="input"
                            style={{ paddingLeft: '44px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ width: '220px' }}>
                        <select
                            className="select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="glass-card table-container" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ background: '#f8fafc' }}>Scheme Name</th>
                            <th style={{ background: '#f8fafc' }}>Category</th>
                            <th style={{ background: '#f8fafc' }}>Min Investment</th>
                            <th style={{ background: '#f8fafc' }}>Profit Ratio</th>
                            <th style={{ background: '#f8fafc' }}>Status</th>
                            <th style={{ textAlign: 'right', background: '#f8fafc' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#334155' }}>{product.name}</p>
                                            <p style={{ color: '#94a3b8', fontSize: '12px' }}>Ref: SCH-{product.id.padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td><span style={{ fontWeight: 500, color: '#64748b' }}>{product.category}</span></td>
                                <td style={{ fontWeight: 600, color: '#1e293b' }}>${(product.price * 10).toLocaleString()}</td>
                                <td style={{ fontWeight: 600, color: 'var(--success)' }}>{(Math.random() * 5 + 4).toFixed(1)}%</td>
                                <td>{getStockBadge(product.stock)}</td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="btn btn-secondary btn-sm"
                                            style={{ textDecoration: 'none', borderRadius: '6px' }}
                                        >
                                            Manage
                                        </Link>
                                        <button className="btn btn-secondary btn-sm" style={{ borderRadius: '6px' }} onClick={() => openEditModal(product)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            style={{ borderRadius: '6px', padding: '6px' }}
                                            onClick={() => setDeleteConfirm(product.id)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div style={{ padding: '64px', textAlign: 'center', color: '#94a3b8' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" style={{ marginBottom: '16px' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <p style={{ fontSize: '16px', fontWeight: 500 }}>No results found</p>
                        <p style={{ fontSize: '14px' }}>Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="modal-content glass-card"
                        style={{ width: '500px', maxWidth: '90vw', padding: '32px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>
                            {editingProduct ? 'Edit Insurance Scheme' : 'Launch New Scheme'}
                        </h2>
                        <ProductForm
                            product={editingProduct}
                            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div
                        className="modal-content glass-card"
                        style={{ width: '400px', maxWidth: '90vw', padding: '40px 32px', textAlign: 'center', background: '#ffffff', borderRadius: '16px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: '#fef2f2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Confirm Deletion</h3>
                        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px', lineHeight: 1.5 }}>
                            Are you sure you want to remove this insurance scheme? This action will affect any existing policies.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>
                                Keep it
                            </button>
                            <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteProduct(deleteConfirm)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
