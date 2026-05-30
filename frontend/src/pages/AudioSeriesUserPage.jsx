import { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Pause, SkipBack, SkipForward, Clock, ChevronLeft } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.inplays.in/';
const API_Base = rawApiUrl.replace(/\/$/, '').endsWith('/api') ? rawApiUrl.replace(/\/$/, '') : `${rawApiUrl.replace(/\/$/, '')}/api`;
const API_URL = API_Base + '/audio-series';

export default function AudioSeriesUserPage({ onBack }) {
    const [seriesList, setSeriesList] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [loading, setLoading] = useState(true);

    const {
        currentEpisode,
        isPlaying,
        currentTime,
        duration,
        playEpisode: playEpisodeContext,
        togglePlay,
        seekTo,
        skipForward,
        skipBackward
    } = useAudioPlayer();

    useEffect(() => {
        fetchSeries();
    }, []);

    const fetchSeries = async () => {
        try {
            const res = await axios.get(API_URL);
            setSeriesList(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching audio series:", error);
            setLoading(false);
        }
    };

    const playEpisode = (episode, series) => {
        setSelectedSeries(series);
        playEpisodeContext(episode, series);
    };

    if (loading) return (
        <div style={{ color: '#64748b', padding: '60px 20px', textAlign: 'center', background: '#f8fafc', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>Loading Audio Series...</div>
        </div>
    );

    return (
        <div style={{ padding: '20px', paddingBottom: '120px', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>

            {!selectedSeries ? (
                /* ─── Series Grid ─── */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0a16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                        </svg>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Audio Series</h2>
                    </div>

                    {seriesList.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '60px 20px',
                            background: '#fff', borderRadius: '16px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ marginBottom: '16px', display: 'block', margin: '0 auto 16px' }}>
                                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                            </svg>
                            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#64748b', margin: '0 0 4px' }}>No Audio Series Yet</p>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>Check back soon for new content</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                            {seriesList.map(series => (
                                <div key={series._id} onClick={() => setSelectedSeries(series)} style={{ cursor: 'pointer', minWidth: 0 }}>
                                    <div style={{
                                        position: 'relative', aspectRatio: '9/16',
                                        borderRadius: '14px', overflow: 'hidden',
                                        marginBottom: '8px', background: '#e2e8f0',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                                    }}>
                                        <img
                                            src={getImageUrl(series.coverImage)}
                                            alt={series.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                                        />
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                                            padding: '20px 8px 8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                        }}>
                                            <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: '600' }}>
                                                {series.episodes?.length || 0} ep
                                            </span>
                                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Play fill="white" size={11} color="white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {series.title}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                                        {series.episodes?.length || 0} Episodes
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            ) : (
                /* ─── Series Detail ─── */
                <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <button
                        onClick={() => setSelectedSeries(null)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            background: 'none', border: 'none', color: '#64748b',
                            marginBottom: '20px', cursor: 'pointer',
                            fontSize: '0.9rem', fontWeight: '600', padding: 0
                        }}
                    >
                        <ChevronLeft size={20} /> Back
                    </button>

                    {/* Series header card */}
                    <div style={{
                        display: 'flex', gap: '16px', marginBottom: '24px',
                        background: '#fff', borderRadius: '16px', padding: '16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0'
                    }}>
                        <img
                            src={getImageUrl(selectedSeries.coverImage)}
                            alt={selectedSeries.title}
                            style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px', lineHeight: 1.3 }}>
                                {selectedSeries.title}
                            </h1>
                            <p style={{
                                color: '#64748b', fontSize: '0.8rem', lineHeight: '1.5', margin: '0 0 12px',
                                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                            }}>
                                {selectedSeries.description}
                            </p>
                            <button
                                onClick={() => selectedSeries.episodes?.[0] && playEpisode(selectedSeries.episodes[0], selectedSeries)}
                                style={{
                                    background: 'linear-gradient(135deg, #ff0a16, #ff4500)',
                                    color: 'white', border: 'none',
                                    padding: '8px 18px', borderRadius: '100px',
                                    fontWeight: '700', fontSize: '0.8rem',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                    boxShadow: '0 3px 12px rgba(255,10,22,0.3)'
                                }}
                            >
                                <Play fill="white" size={13} /> Play All
                            </button>
                        </div>
                    </div>

                    {/* Episodes */}
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                        Episodes ({selectedSeries.episodes?.length || 0})
                    </h3>

                    {(!selectedSeries.episodes || selectedSeries.episodes.length === 0) ? (
                        <div style={{
                            color: '#94a3b8', padding: '30px 20px', background: '#fff',
                            borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0'
                        }}>
                            No episodes available for this series yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {selectedSeries.episodes.map((episode, index) => {
                                const isActive = currentEpisode?._id === episode._id;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => playEpisode(episode, selectedSeries)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '12px 16px',
                                            background: isActive ? 'rgba(255,10,22,0.04)' : '#fff',
                                            borderRadius: '12px', cursor: 'pointer',
                                            border: isActive ? '1.5px solid rgba(255,10,22,0.25)' : '1px solid #e2e8f0',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{
                                                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                                                background: isActive ? '#ff0a16' : '#f1f5f9',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {isActive && isPlaying
                                                    ? <Pause size={12} fill="white" color="white" />
                                                    : <Play size={12} fill={isActive ? 'white' : '#64748b'} color={isActive ? 'white' : '#64748b'} />
                                                }
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '0.88rem', color: isActive ? '#ff0a16' : '#0f172a' }}>
                                                    {episode.title}
                                                </div>
                                                <div style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                    <Clock size={11} /> {formatDuration(episode.duration)}
                                                </div>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: '500' }}>
                                            Ep {index + 1}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            )}

            {/* ─── Floating Audio Player ─── */}
            <AnimatePresence>
                {currentEpisode && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        style={{
                            position: 'fixed', bottom: '72px', left: '10px', right: '10px',
                            background: '#fff', padding: '12px 16px', borderRadius: '16px',
                            display: 'flex', flexDirection: 'column', gap: '10px',
                            boxShadow: '0 -4px 24px rgba(0,0,0,0.12)', zIndex: 2000,
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img
                                    src={getImageUrl(currentEpisode.coverImage)}
                                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                    alt=""
                                />
                                <div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {currentEpisode.title}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{currentEpisode.seriesTitle}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <SkipBack size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => skipBackward(10)} />
                                <button
                                    onClick={togglePlay}
                                    style={{
                                        width: '38px', height: '38px',
                                        background: 'linear-gradient(135deg, #ff0a16, #ff4500)',
                                        borderRadius: '50%', border: 'none',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', boxShadow: '0 3px 10px rgba(255,10,22,0.3)'
                                    }}
                                >
                                    {isPlaying ? <Pause size={16} fill="white" color="white" /> : <Play size={16} fill="white" color="white" />}
                                </button>
                                <SkipForward size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => skipForward(10)} />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', color: '#94a3b8' }}>
                            <span style={{ minWidth: '35px', textAlign: 'right' }}>{formatDuration(currentTime)}</span>
                            <input
                                type="range" min="0" max={duration || 100} value={currentTime}
                                onChange={(e) => seekTo(Number(e.target.value))}
                                style={{ flex: 1, height: '4px', appearance: 'none', background: '#e2e8f0', borderRadius: '2px', cursor: 'pointer', outline: 'none' }}
                            />
                            <span style={{ minWidth: '35px' }}>{formatDuration(duration)}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const formatDuration = (seconds) => {
    if (!seconds) return "0 sec";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    if (m === 0) return `${s} sec`;
    return `${m}:${s < 10 ? '0' : ''}${s} min`;
};
