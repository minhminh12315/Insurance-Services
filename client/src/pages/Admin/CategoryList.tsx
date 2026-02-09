import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { InsuranceCategory } from '../../types';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import DeleteButton from '../../components/common/DeleteButton';
import '../../assets/styles/layout.css';
import '../../assets/styles/table.css';
import '../../assets/styles/modal.css';
import axios from 'axios';

const CategoryList = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [categories, setCategories] = useState<InsuranceCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async (id: number) => {
        await axios.delete(`${apiURL}/api/InsuranceCategories/${id}`);
        fetchCategories();
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiURL}/api/InsuranceCategories`, {
                params: {
                    page,
                    pageSize,
                    search: searchTerm
                }
            });
            // Expecting PagedResult: { items, totalCount, pageNumber, pageSize, totalPages }
            if (response.data && Array.isArray(response.data.items)) {
                setCategories(response.data.items);
                setTotalPages(response.data.totalPages);
            } else {
                // Fallback if API hasn't updated or returns different structure
                console.warn('Unexpected API response structure', response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (page !== 1) {
                setPage(1);
            } else {
                fetchCategories();
            }
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading && categories.length === 0) {
        return <div className="loading-container">Loading categories...</div>;
    }

    return (
        <div>
            <div className="page-header">
                <div className="page-header-content">
                    <h1>Insurance Categories</h1>
                    <p>Organize and manage the different types of insurance products</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/categories/new')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Add Category
                </button>
            </div>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search categories..."
            />

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
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.categoryId}>
                                    <td>
                                        <div className="category-cell">
                                            <div className="category-icon">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                            </div>
                                            <span className="category-name">{category.categoryName}</span>
                                        </div>
                                    </td>
                                    <td className="text-description">{category.description || 'No description provided.'}</td>
                                    <td>
                                        <div className="action-cell">
                                            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/categories/${category.categoryId}`)}>Edit</button>
                                            <DeleteButton
                                                onConfirm={() => handleDelete(category.categoryId)}
                                                title="Delete Category?"
                                                text="This might affect existing schemes linked to this category."
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                                    {loading ? 'Loading...' : 'No categories found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default CategoryList;
