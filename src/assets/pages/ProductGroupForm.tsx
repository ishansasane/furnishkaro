import React, { useState } from "react";
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
  const [addonProduct, setAddonProduct] = useState<string[]>([]);
  const [color, setColor] = useState("#ffffff");
  const [status, setStatus] = useState(false);
  const [needsTailoring, setNeedsTailoring] = useState(false);

  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.data.items);

  const handleAddGroup = async () => {
    const groupData = {
      groupName,
      mainProduct,
      addonProduct,
      status,
    };

    console.log("Group Data to Submit:", groupData);

    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addproductgroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ groupName, mainProducts: mainProduct, addonProducts: addonProduct, status })
      });

      if (!response.ok) {
        throw new Error("Failed to save product group");
      }
      
      const result = await response.json();
      console.log("Saved Group:", result);
      
      const data = await fetchProductGroups();
      dispatch(setProducts(data));
      localStorage.setItem("productGroupData", JSON.stringify({ data, time: Date.now() }));
      
      alert("Product Group saved successfully!");
      navigate("/masters/product-groups");
      
    } catch (error) {
      console.error("Error saving product group:", error);
      alert("Failed to save product group. Please try again.");
    }
  };

  const handleAddonProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setAddonProduct(selectedOptions);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">New Product Group</h2>
      <p className="text-gray-500 text-sm mb-6">
        <Link className="text-black !no-underline" to="/">Dashboard</Link> &gt; <Link className="text-black !no-underline" to="/masters/product-groups">Product Groups</Link> &gt; New Product Group
      </p>

      <div className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Main Products <span className="text-red-500">*</span>
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
              <option value="">Select Main Product</option>
              {items.map((item, index) => (
                <option key={index} value={item[0]}>
                  {item[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

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
              value={addonProduct}
              onChange={handleAddonProductChange}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-32"
            >
              <option value="">Select Addon Products</option>
              {items.map((item, index) => (
                <option key={index} value={item[0]}>
                  {item[0]}
                </option>
              ))}
            </select>
          </div>
          {addonProduct.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {addonProduct.join(", ")}
            </p>
          )}
        </div>

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