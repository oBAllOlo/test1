import { motion } from "framer-motion";
import { Trash, Star, Edit } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";
import { categories } from "../components/categoriesname";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, updateProduct, products } =
    useProductStore();
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    price: "",
    category: "",
  });

  const handleToggleFeatured = async (productId) => {
    try {
      setLoadingProductId(productId);
      await toggleFeaturedProduct(productId);
    } catch (error) {
      console.error("Error toggling featured product:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoadingProductId(productId);
      await deleteProduct(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditedProduct({
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

  const handleSaveProduct = async (productId) => {
    try {
      setLoadingProductId(productId);
      await updateProduct(productId, editedProduct);
      setEditingProductId(null); // Exit editing mode after save
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Featured
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700">
              {editingProductId === product._id ? (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="text-sm text-gray-900 p-2 rounded"
                      type="text"
                      value={editedProduct.name}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="text-sm text-gray-900 p-2 rounded"
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          price: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Use select for category selection */}
                    <select
                      className="text-sm text-gray-900 p-2 rounded"
                      value={editedProduct.category}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(product._id)}
                      className={`p-1 rounded-full ${
                        product.isFeatured
                          ? "bg-yellow-400 text-gray-900"
                          : "bg-gray-600 text-gray-300"
                      } hover:bg-yellow-500 transition-colors duration-200`}
                      disabled={loadingProductId === product._id}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleSaveProduct(product._id)}
                      className="text-green-400 hover:text-green-300"
                      disabled={loadingProductId === product._id}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProductId(null)}
                      className="text-yellow-400 hover:text-yellow-300 ml-2"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.image ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                            {product.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      ${product.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(product._id)}
                      className={`p-1 rounded-full ${
                        product.isFeatured
                          ? "bg-yellow-400 text-gray-900"
                          : "bg-gray-600 text-gray-300"
                      } hover:bg-yellow-500 transition-colors duration-200`}
                      disabled={loadingProductId === product._id}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-400 hover:text-blue-300 mr-2"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-400 hover:text-red-300"
                      disabled={loadingProductId === product._id}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
