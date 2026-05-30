import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const headerLogo = '/FINAL_LOGO_copy__1_.jpg-removebg-preview (2).png';

const Header = ({ currentUser, onLoginClick, onMenuToggle, isMenuOpen }) => {
    const navigate = useNavigate();

    return (
        <div className="mx-header">
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div className="brand-logo">
                    <img src={headerLogo} alt="InPlay" className="brand-logo-image" />
                </div>
                <button 
                    onClick={onMenuToggle}
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'background 0.2s'
                    }}
                >
                    {isMenuOpen ? <X size={24} color="#0f172a" /> : <Menu size={24} color="#0f172a" />}
                </button>
            </div>
            <div 
                onClick={() => navigate('/search')}
                style={{
                    width: '100%',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    gap: '10px',
                    cursor: 'pointer',
                    height: '38px',
                    boxSizing: 'border-box'
                }}
            >
                <Search size={16} color="#64748b" />
                <span style={{ color: '#94a3b8', fontSize: '0.82rem', userSelect: 'none' }}>Search movies, shows...</span>
            </div>
        </div>
    );
};

export default Header;

