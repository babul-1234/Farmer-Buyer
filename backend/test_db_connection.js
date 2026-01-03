const db = require('./db');

async function testConnection() {
    try {
        console.log('Attempting to connect to database...');
        const [rows] = await db.execute('SELECT 1');
        console.log('Connection successful: ', rows);

        console.log('Checking for users table...');
        const [tables] = await db.execute("SHOW TABLES LIKE 'users'");
        if (tables.length > 0) {
            console.log('Users table exists.');
        } else {
            console.log('Users table DOES NOT exist.');
        }

    } catch (error) {
        console.error('Database connection failed:', error.message);
        if (error.code) console.error('Error Code:', error.code);
    } finally {
        process.exit();
    }
}

testConnection();
