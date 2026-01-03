const db = require('../db');

exports.addReview = async (req, res) => {
    const { farmer_id, rating, comment } = req.body;
    const buyer_id = req.user.id;

    try {
        await db.execute(
            'INSERT INTO reviews (farmer_id, buyer_id, rating, comment) VALUES (?, ?, ?, ?)',
            [farmer_id, buyer_id, rating, comment]
        );
        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getFarmerReviews = async (req, res) => {
    const { id } = req.params; // Farmer ID
    try {
        const [reviews] = await db.execute(`
            SELECT r.*, u.name as buyer_name 
            FROM reviews r 
            JOIN users u ON r.buyer_id = u.id 
            WHERE r.farmer_id = ? 
            ORDER BY r.created_at DESC`,
            [id]
        );

        // Calculate Trust Score (Average Rating)
        const [avg] = await db.execute('SELECT AVG(rating) as score FROM reviews WHERE farmer_id = ?', [id]);
        const trustScore = avg[0].score ? parseFloat(avg[0].score).toFixed(1) : 0;

        res.json({ reviews, trustScore });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
