import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();

  const initialFormState = {
    productName: "",
    description: "",
    groupType: "",
    sellingUnit: "",
    mrp: "",
    taxRate: "",
    publish: false,
    accessory: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [savedData, setSavedData] = useState<typeof formData | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (field: "publish" | "accessory") => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("https://your-backend-api.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const result = await response.json();
      setSavedData(formData);
      console.log("Saved to backend:", result);

      alert("Product saved successfully!");
      navigate("/masters/items"); // redirect after success
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(-1); // cancel and go back
  };

  if (!showForm) {
    return (
      <div className="p-6 text-center text-gray-700">
        <p>Form is closed.</p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reopen Form
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
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
            required
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
              required
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
              required
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

        <div className="flex gap-2 justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border !rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white !rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
