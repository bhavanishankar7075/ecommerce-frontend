import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar'; // Default import
import Home from './pages/Home'; // Default import
import ProductList from './pages/ProductList'; // Default import
import ProductDetails from './pages/ProductDetails'; // Default import
import Cart from './pages/Cart'; // Default import
import Login from './pages/Login'; // Default import
import Signup from './pages/Signup'; // Default import
import Checkout from './pages/Checkout'; // Default import
import Profile from './pages/Profile'; // Default import
import { ProductProvider } from './context/ProductContext'; // Named import
import { CartProvider } from './context/CartContext'; // Named import
import { AuthProvider, useAuth } from './context/AuthContext'; // Named import

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/products"
                element={<PrivateRoute><ProductList /></PrivateRoute>}
              />
              <Route
                path="/product/:id"
                element={<PrivateRoute><ProductDetails /></PrivateRoute>}
              />
              <Route
                path="/cart"
                element={<PrivateRoute><Cart /></PrivateRoute>}
              />
              <Route
                path="/checkout"
                element={<PrivateRoute><Checkout /></PrivateRoute>}
              />
              <Route
                path="/profile"
                element={<PrivateRoute><Profile /></PrivateRoute>}
              />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;