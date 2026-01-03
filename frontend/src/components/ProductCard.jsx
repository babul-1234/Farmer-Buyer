const ProductCard = ({ product, actionButton }) => {
    return (
        <div className="card">
            <div style={{
                height: '200px',
                backgroundColor: '#333',
                backgroundImage: `url(${product.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '4px',
                marginBottom: '15px'
            }}>
                {!product.image_url && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>No Image</div>}
            </div>
            <h3>{product.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ color: '#a0a0a0', fontSize: '0.9rem', margin: 0 }}>{product.location}</p>
                {parseFloat(product.trust_score) > 0 && (
                    <span style={{ fontSize: '0.9rem', color: '#f1c40f' }}>
                        ★ {parseFloat(product.trust_score).toFixed(1)}
                    </span>
                )}
            </div>
            <p style={{ marginBottom: '10px' }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ecc71' }}>₹{product.price}/kg</span>
                <span>Qty: {product.quantity}kg</span>
            </div>
            {actionButton}
        </div>
    );
};

export default ProductCard;
