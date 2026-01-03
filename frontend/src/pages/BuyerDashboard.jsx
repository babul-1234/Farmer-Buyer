import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const BuyerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('marketplace');

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchRequests();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await api.get('/orders/requests/buyer');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const requestOrder = async (product) => {
        const qtyStr = prompt(`Enter quantity (kg) for ${product.name} (Available: ${product.quantity}kg):`);
        if (!qtyStr) return;
        const quantity = parseInt(qtyStr);

        if (isNaN(quantity) || quantity <= 0 || quantity > product.quantity) {
            alert('Invalid quantity');
            return;
        }

        const offerStr = prompt(`Enter your offer price per kg (Current Unit Price: ₹${product.price}):`, product.price);
        if (!offerStr) return;
        const offered_price = parseFloat(offerStr);

        if (isNaN(offered_price) || offered_price <= 0) {
            alert('Invalid price');
            return;
        }

        try {
            await api.post('/orders/request', { product_id: product.id, quantity, offered_price });
            alert('Request sent to farmer! Check "My Requests" for status.');
            fetchRequests();
            setActiveTab('requests');
        } catch (err) {
            alert(err.response?.data?.message || 'Request failed');
        }
    };

    const handlePayClick = (request) => {
        setSelectedRequest(request);
        setShowPaymentModal(true);
    };

    const processPayment = async () => {
        if (!selectedRequest) return;
        try {
            await api.put(`/orders/request/${selectedRequest.id}/pay`, { payment_method: paymentMethod });
            alert('Payment Successful! Order marked as Paying/Paid.');
            setShowPaymentModal(false);
            fetchRequests();
        } catch (err) {
            alert('Payment failed');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem' }}>Buyer Marketplace</h2>
                <input
                    type="text"
                    placeholder="Search crops or location..."
                    style={{ padding: '12px', width: '300px' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)' }}>
                <button
                    className={`btn ${activeTab === 'marketplace' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ marginRight: '15px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                    onClick={() => setActiveTab('marketplace')}
                >
                    Marketplace
                </button>
                <button
                    className={`btn ${activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                    onClick={() => setActiveTab('requests')}
                >
                    My Requests
                </button>
            </div>

            {activeTab === 'marketplace' && (
                <div className="grid">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            actionButton={
                                product.quantity > 0 ?
                                    <button onClick={() => requestOrder(product)} className="btn btn-primary" style={{ width: '100%' }}>Request Order</button> :
                                    <button disabled className="btn" style={{ width: '100%', backgroundColor: '#555', cursor: 'not-allowed' }}>Out of Stock</button>
                            }
                        />
                    ))}
                    {filteredProducts.length === 0 && <p className="text-secondary">No products found.</p>}
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="card">
                    <h3 style={{ marginBottom: '20px' }}>My Order Requests</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '15px' }}>Product</th>
                                    <th style={{ padding: '15px' }}>Farmer</th>
                                    <th style={{ padding: '15px' }}>Qty</th>
                                    <th style={{ padding: '15px' }}>Offer/kg</th>
                                    <th style={{ padding: '15px' }}>Total</th>
                                    <th style={{ padding: '15px' }}>Request Status</th>
                                    <th style={{ padding: '15px' }}>Payment</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '15px' }}>{req.product_name}</td>
                                        <td style={{ padding: '15px' }}>{req.farmer_name}</td>
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
                                            {req.status === 'accepted' && req.payment_status === 'pending' && (
                                                <button
                                                    onClick={() => handlePayClick(req)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '5px 15px', fontSize: '0.9rem' }}
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                            {req.payment_status === 'paid' && (
                                                <button
                                                    onClick={() => navigate('/invoice', { state: { order: req } })}
                                                    className="btn"
                                                    style={{ padding: '5px 15px', fontSize: '0.9rem', backgroundColor: '#3498db', color: 'white' }}
                                                >
                                                    Invoice
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {requests.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>No requests made yet.</p>}
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedRequest && (
                <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '20px', color: 'var(--primary-green)' }}>Complete Payment</h3>
                        <p style={{ marginBottom: '10px' }}><strong>Product:</strong> {selectedRequest.product_name}</p>
                        <p style={{ marginBottom: '20px' }}><strong>Total Amount:</strong> ₹{selectedRequest.total_price}</p>

                        <div className="form-group">
                            <label>Payment Method</label>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                <option value="upi">UPI (GPay/PhonePe/Paytm)</option>
                                <option value="cod">Cash on Delivery</option>
                            </select>
                        </div>

                        {paymentMethod === 'upi' && (
                            <div style={{ padding: '15px', backgroundColor: '#333', borderRadius: '6px', marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Scan QR Code or Use UPI ID:</p>
                                <p style={{ fontFamily: 'monospace', color: 'var(--accent-gold)', marginTop: '5px' }}>agroconnect@upi</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                            <button onClick={processPayment} className="btn btn-primary" style={{ flex: 1 }}>Confirm Payment</button>
                            <button onClick={() => setShowPaymentModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerDashboard;
