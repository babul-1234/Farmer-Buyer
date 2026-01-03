import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('requests');

    const [weather, setWeather] = useState(null);

    useEffect(() => {
        fetchMyProducts();
        fetchRequests();
        fetchWeather();
    }, []);

    const fetchWeather = async () => {
        // Default to New Delhi (28.61, 77.20) for demo
        try {
            const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current_weather=true');
            const data = await res.json();
            setWeather(data.current_weather);
        } catch (err) {
            console.error('Weather fetch failed');
        }
    };
    const fetchMyProducts = async () => {
        try {
            const res = await api.get('/products/my-products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await api.get('/orders/requests/farmer');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRequestAction = async (id, status) => {
        try {
            await api.put(`/orders/request/${id}/status`, { status });
            alert(`Request ${status}`);
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchMyProducts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '5px' }}>Farmer Dashboard</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>

                    {weather && (
                        <div style={{ marginTop: '15px', padding: '10px 15px', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '8px', border: '1px solid rgba(52, 152, 219, 0.3)', display: 'inline-block' }}>
                            <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>🌤️ {weather.temperature}°C</span>
                            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Wind: {weather.windspeed} km/h</span>
                        </div>
                    )}
                </div>
                <Link to="/add-product" className="btn btn-primary">
                    <span style={{ marginRight: '8px' }}>+</span> Add New Crop
                </Link>
            </div>

            <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)' }}>
                <button
                    className={`btn ${activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ marginRight: '15px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                    onClick={() => setActiveTab('requests')}
                >
                    Incoming Requests
                </button>
                <button
                    className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                    onClick={() => setActiveTab('products')}
                >
                    My Crops
                </button>
            </div>

            {activeTab === 'requests' && (
                <div className="card">
                    <h3 style={{ marginBottom: '20px' }}>Order Requests</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '15px' }}>Product</th>
                                    <th style={{ padding: '15px' }}>Buyer</th>
                                    <th style={{ padding: '15px' }}>Qty</th>
                                    <th style={{ padding: '15px' }}>Make Offer</th>
                                    <th style={{ padding: '15px' }}>Total</th>
                                    <th style={{ padding: '15px' }}>Status</th>
                                    <th style={{ padding: '15px' }}>Payment</th>
                                    <th style={{ padding: '15px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '15px' }}>{req.product_name}</td>
                                        <td style={{ padding: '15px' }}>{req.buyer_name}</td>
                                        <td style={{ padding: '15px' }}>{req.quantity}</td>
                                        <td style={{ padding: '15px' }}>₹{req.offered_price}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>₹{req.total_price}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span className={`badge badge-${req.status}`}>{req.status}</span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <span className={`badge badge-${req.payment_status}`}>{req.payment_status}</span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            {req.status === 'pending' && (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button
                                                        onClick={() => handleRequestAction(req.id, 'accepted')}
                                                        className="btn"
                                                        style={{ backgroundColor: '#2ecc71', color: 'white', padding: '5px 10px', fontSize: '0.8rem' }}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(req.id, 'rejected')}
                                                        className="btn"
                                                        style={{ backgroundColor: '#e74c3c', color: 'white', padding: '5px 10px', fontSize: '0.8rem' }}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {req.status === 'accepted' && <span style={{ color: '#aaa' }}>Awaiting Payment</span>}
                                            {req.status === 'rejected' && <span style={{ color: '#aaa' }}>-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {requests.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>No incoming requests found.</p>}
                </div>
            )}

            {activeTab === 'products' && (
                <div className="grid">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            actionButton={<button onClick={() => deleteProduct(product.id)} className="btn btn-danger" style={{ width: '100%' }}>Delete</button>}
                        />
                    ))}
                    {products.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                            <p style={{ fontSize: '1.2rem', color: '#aaa' }}>You haven't listed any crops yet.</p>
                            <Link to="/add-product" style={{ color: 'var(--primary-green)', marginTop: '10px', display: 'inline-block' }}>Add your first crop</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FarmerDashboard;
