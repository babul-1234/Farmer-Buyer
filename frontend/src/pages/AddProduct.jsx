import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', quantity: '', location: '', image_url: ''
    });
    const [suggestion, setSuggestion] = useState(null);
    const navigate = useNavigate();

    const fetchSuggestion = async (name) => {
        if (!name) {
            setSuggestion(null);
            return;
        }
        try {
            const res = await api.get(`/products/price-suggestion?name=${name}`);
            setSuggestion(res.data);
        } catch (err) {
            console.error('Failed to get suggestion');
        }
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData({ ...formData, name });
        // Debounce simple implementation
        setTimeout(() => fetchSuggestion(name), 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            navigate('/farmer-dashboard');
        } catch (err) {
            alert('Failed to add product: ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '40px 20px' }}>
            <div className="card">
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>List New Crop</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Crop Name</label>
                        <input type="text" value={formData.name} onChange={handleNameChange} required placeholder="e.g. Wheat, Basmati Rice" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" required style={{ width: '100%', padding: '10px', backgroundColor: '#2c2c2c', border: '1px solid #333', color: '#fff' }}></textarea>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="form-group">
                            <label>Price (per kg)</label>
                            <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                            {suggestion && suggestion.avg_price !== '0.00' && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '5px' }}>
                                    💡 Market Avg: ₹{suggestion.suggested_price} (Range: {suggestion.min_price}-{suggestion.max_price})
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Quantity Available (kg)</label>
                            <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="text" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://example.com/image.jpg" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Listing</button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
