import { useLocation } from 'react-router-dom';

const Invoice = () => {
    const { state } = useLocation();
    const order = state?.order;

    if (!order) return <p style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>No order details found.</p>;

    return (
        <div className="container" style={{ padding: '50px 0', color: 'black' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', maxWidth: '800px', margin: '0 auto', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
                    <div>
                        <h1 style={{ color: '#2ecc71', margin: 0 }}>AgroConnect</h1>
                        <p style={{ margin: '5px 0' }}>Direct Farm to Table</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ margin: 0 }}>INVOICE</h2>
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <p>Order ID: #{order.id}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div>
                        <h3>Bill To:</h3>
                        <p>Buyer ID: {order.buyer_id}</p>
                        <p>Payment Method: {order.payment_method?.toUpperCase() || 'N/A'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h3>Supplier:</h3>
                        <p>{order.farmer_name || 'Farmer John'}</p>
                        <p>AgroConnect Verified Farmer</p>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Item</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Quantity</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Unit Price</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>{order.product_name}</td>
                            <td style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{order.quantity} kg</td>
                            <td style={{ padding: '15px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>₹{order.offered_price}</td>
                            <td style={{ padding: '15px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>₹{order.total_price}</td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <p>Grand Total: ₹{order.total_price}</p>
                </div>

                <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                    <p>Thank you for your business!</p>
                    <button onClick={() => window.print()} className="btn btn-primary" style={{ marginTop: '20px' }}>Print Invoice</button>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
