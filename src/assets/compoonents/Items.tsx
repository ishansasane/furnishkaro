import { useEffect, useState } from "react";
import { MoreVertical, ChevronLast, ChevronFirst, LayoutDashboard, Briefcase, Users, ClipboardList, ListChecks, FileText, Settings, ChevronDown } from "lucide-react";

const getItemsData = async () => {
  const response  = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getsingleproducts");

  const data = await response.json();

  return data.body;
}


const Items = () => {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [deleted, setdeleted] = useState(false);
  const [editing, setediting] = useState(false);
  const [name, setname] = useState("");

  const [openMenu, setOpenMenu] = useState(null); // Track which dropdown is open

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index); // Toggle menu for the clicked row
  };

  const editmenu = (name) => {
    setIsFormOpen(true);
    setediting(true);
    setname(name);
  }

  useEffect(() => {
    async function getData(){
      const data = await getItemsData();
      setItems(data);
    }
    getData();
  }, [isFormOpen, deleted])


  const deleteItem = async (name) => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletesingleproduct", {
      method : "POST",
      headers : {
        "content-type" : "application/json",
      },
      credentials : "include",
      body : JSON.stringify({ productName : name })
    });
    if(deleted){
      setdeleted(false);
    }else{
      setdeleted(true);
    }
    setOpenMenu(-1);
  }

  const duplicateItem = async (item) => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addnewproduct", {
      method : "POSt",
      headers : {
        "content-type" : "application/json",
      },
      credentials : "include",
      body : JSON.stringify({ productName : item[0], description : item[1], groupTypes : item[2], sellingUnit : item[3], mrp : item[4], taxRate : item[5] })
    });

    if(deleted){
      setdeleted(false);
    }else{
      setdeleted(true);
    }
    setOpenMenu(-1);
  }

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

  const editItemData = async () => {
    const newItem = {
      id: items.length + 1,
      name: formData.productName,
      description: formData.productDetails,
      costingType: formData.sellingUnit,
      groupType: formData.groupType,
      entryDate: new Date().toLocaleDateString(),
      additionalInputs: formData.additionalInputs,
      sideDropdown: formData.sideDropdown,
      mrp : formData.mrp,
      taxrate : formData.taxRate
    };
  
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updatesingleproduct", {
      method : "POST",
      headers : {
        "content-type" : "application/json",
      },
      credentials : "include",
      body : JSON.stringify({ productName : name, description : newItem.description, groupTypes : newItem.groupType, sellingUnit : newItem.costingType, mrp : newItem.mrp, taxRate : newItem.taxrate })
    });

    if(response.status === 200){
      alert("Item Updated");
      setIsFormOpen(false);
    }else{
      alert("Error");
    }
    
    setIsFormOpen(false);
    setediting(false);
    setOpenMenu(-1);
  
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
  }

  const handleSubmit = async () => {
    const newItem = {
      id: items.length + 1,
      name: formData.productName,
      description: formData.productDetails,
      costingType: formData.sellingUnit,
      groupType: formData.groupType,
      entryDate: new Date().toLocaleDateString(),
      additionalInputs: formData.additionalInputs,
      sideDropdown: formData.sideDropdown,
      mrp : formData.mrp,
      taxrate : formData.taxRate
    };
  
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addnewproduct", {
      method : "POST",
      headers : {
        "content-type" : "application/json",
      },
      credentials : "include",
      body : JSON.stringify({ productName : newItem.name, description : newItem.description, groupTypes : newItem.groupType, sellingUnit : newItem.costingType, mrp : newItem.mrp, taxRate : newItem.taxrate })
    });

    if(response.status === 200){
      alert("Item Added");
      setIsFormOpen(false);
    }else{
      alert("Error");
    }
    
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
            <h1 className="text-xl font-semibold mb-4">{editing ? "Edit Task" : "Add Task"}</h1>
            <form>
              <label className={`${editing ? "hidden" : "none"} block mb-2`}>Product Name</label>
              <input type="text" className={`${editing ? "hidden" : "none"} w-full p-2 border rounded mb-4`} value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} />
              
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
              
              <button type="button" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={editing ? editItemData : handleSubmit}>
                Save Item
              </button>
            </form>
          </div>
        )}

 <div className="bg-white shadow rounded-lg p-4 mt-4">
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg mb-4"
      />
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500">
            <th className="py-2 px-4">Item Name</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Costing Type</th>
            <th className="py-2 px-4">Group Type</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-t relative">
              <td className="py-2 px-4">{item[0]}</td>
              <td className="py-2 px-4">{item[1]}</td>
              <td className="py-2 px-4">{item[3]}</td>
              <td className="py-2 px-4">{item[2]}</td>
              <td className="py-2 px-4 relative">
                <button
                  onClick={() => toggleMenu(index)}
                  className="p-2 rounded hover:bg-gray-200"
                >
                  ⋮
                </button>

                {openMenu === index && (
                  <div className="absolute right-0 w-32 bg-white shadow-md border rounded-md z-10">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => editmenu(item[0])}>
                      Edit
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => duplicateItem(item)}>
                      Duplicate
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100" onClick={() => deleteItem(item[0])}>
                      Delete
                    </button>
                  </div>
                )}
              </td>
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
