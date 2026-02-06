const Header = () => {
    return (
        <header
            style={{
                height: '70px',
                background: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 32px',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Search Bar */}
            <div style={{ position: 'relative', width: '400px' }}>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Search records, policies, or users..."
                    className="input"
                    style={{ paddingLeft: '44px', background: '#f1f5f9', border: 'none' }}
                />
            </div>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Notification Bell */}
                <button
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s',
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--danger)',
                            border: '2px solid #ffffff',
                        }}
                    />
                </button>

                {/* Vertical Divider */}
                <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />

                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Thanh Nguyen</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Super Admin</p>
                    </div>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--accent-gradient)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        TN
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
