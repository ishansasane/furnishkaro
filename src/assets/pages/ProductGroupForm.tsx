import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { setProducts } from "../Redux/dataSlice";
import { Link } from "react-router-dom";

async function fetchProductGroups() {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getallproductgroup", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
  } catch (error) {
    console.error("Error fetching product groups:", error);
    return [];
  }
}

const ProductGroupForm: React.FC = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [mainProduct, setMainProduct] = useState("");
  const [addonProducts, setAddonProducts] = useState<string[]>([]);
  const [status, setStatus] = useState(false);

  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.data.items);

  const handleAddonChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions)
      .map(option => option.value)
      .filter(value => value && !addonProducts.includes(value)); // Prevent duplicates
    setAddonProducts(prev => {
      const updated = [...new Set([...prev, ...selectedOptions])];
      console.log("Updated addonProducts:", updated); // Debug
      return updated;
    });
  }, [addonProducts]);

  const handleAddGroup = async () => {
    // Validate required fields
    if (!groupName || !mainProduct) {
      alert("Please fill in all required fields: Group Name and Main Product.");
      return;
    }

    const groupData = {
      group_name: groupName,
      main_product: mainProduct,
      addon_products: addonProducts.length > 0 ? addonProducts : [],
      status,
      // Add additional fields if required by the backend, e.g.:
      // category: "default", // Uncomment and adjust if needed
    };

    console.log("Group Data to Submit:", groupData); // Debug
    console.log("Raw addonProducts state:", addonProducts); // Debug

    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addproductgroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(groupData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save product group. Status: ${response.status}, Message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Saved Group:", result);
      
      // Re-fetch the updated product groups
      const data = await fetchProductGroups();
      
      // Update Redux store
      dispatch(setProducts(data));
      
      // Update localStorage
      localStorage.setItem("productGroupData", JSON.stringify({ data, time: Date.now() }));
      
      // Alert and navigate
      alert("Product Group saved successfully!");
      navigate("/masters/product-groups");
      
    } catch (error: any) {
      console.error("Error saving product group:", {
        message: error.message,
        stack: error.stack,
      });
      if (error.message.includes("Failed to fetch")) {
        alert("Failed to save product group: Unable to connect to the server (possible timeout or network issue). Please check your network connection and try again.");
      } else if (error.message.includes("Status: 400")) {
        alert(`Failed to save product group: Invalid data submitted. The server requires all fields to be filled correctly. Error: ${error.message}. Please check the console for details.`);
      } else {
        alert(`Failed to save product group: ${error.message}. Please check the console for details and try again.`);
      }
    }
  };

  // Filter out selected addon products and main product to avoid duplicates
  const availableAddonProducts = items.filter(item => 
    !addonProducts.includes(item[0]) && item[0] !== mainProduct
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800">New Product Group</h2>
      <p className="text-gray-500 text-sm mb-6">
        <Link className="text-black !no-underline" to="/">Dashboard</Link> {' > '} 
        <Link className="text-black !no-underline" to="/masters/product-groups">Product Groups</Link> {' > '} 
        New Product Group
      </p>

      {/* Form */}
      <div className="space-y-4">
        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter Product Name"
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Main Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Main Product <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={() => navigate("/add-product")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              + Product
            </button>
            <select
              value={mainProduct}
              onChange={(e) => setMainProduct(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Select Main Product</option>
              {items.map((item, index) => (
                <option key={index} value={item[0]}>
                  {item[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Addon Products */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Addon Products
          </label>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={() => navigate("/add-product")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              + Product
            </button>
            <select
              multiple
              value={addonProducts}
              onChange={handleAddonChange}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              size={5}
            >
              <option value="" disabled>Select Addon Product</option>
              {availableAddonProducts.map((item, index) => (
                <option key={index} value={item[0]}>
                  {item[0]}
                </option>
              ))}
            </select>
          </div>
          {/* Display selected addon products */}
          {addonProducts.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Selected Addon Products:</p>
              <ul className="list-disc pl-5">
                {addonProducts.map((product, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {product}
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => {
                        const updated = addonProducts.filter(p => p !== product);
                        setAddonProducts(updated);
                        console.log("Removed product, new addonProducts:", updated); // Debug
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Status Toggle */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                status ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setStatus(!status)}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform ${
                  status ? "translate-x-6" : "translate-x-0"
                } transition`}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={() => navigate("/masters/product-groups")} className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleAddGroup}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGroupForm;