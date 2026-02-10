import { useState, useEffect } from 'react';
import { insuranceSchemes, insuranceCategories } from '../../data/fakeData';
// import api from '../../services/api';
import type { InsuranceScheme, InsuranceCategory } from '../../types';
import SchemeForm from './SchemeForm';

const SchemeList = () => {
    const [schemes, setSchemes] = useState<InsuranceScheme[]>(insuranceSchemes);
    const [categories, setCategories] = useState<InsuranceCategory[]>(insuranceCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editingScheme, setEditingScheme] = useState<InsuranceScheme | null>(null);
    const [loading, setLoading] = useState(false);

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
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading schemes...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Insurance Schemes</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Configure and monitor specific insurance products and their terms</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingScheme(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    New Scheme
                </button>
            </div>

            <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search schemes..."
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
                            {categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-card table-container" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ background: '#f8fafc' }}>Scheme Name</th>
                            <th style={{ background: '#f8fafc' }}>Category</th>
                            <th style={{ background: '#f8fafc' }}>Terms</th>
                            <th style={{ background: '#f8fafc' }}>Min Investment</th>
                            <th style={{ background: '#f8fafc' }}>Profit Ratio</th>
                            <th style={{ background: '#f8fafc' }}>Status</th>
                            <th style={{ textAlign: 'right', background: '#f8fafc' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSchemes.map((scheme) => (
                            <tr key={scheme.scheme_id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#334155' }}>{scheme.scheme_name}</p>
                                            <p style={{ color: '#94a3b8', fontSize: '12px' }}>ID: SCH-{scheme.scheme_id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td><span style={{ color: '#64748b', fontWeight: 500 }}>{getCategoryName(scheme.category_id)}</span></td>
                                <td><span style={{ color: '#64748b' }}>{scheme.min_term} - {scheme.max_term} Years</span></td>
                                <td style={{ fontWeight: 600, color: '#1e293b' }}>${scheme.min_investment_amount?.toLocaleString()}</td>
                                <td style={{ fontWeight: 600, color: 'var(--success)' }}>{scheme.profit_ratio}%</td>
                                <td>
                                    <span className={`badge ${scheme.is_active ? 'badge-success' : 'badge-danger'}`}>
                                        {scheme.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingScheme(scheme); setShowModal(true); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" style={{ padding: '6px' }} onClick={() => handleDelete(scheme.scheme_id)}>
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
                    <div className="modal-content glass-card" style={{ width: '700px', background: '#fff', padding: '32px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>
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
