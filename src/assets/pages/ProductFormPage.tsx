import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setItemData } from "../Redux/dataSlice";
import { RootState } from "../Redux/store";
import { useSelector } from "react-redux";


const getItemsData = async () => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getsingleproducts");
  const data = await response.json();
  return data.body;
}

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

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
  const groupTypes = [["Fabric", ["Meter"], ["e.g. Curtains"]], ["Area Based", ["Sq.Feet"], ["e.g. Area Based"]], ["Running Length based", ["Meter", "Feet"], ["e.g. Track, Border cloth"]], ["Piece Based", ["Piece", "Items", "Sets"], ["e.g. Hooks, Tape"]], ["Fixed Length Items", ["Piece"], ["e.g. 12 feet rod"]], ["Fixed Area Items", ["Piece", "Roll"], ["e.g. 57 sq.ft. wallpaper"]], ["Tailoring", ["Parts", "Sq.Feet"], ["e.g. Stitching"]]]
  const [groupType, setGroupType] = useState([]);
  const [showForm, setShowForm] = useState(true);

  const [needsTailoring, setNeedsTailoring] = useState(false);

  const items = useSelector(( state : RootState ) => state.data.items);

  const [selectedGroupType, setSelectedGroupType] = useState("");
  const [sellingUnit, setSellingUnit] = useState("");

  const selectedUnits = groupTypes.find((type) => type[0] === selectedGroupType)?.[1] || [];

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [mrp, setMrp] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [publish, setPublish] = useState(false);
  const [accessory, setAccessory] = useState(false);

  const handleToggle = (field: "publish" | "accessory") => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };


const handleGroupTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selected = e.target.value;
  const matchedGroup = groupTypes.find(([label]) => label == selected);
  if (matchedGroup) {
    setSelectedGroupType(matchedGroup[0]);
    console.log(matchedGroup[0]) // just the label
  } else {
    setSelectedGroupType(""); // fallback
  }
};


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const date = new Date();

  // ✅ Step 1: Get current items (either from Redux or localStorage or by fetching)
  let currentItems = items; // from Redux
  if (!currentItems || currentItems.length === 0) {
    currentItems = await getItemsData(); // fallback to fetch
  }

  // ✅ Step 2: Check for duplicate product name (case-insensitive)
  const productExists = currentItems.some(
    (item: any) => item[0]?.trim().toLowerCase() === productName.trim().toLowerCase()
  );

  if (productExists) {
    alert("Product with this name already exists.");
    return;
  }

  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addnewproduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName,
        description,
        groupTypes: selectedGroupType,
        sellingUnit,
        mrp,
        taxRate,
        date,
        needsTailoring
      })
    });

    if (!response.ok) {
      throw new Error("Failed to save product");
    }

    const result = await response.json();
    console.log("Saved to backend:", result);

    const data = await getItemsData();
    dispatch(setItemData(data));
    localStorage.setItem("itemData", JSON.stringify({ data, time: Date.now() }));
    
    alert("Product saved successfully!");
    navigate("/masters/items");

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
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter Product Name"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
  value={selectedGroupType}
  onChange={handleGroupTypeChange}
  className="w-full p-2 border rounded-md"
  required
>
  <option value="">Select Group Type</option>
  {groupTypes.map(([label, , examples]) => (
    <option key={label} value={label}>
      {label} {examples?.[0] ? `(${examples[0]})` : ""}
    </option>
  ))}
</select>


      </div>

      <div>
        <label className="block font-medium">
          Selling Unit <span className="text-red-500">*</span>
        </label>
        <select
          name="sellingUnit"
          value={sellingUnit}
          onChange={(e) => setSellingUnit(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Select Selling Unit</option>
          {selectedUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">MRP</label>
            <input
              type="text"
              name="mrp"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              placeholder="Enter MRP"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium">Tax Rate (%)</label>
            <input
              type="text"
              name="taxRate"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="Enter Tax Rate"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
          <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Needs Tailoring
                  </label>
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
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
