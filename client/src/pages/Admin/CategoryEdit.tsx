
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryForm from './CategoryForm';
import type { InsuranceCategory } from '../../types';

const CategoryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const apiURL = import.meta.env.VITE_API_URL;

    const [category, setCategory] = useState<InsuranceCategory | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchCategory(parseInt(id));
        }
    }, [id]);

    const fetchCategory = async (categoryId: number) => {
        setLoading(true);
        try {
            // Adjust endpoint if necessary - assuming generic GET by ID exists or filtered list
            // If GET /api/InsuranceCategories/{id} exists:
            const response = await axios.get(`${apiURL}/api/InsuranceCategories/${categoryId}`);
            setCategory(response.data);
        } catch (err) {
            console.error('Failed to fetch category', err);
            setError('Failed to load category details.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (categoryData: Partial<InsuranceCategory>) => {
        try {
            if (id) {
                await axios.put(`${apiURL}/api/InsuranceCategories/${id}`, {
                    ...category,
                    ...categoryData,
                    categoryId: parseInt(id) // Ensure ID is present for PUT if required
                });
            } else {
                await axios.post(`${apiURL}/api/InsuranceCategories`, categoryData);
            }
            navigate('/categories');
        } catch (err) {
            console.error('Error saving category:', err);
            setError('Failed to save category. Please try again.');
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-content">
                    <h1>{id ? 'Edit Category' : 'Create New Category'}</h1>
                    <p>{id ? 'Update category details' : 'Add a new insurance category to the system'}</p>
                </div>
            </div>

            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                {error && (
                    <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '6px' }}>
                        {error}
                    </div>
                )}

                <CategoryForm
                    category={category}
                    onSubmit={handleFormSubmit}
                    onCancel={() => navigate('/categories')}
                />
            </div>
        </div>
    );
};

export default CategoryEdit;
