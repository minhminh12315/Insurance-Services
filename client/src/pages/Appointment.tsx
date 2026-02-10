import { useState } from 'react';
import { Link } from 'react-router-dom';

const Appointment = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        serviceType: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Appointment request submitted successfully!');
        setFormData({ name: '', email: '', mobile: '', serviceType: '', message: '' });
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 18px',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        fontSize: '15px',
        color: '#333',
        outline: 'none',
        transition: 'border-color 0.3s ease',
        background: '#ffffff',
    };

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
                    <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px' }}>Appointment</h1>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                        <Link to="/home" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pages</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: '#015fc9' }}>Appointment</span>
                    </nav>
                </div>
            </section>

            {/* Appointment Section */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '60px',
                        alignItems: 'start',
                    }}
                >
                    {/* Left Content */}
                    <div>
                        <h2 style={{ fontSize: '42px', fontWeight: 700, color: '#0a1628', marginBottom: '25px', lineHeight: 1.3 }}>
                            We're Award Winning Insurance Company
                        </h2>
                        <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '40px', fontSize: '16px' }}>
                            Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo
                            justo magna dolore erat amet. Tempor erat elitr rebum at clita. Diam dolor diam ipsum
                            sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita
                            duo justo magna.
                        </p>

                        {/* Call Us Box */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '20px 25px',
                                background: '#f8f9fa',
                                borderRadius: '15px',
                                border: '1px solid #e8edf2',
                            }}
                        >
                            <div
                                style={{
                                    width: '55px',
                                    height: '55px',
                                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0a1628' }}>
                                    Call Us: +012 345 6789
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div
                        style={{
                            background: '#f8f9fa',
                            borderRadius: '20px',
                            padding: '40px',
                            boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#dee2e6'; }}
                                    required
                                />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#dee2e6'; }}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <input
                                    name="mobile"
                                    type="tel"
                                    placeholder="Your Mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#dee2e6'; }}
                                    required
                                />
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, color: formData.serviceType ? '#333' : '#999', cursor: 'pointer' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#dee2e6'; }}
                                    required
                                >
                                    <option value="" disabled>Service Type</option>
                                    <option value="life">Life Insurance</option>
                                    <option value="health">Health Insurance</option>
                                    <option value="motor">Motor Insurance</option>
                                    <option value="home">Home Insurance</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <textarea
                                    name="message"
                                    placeholder="Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#dee2e6'; }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                    color: '#ffffff',
                                    padding: '16px 40px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(1, 95, 201, 0.4)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(1, 95, 201, 0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(1, 95, 201, 0.4)'; }}
                            >
                                Get Appointment
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Appointment;
