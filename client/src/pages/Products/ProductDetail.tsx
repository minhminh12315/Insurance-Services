import { useParams, Link } from 'react-router-dom';
import { fakeProducts } from '../../data/fakeData';

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const product = fakeProducts.find((p) => p.id === id);

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Product Not Found</h2>
                <Link to="/products" className="btn btn-primary">
                    Back to Products
                </Link>
            </div>
        );
    }

    const getStockStatus = (stock: number) => {
        if (stock > 50) return { label: 'In Stock', class: 'badge-success' };
        if (stock > 20) return { label: 'Low Stock', class: 'badge-warning' };
        return { label: 'Critical', class: 'badge-danger' };
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <div>
            {/* Back Button */}
            <Link
                to="/products"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    marginBottom: '24px',
                    fontSize: '14px',
                }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Products
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
                {/* Product Image */}
                <div className="glass-card" style={{ padding: '24px', overflow: 'hidden' }}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '350px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                        }}
                    />
                </div>

                {/* Product Info */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <span className={`badge ${stockStatus.class}`} style={{ marginBottom: '12px', display: 'inline-block' }}>
                            {stockStatus.label}
                        </span>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{product.name}</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Category: {product.category}</p>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <span className="gradient-text" style={{ fontSize: '36px', fontWeight: 700 }}>
                            ${product.price.toFixed(2)}
                        </span>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Description</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.description}</p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px',
                            padding: '20px',
                            background: 'var(--bg-glass)',
                            borderRadius: '12px',
                            marginBottom: '32px',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>Stock</p>
                            <p style={{ fontSize: '20px', fontWeight: 600 }}>{product.stock}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>Product ID</p>
                            <p style={{ fontSize: '20px', fontWeight: 600 }}>#{product.id}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>Added</p>
                            <p style={{ fontSize: '20px', fontWeight: 600 }}>{product.createdAt}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/products" className="btn btn-secondary" style={{ flex: 1, textDecoration: 'none' }}>
                            Back to List
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
