import '../../assets/styles/Header.css';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    return (
        <header className="header">
            {/* Left Section - Mobile Menu + Search */}
            <div className="header-left">
                {/* Mobile Menu Button */}
                <button onClick={onMenuClick} className="mobile-menu-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                {/* Search Bar */}
                <div className="search-container">
                    <svg
                        className="search-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search records, policies, or users..."
                        className="input search-input"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="header-right">
                {/* Notification Bell */}
                <button className="notification-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="notification-badge" />
                </button>

                {/* Vertical Divider */}
                <div className="header-divider hide-mobile" />

                {/* User Info */}
                <div className="user-info">
                    <div className="user-details hide-mobile">
                        <p className="user-name">Thanh Nguyen</p>
                        <p className="user-role">Super Admin</p>
                    </div>
                    <div className="user-avatar">TN</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
