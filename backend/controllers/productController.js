const db = require('../db');

// Get all products (with optional filter)
// Get all products (with Smart Search)
exports.getAllProducts = async (req, res) => {
    const { search } = req.query;
    try {
        let query = `
            SELECT p.*, u.name as farmer_name, COALESCE(AVG(r.rating), 0) as trust_score
            FROM products p
            JOIN users u ON p.farmer_id = u.id
            LEFT JOIN reviews r ON p.farmer_id = r.farmer_id
        `;
        const params = [];

        if (search) {
            query += ' WHERE p.name LIKE ? OR p.location LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' GROUP BY p.id ORDER BY p.created_at DESC';

        const [products] = await db.execute(query, params);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get products by farmer
exports.getMyProducts = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE farmer_id = ?', [req.user.id]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add product
exports.addProduct = async (req, res) => {
    const { name, description, price, quantity, location, image_url } = req.body;

    console.log('Add Product Request:', req.body);
    console.log('User Role:', req.user.role);

    if (req.user.role !== 'farmer') {
        return res.status(403).json({ message: 'Only farmers can add products' });
    }

    try {
        await db.execute(
            'INSERT INTO products (farmer_id, name, description, price, quantity, location, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, name, description, price, quantity, location, image_url]
        );
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM products WHERE id = ? AND farmer_id = ?', [id, req.user.id]);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Price Suggestion Logic
exports.getPriceSuggestion = async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: 'Crop name required' });

    try {
        const [rows] = await db.execute(
            'SELECT AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price FROM products WHERE name LIKE ?',
            [`%${name}%`]
        );

        const suggestion = rows[0];
        res.json({
            suggested_price: suggestion.avg_price ? parseFloat(suggestion.avg_price).toFixed(2) : '0.00',
            min_price: suggestion.min_price || 0,
            max_price: suggestion.max_price || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
