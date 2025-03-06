import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/products')
      .then((res) => {
        const fetchedProducts = res.data.map((item) => ({
          id: item.id,
          name: item.name || item.title.slice(0, 10),
          price: Number(item.price) || Math.floor(Math.random() * 1000) + 50,
          stock: item.stock === undefined ? true : Boolean(Number(item.stock) > 0), // Convert to boolean
          image: item.image || item.thumbnailUrl || 'https://via.placeholder.com/150',
          category: item.category || 'Uncategorized',
          featured: item.featured || false,
          specifications:item.specifications,
          description:item.description,
          images:item.images
        }));
        console.log('Fetched and processed products:', fetchedProducts); // Debugging
        setProducts(fetchedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);