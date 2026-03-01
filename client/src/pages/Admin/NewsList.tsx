import { useState, useEffect } from 'react';
import { fakeNews, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { NewsAnnouncement, User } from '../../types';

const NewsList = () => {
    const [news, setNews] = useState<NewsAnnouncement[]>(fakeNews);
    const [users] = useState<User[]>(fakeUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsAnnouncement | null>(null);
    const [loading] = useState(false);

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
        return <div className="p-5 text-center">Loading announcements...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">News & Announcements</h1>
                    <p className="text-slate-500 text-[15px]">Broadcast important updates and notifications to all users</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingNews(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                    New Announcement
                </button>
            </div>

            <div className="glass-card p-5 mb-6 bg-white border border-slate-200">
                <input
                    type="text"
                    placeholder="Search by title or content..."
                    className="input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
                {filteredNews.map((n) => (
                    <div key={n.news_id} className="glass-card bg-white border border-slate-200 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                {new Date(n.published_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            <div className="flex gap-2">
                                <button className="border-none bg-none cursor-pointer text-slate-400 hover:text-blue-600 transition-colors" onClick={() => { setEditingNews(n); setShowModal(true); }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </button>
                                <button className="border-none bg-none cursor-pointer text-red-500 hover:text-red-700 transition-colors" onClick={() => handleDelete(n.news_id)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 leading-tight">{n.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">{n.content}</p>
                        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] text-blue-600 font-bold">
                                {getAuthorName(n.author_id)[0]}
                            </div>
                            <span className="text-xs text-slate-400">Published by <span className="text-slate-600 font-medium">{getAuthorName(n.author_id)}</span></span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content glass-card w-[600px] bg-white p-8" onClick={e => e.stopPropagation()}>
                        <h2 className="text-[22px] font-extrabold text-slate-800 mb-6">{editingNews ? 'Edit Announcement' : 'Post New Announcement'}</h2>
                        <div className="mb-5">
                            <label className="block mb-2 text-[13px] font-semibold text-slate-500">Title</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.title || ''}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Headline for the announcement"
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block mb-2 text-[13px] font-semibold text-slate-500">Announcement Content</label>
                            <textarea
                                className="input h-[200px] resize-none"
                                value={formData.content || ''}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write the full announcement details here..."
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
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
