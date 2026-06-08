import { useRef, useState } from 'react';
import { getImageUrl } from './utils/imageUtils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Download, ChevronRight, Settings, User, Plus, ThumbsUp, Play } from 'lucide-react';
import { MY_SPACE_DATA } from './data';

export default function MySpacePage({ onMovieClick, myList, likedVideos, watchHistory, continueWatching, currentUser, allContent }) {
    const [avatarError, setAvatarError] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // Use actual user data or fallback to mock data (only if no user)
    const userName = currentUser?.name || MY_SPACE_DATA.user.name;
    const userAvatar = currentUser?.avatar; // Don't fallback to mock so we can show default icon
    const userPlan = currentUser?.subscription?.plan?.name || MY_SPACE_DATA.user.plan;

    return (
        <div ref={containerRef} className="my-space-container" style={{ padding: '24px', paddingBottom: '100px', color: '#0f172a' }}>

            {/* User Profile Header */}
            <motion.div
                className="profile-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '16px' }}
            >
                <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/settings')}
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, cursor: 'pointer' }}
                >
                    <div style={{ position: 'relative' }}>
                        {userAvatar && !avatarError ? (
                            <img
                                src={getImageUrl(userAvatar)}
                                alt="Profile"
                                onError={() => setAvatarError(true)}
                                style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--accent)', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                border: '2px solid var(--accent)',
                                background: '#ff0a16',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <User size={32} color="white" />
                            </div>
                        )}
                        <div style={{
                            position: 'absolute', bottom: 0, right: 0,
                            background: 'var(--accent)', borderRadius: '50%', width: '20px', height: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white'
                        }}>
                            <User size={12} fill="white" />
                        </div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '4px', color: '#0f172a' }}>{userName}</h2>
                    </div>
                </motion.div>

                <motion.button
                    whileTap={{ scale: 0.9, rotate: 90 }}
                    onClick={() => navigate('/settings')}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px' }}
                >
                    <Settings size={24} />
                </motion.button>
            </motion.div>

            {/* Quick Actions Hub Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '36px'
            }}>
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/my-list')}
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                    }}
                >
                    <Plus size={20} color="#ff0a16" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginTop: '6px' }}>My List</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{myList?.length || 0} items</span>
                </motion.div>

                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/liked-videos')}
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                    }}
                >
                    <ThumbsUp size={20} color="#10b981" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginTop: '6px' }}>Liked Videos</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{likedVideos?.length || 0} items</span>
                </motion.div>

                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/history')}
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                    }}
                >
                    <Clock size={20} color="#3b82f6" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginTop: '6px' }}>History</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{watchHistory?.length || 0} items</span>
                </motion.div>


            </div>

            {/* My List Section */}
            <Section
                title="My List"
                icon={<Plus size={16} />}
                onHeaderClick={() => navigate('/my-list')}
            >
                {myList && myList.length > 0 ? (
                    <div className="horizontal-list hide-scrollbar" style={{ padding: 0 }}>
                        {myList.map((movie) => (
                            <SpaceCard key={movie._id || movie.id} item={movie} type="poster" onClick={() => onMovieClick(movie)} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px 16px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px dashed #cbd5e1',
                        textAlign: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Your watchlist is empty</span>
                        <button 
                            onClick={() => navigate('/')}
                            style={{ 
                                fontSize: '0.75rem', 
                                color: 'white', 
                                background: '#ff0a16', 
                                padding: '6px 16px', 
                                borderRadius: '20px', 
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 10, 22, 0.15)'
                            }}
                        >
                            Explore Shows
                        </button>
                    </div>
                )}
            </Section>

            {/* Liked Videos Section */}
            <Section
                title="Liked Videos"
                icon={<ThumbsUp size={16} />}
                onHeaderClick={() => navigate('/liked-videos')}
            >
                {likedVideos && likedVideos.length > 0 ? (
                    <div className="horizontal-list hide-scrollbar" style={{ padding: 0 }}>
                        {likedVideos.map((movie) => (
                            <SpaceCard key={movie._id || movie.id} item={movie} type="poster" onClick={() => onMovieClick(movie)} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px 16px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px dashed #cbd5e1',
                        textAlign: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>No liked videos yet</span>
                        <button 
                            onClick={() => navigate('/')}
                            style={{ 
                                fontSize: '0.75rem', 
                                color: 'white', 
                                background: '#ff0a16', 
                                padding: '6px 16px', 
                                borderRadius: '20px', 
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 10, 22, 0.15)'
                            }}
                        >
                            Find Favorites
                        </button>
                    </div>
                )}
            </Section>

            {/* Watch History Section */}
            <Section
                title="History"
                icon={<Clock size={16} />}
                onHeaderClick={() => navigate('/history')}
            >
                {watchHistory && watchHistory.length > 0 ? (
                    <div className="horizontal-list hide-scrollbar" style={{ padding: 0 }}>
                        {watchHistory.map((show) => (
                            <SpaceCard key={show._id || show.id} item={show} type="backdrop" onClick={() => onMovieClick(show)} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px 16px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px dashed #cbd5e1',
                        textAlign: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>You haven't watched anything yet</span>
                        <button 
                            onClick={() => navigate('/')}
                            style={{ 
                                fontSize: '0.75rem', 
                                color: 'white', 
                                background: '#ff0a16', 
                                padding: '6px 16px', 
                                borderRadius: '20px', 
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 10, 22, 0.15)'
                            }}
                        >
                            Start Watching
                        </button>
                    </div>
                )}
            </Section>

            {/* Recommended for You Section */}
            {allContent && allContent.length > 0 && (
                <Section
                    title="Recommended for You"
                    icon={<Play size={14} color="#ff0a16" fill="#ff0a16" />}
                >
                    <div className="horizontal-list hide-scrollbar" style={{ padding: 0 }}>
                        {allContent.slice(0, 10).map((movie) => (
                            <SpaceCard key={movie._id || movie.id} item={movie} type="poster" onClick={() => onMovieClick(movie)} />
                        ))}
                    </div>
                </Section>
            )}

        </div>
    );
}

function Section({ title, icon, children, onHeaderClick }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '32px' }}
        >
            <div
                onClick={onHeaderClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    cursor: onHeaderClick ? 'pointer' : 'default'
                }}
            >
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                    {icon} {title}
                </h3>
                {onHeaderClick && <ChevronRight size={16} color="#64748b" />}
            </div>
            {children}
        </motion.section>
    )
}

function SpaceCard({ item, type, onClick }) {
    const isPoster = type === 'poster';
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{
                flex: isPoster ? '0 0 110px' : '0 0 220px',
                position: 'relative',
                cursor: 'pointer',
                marginRight: '12px'
            }}
        >
            <div style={{
                height: isPoster ? '160px' : '125px',
                borderRadius: '12px', overflow: 'hidden', marginBottom: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                background: '#f1f5f9',
                position: 'relative',
                border: '1px solid #cbd5e1'
            }}>
                <img
                    src={getImageUrl(item.poster?.url || item.image || item.backdrop)}
                    onError={(e) => { e.target.src = "https://placehold.co/110x160/222/FFF?text=No+Image" }}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isPoster ? 1 : 0.8 }}
                />

                {/* Play Overlay for Backdrop items */}
                {!isPoster && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '10px', backdropFilter: 'blur(5px)' }}>
                            <Play size={20} fill="white" />
                        </div>
                    </div>
                )}

                {item.progress && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)' }}>
                        <div style={{ width: `${item.progress}%`, height: '100%', background: '#ff0000' }} />
                    </div>
                )}
            </div>
            <h4 style={{
                fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                color: '#0f172a', fontWeight: '500'
            }}>
                {item.title}
            </h4>
            {item.watched_date && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Watched {item.watched_date}</span>}
        </motion.div>
    )
}
