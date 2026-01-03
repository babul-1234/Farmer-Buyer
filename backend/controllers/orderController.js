const db = require('../db');

// Place Order (Legacy - Direct Buy)
exports.placeOrder = async (req, res) => {
    const { product_id, quantity } = req.body;

    try {
        // Check product availability
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [product_id]);
        if (products.length === 0) return res.status(404).json({ message: 'Product not found' });

        const product = products[0];
        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity' });
        }

        const totalPrice = product.price * quantity;

        // Create order
        await db.execute(
            'INSERT INTO orders (buyer_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, product_id, quantity, totalPrice, 'pending']
        );

        // Update product quantity
        await db.execute('UPDATE products SET quantity = quantity - ? WHERE id = ?', [quantity, product_id]);

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Orders for Buyer (Legacy)
exports.getBuyerOrders = async (req, res) => {
    try {
        const [orders] = await db.execute(`
      SELECT o.id, p.name as product_name, p.image_url, o.quantity, o.total_price, o.status, o.created_at 
      FROM orders o 
      JOIN products p ON o.product_id = p.id 
      WHERE o.buyer_id = ?`, [req.user.id]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Orders for Farmer (Legacy)
exports.getFarmerOrders = async (req, res) => {
    try {
        const [orders] = await db.execute(`
      SELECT o.id, u.name as buyer_name, p.name as product_name, o.quantity, o.total_price, o.status, o.created_at 
      FROM orders o 
      JOIN products p ON o.product_id = p.id 
      JOIN users u ON o.buyer_id = u.id 
      WHERE p.farmer_id = ?`, [req.user.id]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// --- NEW: Order Request & Negotiation Flow ---

// Create Order Request
exports.createRequest = async (req, res) => {
    const { product_id, quantity, offered_price } = req.body;
    const buyer_id = req.user.id; // From authMiddleware

    try {
        const total_price = offered_price * quantity;

        await db.execute(
            'INSERT INTO order_requests (buyer_id, product_id, quantity, offered_price, total_price, status) VALUES (?, ?, ?, ?, ?, ?)',
            [buyer_id, product_id, quantity, offered_price, total_price, 'pending']
        );

        res.status(201).json({ message: 'Order request sent to farmer!' });
    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Requests for Buyer
exports.getBuyerRequests = async (req, res) => {
    try {
        const [requests] = await db.execute(`
            SELECT r.*, p.name as product_name, p.image_url, u.name as farmer_name 
            FROM order_requests r
            JOIN products p ON r.product_id = p.id
            JOIN users u ON p.farmer_id = u.id
            WHERE r.buyer_id = ?
            ORDER BY r.created_at DESC
        `, [req.user.id]);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Requests for Farmer (Incoming)
exports.getFarmerRequests = async (req, res) => {
    try {
        const [requests] = await db.execute(`
            SELECT r.*, p.name as product_name, u.name as buyer_name 
            FROM order_requests r
            JOIN products p ON r.product_id = p.id
            JOIN users u ON r.buyer_id = u.id
            WHERE p.farmer_id = ?
            ORDER BY r.created_at DESC
        `, [req.user.id]);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Request Status (Accept/Reject)
exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // Get request details
        const [requests] = await db.execute('SELECT * FROM order_requests WHERE id = ?', [id]);
        if (requests.length === 0) return res.status(404).json({ message: 'Request not found' });
        const request = requests[0];

        if (status === 'accepted') {
            // Check Inventory
            const [products] = await db.execute('SELECT quantity FROM products WHERE id = ?', [request.product_id]);
            if (products.length === 0) return res.status(404).json({ message: 'Product not found' });

            if (products[0].quantity < request.quantity) {
                return res.status(400).json({ message: 'Insufficient stock to accept this order' });
            }

            // Deduct Stock
            await db.execute('UPDATE products SET quantity = quantity - ? WHERE id = ?', [request.quantity, request.product_id]);

            // Notification for Buyer
            await db.execute(
                'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
                [request.buyer_id, `Your order request for ${request.quantity}kg was ACCEPTED! Proceed to payment.`, 'success']
            );
        } else {
            // Notification for Buyer (Rejected)
            await db.execute(
                'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
                [request.buyer_id, `Your order request was REJECTED by the farmer.`, 'danger']
            );
        }

        await db.execute('UPDATE order_requests SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Request ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Process Payment (Simulated)
exports.processPayment = async (req, res) => {
    const { id } = req.params;
    const { payment_method } = req.body; // 'cod' or 'upi'

    try {
        const [requests] = await db.execute('SELECT * FROM order_requests WHERE id = ?', [id]);
        if (requests.length === 0) return res.status(404).json({ message: 'Request not found' });
        const request = requests[0];

        // Retrieve Farmer ID (via Product)
        const [products] = await db.execute('SELECT farmer_id FROM products WHERE id = ?', [request.product_id]);
        const farmer_id = products[0].farmer_id;

        await db.execute(
            'UPDATE order_requests SET payment_status = ?, payment_method = ? WHERE id = ?',
            ['paid', payment_method, id]
        );

        // Notification for Farmer
        await db.execute(
            'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
            [farmer_id, `Payment received (${payment_method.toUpperCase()}) for Order #${id}.`, 'success']
        );

        res.json({ message: 'Payment successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
