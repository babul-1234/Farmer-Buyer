import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <header style={{
                textAlign: 'center',
                padding: '100px 20px',
                backgroundImage: 'linear-gradient(rgba(15, 28, 21, 0.85), rgba(15, 28, 21, 0.7)), url("https://images.unsplash.com/photo-1625246333195-5819acf424d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '0 0 50px 50px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <h1 className="hero-title">
                    Direct from <span style={{ color: 'var(--primary-green)' }}>Farm</span> to <span style={{ color: 'var(--accent-gold)' }}>Table</span>
                </h1>
                <p style={{ fontSize: '1.3rem', maxWidth: '700px', marginBottom: '40px', color: '#e0e0e0' }}>
                    AgroConnect empowers farmers to sell directly to buyers, ensuring fair prices and fresh produce. No middlemen, just pure trust.
                </p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>Get Started</Link>
                    <Link to="/login" className="btn btn-secondary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>Login</Link>
                </div>
            </header>

            {/* Stats Section */}
            <section className="container" style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>
                <div className="grid">
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-green)' }}>500+</h3>
                        <p>Trusted Farmers</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-gold)' }}>1000+</h3>
                        <p>Happy Buyers</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', color: '#3498db' }}>100%</h3>
                        <p>Transparency</p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="container" style={{ padding: '80px 20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2.5rem' }}>Why Choose AgroConnect?</h2>
                <div className="grid">
                    <div className="card">
                        <h3 style={{ marginBottom: '15px', color: 'var(--primary-green)' }}>For Farmers</h3>
                        <p>Set your own prices and negotiate directly with buyers. Get paid instantly upon order acceptance via secure channels.</p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '15px', color: 'var(--accent-gold)' }}>For Buyers</h3>
                        <p>Access fresh, organic produce directly from the source. Transparent pricing and quality assurance.</p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '15px', color: '#e74c3c' }}>Secure Payments</h3>
                        <p>Our simulation-safe payment system ensures that you only pay when the order is accepted by the farmer.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section style={{
                backgroundColor: 'var(--card-bg)',
                padding: '80px 20px',
                textAlign: 'center',
                marginTop: '50px',
                borderTop: '1px solid var(--border-color)'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Ready to transform agriculture?</h2>
                <p style={{ marginBottom: '30px' }}>Join thousands of users making a difference today.</p>
                <Link to="/register" className="btn btn-primary" style={{ padding: '12px 30px' }}>Join Now</Link>
            </section>
        </div>
    );
};

export default Home;
