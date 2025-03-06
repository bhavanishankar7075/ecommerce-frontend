import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

function Checkout() {
  const { cart, updateQuantity, clearCart } = useCart(); // Assume CartContext has updateQuantity and clearCart
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load form data from local storage on mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('checkoutForm')) || {};
    setFormData((prev) => ({ ...prev, ...savedData }));
  }, []);

  // Save form data to local storage on change
  useEffect(() => {
    localStorage.setItem('checkoutForm', JSON.stringify(formData));
    const filledFields = Object.values(formData).filter(Boolean).length;
    setProgress((filledFields / 5) * 100); // 5 fields total
  }, [formData]);

  // Calculate total in real-time
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      clearCart();
      localStorage.removeItem('checkoutForm');
      alert('Order placed successfully!');
      navigate('/products');
    }, 2000); // Delay for animation
  };

  return (
    <div className="checkout-wrapper py-5">   
      <div className="orbital-container">
        <h1 className="checkout-title">Cosmic Checkout</h1>

        {/* Progress Ring */}
        <div className="progress-ring">
          <svg className="progress-circle" width="120" height="120">
            <circle
              className="progress-circle-bg"
              cx="60"
              cy="60"
              r="50"
              strokeWidth="10"
            />
            <circle
              className="progress-circle-fill"
              cx="60"
              cy="60"
              r="50"
              strokeWidth="10"
              style={{ strokeDashoffset: `${314 - (314 * progress) / 100}` }} // 314 = 2 * π * 50
            />
          </svg>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>

        {/* Cart Orbit */}
        <div className="cart-orbit">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="cart-planet">
                <img src={item.image} alt={item.name} className="planet-img" />
                <div className="planet-info">
                  <p>{item.name}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-cart">Your cart is a void!</p>
          )}
        </div>

        {/* Form Nebula */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3 className="form-section">Shipping Nebula</h3>
          <div className="input-orbit">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              className="form-input"
            />
          </div>
          <div className="input-orbit">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
              className="form-input"
            />
          </div>

          <h3 className="form-section">Payment Galaxy</h3>
          <div className="input-orbit">
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="Card Number"
              required
              className="form-input"
            />
          </div>
          <div className="input-orbit dual-orbit">
            <input
              type="text"
              name="expiry"
              value={formData.expiry}
              onChange={handleInputChange}
              placeholder="Expiry (MM/YY)"
              required
              className="form-input half"
            />
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="CVV"
              required
              className="form-input half"
            />
          </div>

          {/* Total and Submit */}
          <div className="total-pod">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <button type="submit" className="submit-btn" disabled={cart.length === 0 || isSubmitted}>
            {isSubmitted ? 'Launching...' : 'Launch Order'}
          </button>
        </form>

        {/* Submission Animation */}
        {isSubmitted && <div className="particle-burst"></div>}
      </div>
    </div>
  );
}

export default Checkout;