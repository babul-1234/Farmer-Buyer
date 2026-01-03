import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import Invoice from './pages/Invoice';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/farmer-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['farmer']}>
                            <FarmerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add-product"
                    element={
                        <ProtectedRoute allowedRoles={['farmer']}>
                            <AddProduct />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/buyer-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['buyer']}>
                            <BuyerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/invoice"
                    element={
                        <ProtectedRoute allowedRoles={['buyer', 'farmer', 'admin']}>
                            <Invoice />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
