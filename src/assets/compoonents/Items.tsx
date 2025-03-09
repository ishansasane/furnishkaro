import { useState } from "react";
import { MoreVertical, ChevronLast, ChevronFirst, LayoutDashboard, Briefcase, Users, ClipboardList, ListChecks, FileText, Settings, ChevronDown } from "lucide-react";

const Items = () => {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [items, setItems] = useState([]);

  const [openMenu, setOpenMenu] = useState(null); // Track which dropdown is open

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const groupOptions = [
    "Fabric",
    "Area Based",
    "Running length based",
    "Piece based",
    "Fixed length items",
    "Fixed area items",
    "Tailoring"
  ];

  const sellingUnits = {
    "Fabric": ["Meter"],
    "Area Based": ["Sq. feet", "Sq. meter"],
    "Running length based": ["Meter", "Feet"],
    "Piece based": ["Piece", "Items", "Sets"],
    "Fixed length items": ["Piece"],
    "Fixed area items": ["Piece", "Roll"],
    "Tailoring": ["Parts", "Sq. feet"]
  };

  const additionalFields = {
    "Fabric": ["Coverage in Width", "Wastage in Height", "Threshold For Parts Calculation"],
    "Area Based": ["Coverage in Area"],
    "Running length based": [],
    "Piece based": [],
    "Fixed length items": ["Length of Item"],
    "Fixed area items": ["Area Covered"],
    "Tailoring": []
  };

  const sideDropdownOptions = {
    "Fabric": ["Inch", "Centimeter", "Meter"],
    "Area Based": ["Sq. Feet", "Sq. Meter"],
    "Running length based": [],
    "Piece based": [],
    "Fixed length items": ["Meter", "Inch", "Centimeter", "Feet"],
    "Fixed area items": ["Sq. Feet", "Sq. Meter"],
    "Tailoring": []
  };

  

  const [formData, setFormData] = useState({
    productName: "",
    productDetails: "",
    groupType: "",
    sellingUnit: "",
    mrp: "",
    taxRate: "",
    additionalInputs: {},
    sideDropdown: ""
  });

  const handleGroupChange = (e) => {
    const selectedGroup = e.target.value;
    setFormData({
      ...formData,
      groupType: selectedGroup,
      sellingUnit: sellingUnits[selectedGroup]?.[0] || "",
      additionalInputs: additionalFields[selectedGroup]
        ? additionalFields[selectedGroup].reduce((acc, field) => ({ ...acc, [field]: "" }), {})
        : {},
      sideDropdown: sideDropdownOptions[selectedGroup]?.[0] || ""
    });
  };

  const handleAdditionalInputChange = (field, value) => {
    setFormData({
      ...formData,
      additionalInputs: { ...formData.additionalInputs, [field]: value }
    });
  };

  const handleSubmit = () => {
    const newItem = {
      id: items.length + 1,
      name: formData.productName,
      description: formData.productDetails,
      costingType: formData.sellingUnit,
      groupType: formData.groupType,
      entryDate: new Date().toLocaleDateString(),
      additionalInputs: formData.additionalInputs,
      sideDropdown: formData.sideDropdown
    };
  
    setItems([...items, newItem]);
    setIsFormOpen(false);
  
    // Reset form fields
    setFormData({
      productName: "",
      productDetails: "",
      groupType: "",
      sellingUnit: "",
      mrp: "",
      taxRate: "",
      additionalInputs: {},
      sideDropdown: ""
    });
  };
  

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-5">
          {isFormOpen && (
            <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
              <ChevronFirst />
            </button>
          )}
          <h1 className="text-2xl font-semibold">Items</h1>
          </div>
          <div className="flex items-center gap-5">
          <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            More Options
          </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">Import Product</a></li>
              <li><a className="dropdown-item" href="#">Export Product</a></li>
             </ul>
          </div>

          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setIsFormOpen(true)}>
            <i className="fas fa-plus"></i> + Add Item
          </button>
        </div>
          </div>
          

        {isFormOpen && (
          <div className="bg-white shadow rounded-lg p-4">
            <h1 className="text-xl font-semibold mb-4">Add Item</h1>
            <form>
              <label className="block mb-2">Product Name</label>
              <input type="text" className="w-full p-2 border rounded mb-4" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} />
              
              <label className="block mb-2">Product Details</label>
              <textarea className="w-full p-2 border rounded mb-4" value={formData.productDetails} onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}></textarea>
              
              <label className="block mb-2">Group Type</label>
              <select className="w-full p-2 border rounded mb-4" value={formData.groupType} onChange={handleGroupChange}>
                <option value="">Select Group Type</option>
                {groupOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <label className="block mb-2">Selling Unit</label>
              <select className="w-full p-2 border rounded mb-4" value={formData.sellingUnit} onChange={(e) => setFormData({ ...formData, sellingUnit: e.target.value })} disabled={!formData.groupType}>
                {formData.groupType && sellingUnits[formData.groupType]?.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>

              {formData.groupType && additionalFields[formData.groupType] && (
                <>
                  <h3 className="text-lg font-semibold mt-4">Additional Information</h3>
                  {additionalFields[formData.groupType].map((field) => (
                  <div key={field} className="flex space-x-4">
                    <div className={`w-${field === "Threshold For Parts Calculation" && formData.groupType === "Fabric" ? "full" : "1/2"}`}>
                      <label className="block mb-2">{field}</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={formData.additionalInputs[field] || ""}
                        onChange={(e) => handleAdditionalInputChange(field, e.target.value)}
                      />
                    </div>

                  {/* Conditionally hide dropdown for "Threshold For Parts Calculation" under Fabric */}
                  {!(field === "Threshold For Parts Calculation" && formData.groupType === "Fabric") && (
                    <div className="w-1/2">
                      <label className="block mb-2">Unit</label>
                      <select
                        className="w-full p-2 border rounded mb-4"
                        value={formData.sideDropdown}
                        onChange={(e) => setFormData({ ...formData, sideDropdown: e.target.value })}
                      >
                        {sideDropdownOptions[formData.groupType]?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}

                </>
              )}

              <label className="block mb-2">MRP</label>
              <input type="number" className="w-full p-2 border rounded mb-4" value={formData.mrp} onChange={(e) => setFormData({ ...formData, mrp: e.target.value })} />
              
              <label className="block mb-2">Tax Rate</label>
              <input type="number" className="w-full p-2 border rounded mb-4" value={formData.taxRate} onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })} />
              
              <button type="button" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleSubmit}>
                Save Item
              </button>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-4 mt-4">
          <input type="text" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-4" />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2 px-4">Item Name</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Costing Type</th>
                <th className="py-2 px-4">Group Type</th>
                <th className="py-2 px-4">Entry Date</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.description}</td>
                  <td className="py-2 px-4">{item.costingType}</td>
                  <td className="py-2 px-4">{item.groupType}</td>
                  <td className="py-2 px-4">{item.entryDate}</td>
                  <button
              onClick={() => toggleMenu(1)} // Pass an ID (1 for example)
              className="p-2 rounded hover:bg-gray-200"
            >
              ⋮
            </button>

            {/* Dropdown menu */}
            {openMenu === 1 && (
              <div className="absolute right-0  w-32 bg-white shadow-md border rounded-md  z-10">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Edit</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Duplicate</button>
                <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Delete</button>
              </div>
            )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Items;
