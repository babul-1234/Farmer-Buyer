import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats');
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
            <h1>Admin Dashboard</h1>
            <p>Manage users and listings here.</p>
            <div className="card" style={{ marginTop: '20px', padding: '40px' }}>
                <h3>System Status: Online</h3>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                    <div>
                        <h4>Total Users</h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.users}</p>
                    </div>
                    <div>
                        <h4>Active Listings</h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.products}</p>
                    </div>
                    <div>
                        <h4>Total Orders</h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.orders}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
