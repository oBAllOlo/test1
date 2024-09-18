import { useState } from "react";
import toast from "react-hot-toast";
import { ShoppingCart, X } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { formatToThaiBaht } from "../lib/utils.js";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      addToCart(product);
    }
  };

  // Function to open and close popup
  const handleDetailClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
        <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
          <img
            className="object-cover w-full"
            src={product.image}
            alt="product image"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>

        <div className="mt-4 px-5 pb-5">
          <h5 className="text-xl font-semibold tracking-tight text-white">
            {product.name}
          </h5>
          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-3xl font-bold text-emerald-400">
                {formatToThaiBaht(product.price)}
              </span>
            </p>
          </div>
          <div className="flex space-x-4">
            {/* Detail Button */}
            <button
              className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              onClick={handleDetailClick} // Open popup on detail click
            >
              Detail
            </button>
            <button
              className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={22} className="mr-2" />
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {/* Popup modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={handleClosePopup} // Close popup
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-emerald-400 mb-4">
              {product.name}
            </h2>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <p className="text-white mb-4">{product.description}</p>
            <p className="text-emerald-400 text-xl font-bold mb-4">
              {formatToThaiBaht(product.price)}
            </p>
            <button
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md w-full"
              onClick={() => {
                handleAddToCart();
                handleClosePopup();
              }}
            >
              Add to Cart
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
