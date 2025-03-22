import { useState } from "react";

const ProductFormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    groupType: "",
    sellingUnit: "",
    mrp: "",
    taxRate: "",
    publish: false,
    accessory: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (field: "publish" | "accessory") => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
      <form className="space-y-4">
        <div>
          <label className="block font-medium">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter Product Name"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">
              Group Type <span className="text-red-500">*</span>
            </label>
            <select
              name="groupType"
              value={formData.groupType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Group Type</option>
              <option value="type1">Type 1</option>
              <option value="type2">Type 2</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">
              Selling Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="sellingUnit"
              value={formData.sellingUnit}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Selling Unit</option>
              <option value="unit1">Unit 1</option>
              <option value="unit2">Unit 2</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">MRP</label>
            <input
              type="text"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              placeholder="Enter MRP"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium">Tax Rate</label>
            <input
              type="text"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              placeholder="Enter Tax Rate"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <label className="font-medium">Publish</label>
            <input
              type="checkbox"
              checked={formData.publish}
              onChange={() => handleToggle("publish")}
              className="w-5 h-5"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="font-medium">Accessory</label>
            <input
              type="checkbox"
              checked={formData.accessory}
              onChange={() => handleToggle("accessory")}
              className="w-5 h-5"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" className="px-4 py-2 border rounded-md">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
