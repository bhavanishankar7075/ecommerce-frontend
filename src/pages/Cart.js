import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);
  const deliveryFee = 5.00;
  const discountedSubtotal = subtotal * (1 - discount);
  const finalTotal = discountedSubtotal + deliveryFee;

  // Redirect to products if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      setTimeout(() => navigate('/products'), 5000);
    }
  }, [cart, navigate]);

  // Quantity controls
  const handleIncrease = (id, currentQuantity) => updateQuantity(id, currentQuantity + 1);
  const handleDecrease = (id, currentQuantity) => {
    if (currentQuantity > 1) updateQuantity(id, currentQuantity - 1);
  };

  // Coupon logic
  const applyCoupon = () => {
    if (coupon === 'SAVE10') {
      setDiscount(0.1);
      setError('');
    } else {
      setDiscount(0);
      setError('Invalid coupon code');
    }
  };

  return (
    <div className="cart-wrapper py-5 my-4">
      <h1 className="cart-header">Your Cosmic Cart</h1>
      {cart.length > 0 ? (
        <>
          <div className="cart-table">
            {cart.map((item) => {
              const price = Number(item.price) || 0;
              return (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h5>{item.name}</h5>
                    <p>Price: ₹{price.toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleDecrease(item.id, item.quantity)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncrease(item.id, item.quantity)}>+</button>
                    </div>
                    <p>Subtotal: ₹{(price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          {/* Coupon Section */}
          <div className="coupon-section">
            <input
              type="text"
              placeholder="Enter cosmic coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="coupon-input"
            />
            <button className="btn-apply-coupon" onClick={applyCoupon}>
              Apply Coupon
            </button>
            {error && <p className="error-message">{error}</p>}
            {discount > 0 && <p className="success-message">Cosmic discount: 10% off</p>}
          </div>
          {/* Total Section */}
          <div className="total-section">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="total-row discount-row">
                <span>Discount (10%)</span>
                <span>-₹{(subtotal * discount).toFixed(2)}</span>
              </div>
            )}
            <div className="total-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="total-row final-total">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
          {/* Restored Clear Cart Button */}
          <button className="btn-clear-cart" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="btn-checkout" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </>
      ) : (
        <div className="empty-cart">
          <img
            src="https://img.freepik.com/premium-vector/shopping-ecommerce-graphic-design-with-icons_24911-20665.jpg"
            alt="Empty Cart"
            className="empty-cart-img"
          />
          <p>Your cart is empty. Explore the cosmos!</p>
          <button className="btn-shop" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;