import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { fetchProductById, product } = useProductStore(); // Assuming a store or API to fetch product details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      await fetchProductById(id); // Fetch product by ID
      setLoading(false);
    };

    loadProduct();
  }, [id, fetchProductById]);

  if (loading) return <p>ำไๆกหฟๆ...</p>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-white mb-6">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-60 object-cover rounded-lg" />
      <p className="mt-4 text-emerald-400 text-2xl">{product.description}</p>
      <p className="mt-4 text-xl font-semibold text-white">Price: 100 {product.price}</p>
    </div>
  );
};

export default ProductDetail;
