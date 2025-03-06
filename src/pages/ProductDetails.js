import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import '../styles/ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(null);
  const [stockCount, setStockCount] = useState(0);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (product) {
      console.log('Product Data:', product);
      console.log('Images Available:', product.images || product.image);
      const defaultImage = product.images?.[0] || product.image || 'https://via.placeholder.com/400x400?text=No+Image';
      setCurrentImage(defaultImage);
      setStockCount(product.stock !== undefined ? product.stock : 10);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container my-5 text-center">
        <p className="text-danger">Product not found with ID: {id}</p>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  const description = product.description || 'No description available.';
  const specifications = product.specifications || { Detail: 'Not specified' };
  const stockStatus = stockCount > 5 ? 'In-Stock' : stockCount > 0 ? 'Low-Stock' : 'Out-of-Stock';
  const imageList = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://via.placeholder.com/400x400?text=No+Image'];

  const handleAddToCart = () => {
    if (stockCount > 0) {
      addToCart(product);
      setStockCount((prev) => prev - 1);
    }
  };

  const handleBuyNow = () => {
    if (stockCount > 0) {
      addToCart(product);
      setStockCount((prev) => prev - 1);
      navigate('/checkout');
    }
  };

  const handleThumbnailClick = (img) => {
    setCurrentImage(img);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
    setIsZoomVisible(true);
  };

  const handleMouseLeave = () => {
    setIsZoomVisible(false);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="productDetails-wrapper">
      <div className="container py-5">
        <div className="product-layout">
          {/* Image Section */}
          <div className="image-section">
            <div className="thumbnail-orbit">
              {imageList.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail-orb ${img === currentImage ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(img)}
                  style={{ '--orbit-delay': `${index * 0.2}s` }}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/60x60?text=No+Image')}
                  />
                </div>
              ))}
            </div>
            <div className="image-container">
              <div className="main-image-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                {currentImage && (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="main-image"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/400x400?text=No+Image')}
                  />
                )}
                {isZoomVisible && currentImage && (
                  <div className="zoom-lens">
                    <img
                      src={currentImage}
                      alt={`${product.name} zoomed`}
                      style={{
                        transform: `translate(-${zoomPosition.x * 1.5}%, -${zoomPosition.y * 1.5}%)`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="price">₹{Number(product.price).toFixed(2)}</p>
            <p className="category">Category: {product.category}</p>
            <p className={`stock-status ${stockStatus}`}>
              {stockStatus} {stockCount > 0 && `(${stockCount} left)`}
            </p>
            <div className="button-group">
              <button className="btn-add-to-cart" onClick={handleAddToCart} disabled={stockCount <= 0}>
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>
              <button className="btn-buy-now" onClick={handleBuyNow} disabled={stockCount <= 0}>
                <i className="fas fa-bolt"></i> Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="info-card">
              <h3>Product Description</h3>
              <p>{description}</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="info-card">
              <h3>Specifications</h3>
              <ul className="specifications-list">
                {Object.entries(specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="related-title">Related Products</h3>
              <div className="related-stack">
                {relatedProducts.map((related, index) => (
                  <div
                    key={related.id}
                    className="related-product-card"
                    style={{ '--stack-offset': `${index * 10}px` }}
                  >
                    <img
                      src={related.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                      alt={related.name}
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/200x200?text=No+Image')}
                    />
                    <div className="card-body">
                      <h5>{related.name}</h5>
                      <p>₹{Number(related.price).toFixed(2)}</p>
                      <button className="btn-view" onClick={() => navigate(`/product/${related.id}`)}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;