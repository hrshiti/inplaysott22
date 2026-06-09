import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Play, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from './utils/imageUtils';
import authService from './services/api/authService';

export default function HistoryPage({ onMovieClick, watchHistory = [], onRefresh }) {
    const navigate = useNavigate();
    const [isClearing, setIsClearing] = useState(false);

    const getRelativeTime = (date) => {
        if (!date) return 'Watched recently';
        const now = new Date();
        const watched = new Date(date);

        if (isNaN(watched.getTime())) return 'Watched recently';

        const diffInMs = now - watched;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Watched Today';
        if (diffInDays === 1) return 'Watched Yesterday';
        if (diffInDays < 7) return `Watched ${diffInDays} days ago`;
        return `Watched on ${watched.toLocaleDateString()}`;
    }

    const handleClearHistory = async () => {
        if (!window.confirm("Are you sure you want to clear your entire watch history?")) return;

        try {
            setIsClearing(true);
            await authService.clearHistory();
            if (onRefresh) await onRefresh();
        } catch (error) {
            console.error("Failed to clear history", error);
            alert("Failed to clear history");
        } finally {
            setIsClearing(false);
        }
    };

    const handleRemoveItem = async (e, itemId) => {
        e.stopPropagation(); // Prevent card click
        if (!window.confirm("Remove this item from history?")) return;

        try {
            await authService.removeFromHistory(itemId);
            if (onRefresh) await onRefresh();
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    return (
        <div className="history-page" style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            padding: '20px',
            paddingBottom: '100px'
        }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
                position: 'sticky',
                top: 0,
                background: 'var(--glass)',
                backdropFilter: 'blur(10px)',
                zIndex: 10,
                borderBottom: '1px solid var(--glass-border)',
                margin: '-20px -20px 24px -20px',
                padding: '16px 20px'
            }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}
                >
                    <ArrowLeft size={24} />
                </motion.button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Watch History</h2>
                <div style={{ flex: 1 }} />
                {watchHistory.length > 0 && (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClearHistory}
                        disabled={isClearing}
                        style={{
                            background: 'rgba(255, 10, 22, 0.1)',
                            border: 'none',
                            color: 'var(--accent)',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            opacity: isClearing ? 0.5 : 1,
                            display: 'flex'
                        }}
                    >
                        <Trash2 size={18} />
                    </motion.button>
                )}
            </header>

            {/* History List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <AnimatePresence>
                    {watchHistory.map((item, index) => (
                        <motion.div
                            key={item._id || item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onMovieClick(item)}
                            style={{
                                display: 'flex',
                                gap: '16px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: '1px solid var(--glass-border)',
                                position: 'relative',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                            }}
                        >
                            {/* Remove Button for Individual Item */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleRemoveItem(e, item.contentId || item._id || item.id)}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'rgba(255,255,255,0.9)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    zIndex: 5,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                <X size={14} />
                            </motion.button>

                            {/* Thumbnail */}
                            <div style={{ width: '140px', height: '80px', position: 'relative', flexShrink: 0, background: 'var(--bg-tertiary)' }}>
                                <img
                                    src={getImageUrl(item.poster?.url || item.thumbnail?.url || item.backdrop || item.image)}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = "https://placehold.co/140x80/222/FFF?text=InPlay" }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.2)'
                                }}>
                                    <Play size={20} fill="white" />
                                </div>
                                {item.progress && (
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.3)' }}>
                                        <div style={{ width: `${item.progress}%`, height: '100%', background: 'var(--accent)' }} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, padding: '12px 12px 12px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>{item.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    <Clock size={12} />
                                    <span>{getRelativeTime(item.watchedAt || item.updatedAt)}</span>
                                    <span style={{ opacity: 0.3 }}>|</span>
                                    <span>{item.type === 'reel' ? 'Quick Bite' : (item.episodes ? 'Series' : 'Movie')}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {watchHistory.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <Clock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>No watch history yet.</p>
                </div>
            )}
        </div>
    );
}
