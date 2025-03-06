import { Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

function Navigation() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom   fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">E-Shop</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav main-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">Products</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    Cart
                    {cartCount > 0 && (
                      <span className="cart-badge ms-1">{cartCount}</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/checkout">Checkout</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav auth-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link welcome-text">
                    Welcome, {user.username}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="nav-link logout-btn" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;