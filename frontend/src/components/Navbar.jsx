import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">
                    <span style={{ fontSize: '2rem' }}>🌱</span> AgroConnect
                </Link>
                <ul className="nav-links" style={{ alignItems: 'center' }}>
                    <li><Link to="/">Home</Link></li>
                    {user ? (
                        <>
                            {user.role === 'farmer' && <li><Link to="/farmer-dashboard">Dashboard</Link></li>}
                            {user.role === 'buyer' && <li><Link to="/buyer-dashboard">Marketplace</Link></li>}
                            {user.role === 'admin' && <li><Link to="/admin-dashboard">Admin</Link></li>}

                            {/* Notification Bell */}
                            <li style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifs(!showNotifs)}>
                                <span style={{ fontSize: '1.2rem' }}>🔔</span>
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '-5px', right: '-5px',
                                        backgroundColor: 'red', color: 'white', borderRadius: '50%',
                                        padding: '2px 6px', fontSize: '0.7rem'
                                    }}>{unreadCount}</span>
                                )}
                                {showNotifs && (
                                    <div style={{
                                        position: 'absolute', top: '30px', right: '0', width: '300px',
                                        backgroundColor: '#1a2620', border: '1px solid #333', borderRadius: '8px',
                                        zIndex: 1000, boxShadow: '0 5px 15px rgba(0,0,0,0.5)', padding: '10px'
                                    }}>
                                        <h4 style={{ marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Notifications</h4>
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {notifications.length === 0 ? <p style={{ fontSize: '0.9rem', color: '#aaa' }}>No notifications</p> : (
                                                notifications.map(n => (
                                                    <div key={n.id} style={{ padding: '8px', borderBottom: '1px solid #333', fontSize: '0.9rem', backgroundColor: n.is_read ? '' : 'rgba(39, 174, 96, 0.1)' }}>
                                                        {n.message}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </li>

                            <li><button onClick={handleLogout} className="btn btn-danger" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
