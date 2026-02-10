import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Hero Banner */}
            <section
                style={{
                    background: 'linear-gradient(rgba(0, 31, 63, 0.85), rgba(0, 31, 63, 0.85)), url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=600&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '180px 0 100px',
                    color: '#ffffff',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px' }}>404 Error</h1>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                        <Link to="/home" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pages</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: '#015fc9' }}>404 Error</span>
                    </nav>
                </div>
            </section>

            {/* 404 Content */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
                    {/* Warning Icon */}
                    <div style={{ marginBottom: '30px' }}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>

                    <h2 style={{ fontSize: '120px', fontWeight: 700, color: '#0a1628', lineHeight: 1, marginBottom: '15px' }}>
                        404
                    </h2>
                    <h3 style={{ fontSize: '32px', fontWeight: 700, color: '#0a1628', marginBottom: '20px' }}>
                        Page Not Found
                    </h3>
                    <p style={{ color: '#666', lineHeight: 1.8, fontSize: '16px', marginBottom: '35px' }}>
                        We're sorry, the page you have looked for does not exist in our website! Maybe go to our
                        home page or try to use a search?
                    </p>
                    <Link
                        to="/home"
                        style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                            color: '#ffffff',
                            padding: '16px 40px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '16px',
                            boxShadow: '0 4px 15px rgba(1, 95, 201, 0.4)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(1, 95, 201, 0.5)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(1, 95, 201, 0.4)'; }}
                    >
                        Go Back To Home
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default NotFound;
