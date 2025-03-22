import React, { useState } from "react";

const ProductGroupForm: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [mainProduct, setMainProduct] = useState("");
  const [addonProduct, setAddonProduct] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [status, setStatus] = useState(true);
  const [needsTailoring, setNeedsTailoring] = useState(false);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800">New Product Group</h2>
      <p className="text-gray-500 text-sm mb-6">
        Dashboard &gt; Product Groups &gt; New Product Group
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
          />
        </div>

        {/* Main Products */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Main Products <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 mt-1">
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              + Product
            </button>
            <select
              value={mainProduct}
              onChange={(e) => setMainProduct(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Main Product</option>
              <option value="Product1">Product 1</option>
              <option value="Product2">Product 2</option>
            </select>
          </div>
        </div>

        {/* Addon Products */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Addon Products
          </label>
          <div className="flex items-center gap-2 mt-1">
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              + Product
            </button>
            <select
              value={addonProduct}
              onChange={(e) => setAddonProduct(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Addon Product</option>
              <option value="Addon1">Addon 1</option>
              <option value="Addon2">Addon 2</option>
            </select>
          </div>
        </div>

        {/* Color Picker & Toggles */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div
              className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Needs Tailoring
            </label>
            <div
              className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                needsTailoring ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setNeedsTailoring(!needsTailoring)}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform ${
                  needsTailoring ? "translate-x-6" : "translate-x-0"
                } transition`}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded text-gray-500 cursor-not-allowed"
            disabled
          >
            Add Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGroupForm;
