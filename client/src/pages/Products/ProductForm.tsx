import { useState } from 'react';
import type { Product } from '../../types';
import { categories } from '../../data/fakeData';

interface ProductFormProps {
    product?: Product | null;
    onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
}

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price?.toString() || '',
        category: product?.category || categories[0],
        stock: product?.stock?.toString() || '',
        imageUrl: product?.imageUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            category: formData.category,
            stock: parseInt(formData.stock) || 0,
            imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="label">Product Name</label>
                <input
                    type="text"
                    name="name"
                    className="input"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label className="label">Description</label>
                <textarea
                    name="description"
                    className="textarea"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                    <label className="label">Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        className="input"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        className="input"
                        placeholder="0"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="label">Category</label>
                <select
                    name="category"
                    className="select"
                    value={formData.category}
                    onChange={handleChange}
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="label">Image URL</label>
                <input
                    type="url"
                    name="imageUrl"
                    className="input"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    {product ? 'Update Product' : 'Add Product'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
