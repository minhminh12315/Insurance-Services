import { useState, useEffect } from 'react';
import { fakeNews, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { NewsAnnouncement, User } from '../../types';

const NewsList = () => {
    const [news, setNews] = useState<NewsAnnouncement[]>(fakeNews);
    const [users, setUsers] = useState<User[]>(fakeUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsAnnouncement | null>(null);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<NewsAnnouncement>>({});

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [newsRes, usersRes] = await Promise.all([
    //                 api.get('/news'),
    //                 api.get('/users')
    //             ]);
    //             setNews(newsRes.data);
    //             setUsers(usersRes.data);
    //         } catch (error) {
    //             console.error('Failed to fetch data:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    useEffect(() => {
        if (editingNews) {
            setFormData(editingNews);
        } else {
            setFormData({});
        }
    }, [editingNews]);

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAuthorName = (id: number | null) => {
        if (id === null) return 'System';
        return users.find(u => u.user_id === id)?.full_name || 'Admin';
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            setNews(news.filter(n => n.news_id !== id));
        }
    };

    const handleSave = () => {
        try {
            const dataToSave = {
                ...formData,
                published_date: formData.published_date || new Date().toISOString(),
                author_id: formData.author_id || null // defaulting to null (System/Admin) if not set
            };

            if (editingNews) {
                // Update
                setNews(news.map(n => n.news_id === editingNews.news_id ? { ...n, ...dataToSave } as NewsAnnouncement : n));
            } else {
                // Create
                const newAnnouncement = {
                    ...dataToSave,
                    news_id: news.length > 0 ? Math.max(...news.map(n => n.news_id)) + 1 : 1
                } as NewsAnnouncement;
                setNews([newAnnouncement, ...news]);
            }
            setShowModal(false);
        } catch (error) {
            console.error('Failed to save news:', error);
            alert('Failed to save news');
        }
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading announcements...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>News & Announcements</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Broadcast important updates and notifications to all users</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingNews(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                    New Announcement
                </button>
            </div>

            <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <input
                    type="text"
                    placeholder="Search by title or content..."
                    className="input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {filteredNews.map((n) => (
                    <div key={n.news_id} className="glass-card" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {new Date(n.published_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => { setEditingNews(n); setShowModal(true); }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </button>
                                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} onClick={() => handleDelete(n.news_id)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', lineHeight: 1.4 }}>{n.title}</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, flex: 1, marginBottom: '24px' }}>{n.content}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--accent-primary)', fontWeight: 700 }}>
                                {getAuthorName(n.author_id)[0]}
                            </div>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Published by <span style={{ color: '#475569', fontWeight: 500 }}>{getAuthorName(n.author_id)}</span></span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content glass-card" style={{ width: '600px', background: '#fff' }} onClick={e => e.stopPropagation()}>
                        <h2>{editingNews ? 'Edit Announcement' : 'Post New Announcement'}</h2>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Title</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.title || ''}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Headline for the announcement"
                            />
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Announcement Content</label>
                            <textarea
                                className="input"
                                style={{ height: '200px', resize: 'none' }}
                                value={formData.content || ''}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write the full announcement details here..."
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>{editingNews ? 'Update' : 'Publish'} Announcement</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsList;
