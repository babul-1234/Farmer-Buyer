const db = require('../db');

exports.getSystemStats = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [products] = await db.execute('SELECT COUNT(*) as count FROM products');
        const [orders] = await db.execute('SELECT COUNT(*) as count FROM order_requests');

        res.json({
            users: users[0].count,
            products: products[0].count,
            orders: orders[0].count
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
