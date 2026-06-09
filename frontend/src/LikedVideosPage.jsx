import { motion } from 'framer-motion';
import { ArrowLeft, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from './utils/imageUtils';

export default function LikedVideosPage({ likedVideos, onMovieClick }) {
    const navigate = useNavigate();

    return (
        <div className="liked-videos-page" style={{
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Liked Videos</h2>
                <div style={{ flex: 1 }} />
            </header>

            {/* Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '16px'
            }}>
                {likedVideos.map((movie, index) => (
                    <motion.div
                        key={movie._id || movie.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onMovieClick(movie)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{
                            aspectRatio: '2/3',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: 'var(--bg-tertiary)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            marginBottom: '8px'
                        }}>
                            <img
                                src={getImageUrl(movie.image || movie.thumbnail?.url || movie.poster?.url)}
                                alt={movie.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = `https://placehold.co/300x450/111/FFF?text=${movie.title}` }}
                            />
                        </div>
                        <h4 style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {movie.title}
                        </h4>
                    </motion.div>
                ))}
            </div>

            {likedVideos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                    <ThumbsUp size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>No liked videos yet.</p>
                </div>
            )}
        </div>
    );
}
