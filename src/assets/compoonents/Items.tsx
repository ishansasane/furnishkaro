/* eslint-disable @typescript-eslint/no-unused-vars */
import { SetStateAction, useEffect, useState, useRef } from "react";
import { ChevronFirst } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store.ts";
import { setItemData } from "../Redux/dataSlice.ts";
import { useNavigate } from "react-router-dom";

const getItemsData = async () => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getsingleproducts");
  const data = await response.json();
  return data.body;
}

const Items = () => {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const itemData = useSelector((state: RootState) => state.data.items);

  const [openMenu, setOpenMenu] = useState(-1); // Track which dropdown is open
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for dropdown menus
  const tableRef = useRef<HTMLDivElement>(null); // Ref for table container

  const toggleMenu = (index: number) => {
    setOpenMenu(openMenu === index ? -1 : index); // Toggle menu for the clicked row
  };

  const editMenu = (name: string) => {
    setIsFormOpen(true);
    setEditing(true);
    setName(name);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRefs.current.every(
          (ref) => ref && !ref.contains(event.target as Node)
        )
      ) {
        setOpenMenu(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll to make dropdown fully visible when opened
  useEffect(() => {
    if (openMenu !== -1 && menuRefs.current[openMenu]) {
      const dropdown = menuRefs.current[openMenu];
      if (dropdown) {
        const rect = dropdown.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if dropdown is partially or fully outside the viewport
        if (rect.bottom > viewportHeight) {
          // Scroll to bring the dropdown into view
          dropdown.scrollIntoView({ behavior: "smooth", block: "end" });
        } else if (rect.top < 0) {
          // Scroll up if dropdown is above the viewport
          dropdown.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  }, [openMenu]);

  useEffect(() => {
    async function fetchData() {
      const data = await getItemsData();
      dispatch(setItemData(data));
      setItems(itemData);
    }
    if (itemData != undefined) {
      if (itemData.length == 0) {
        fetchData();
      } else {
        setItems(itemData);
      }
    } else {
      setItemData([]);
      setItems([]);
    }
  }, [isFormOpen, deleted, itemData, dispatch]);

  const deleteItem = async (name: string) => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletesingleproduct", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productName: name })
    });
    const data = await getItemsData();
    dispatch(setItemData(data));
    setItems(itemData);
    
    setDeleted(!deleted);
    setOpenMenu(-1);
  }

  const duplicateItem = async (item: Array<string>) => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addnewproduct", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productName: item[0],
        description: item[1],
        groupTypes: item[2],
        sellingUnit: item[3],
        mrp: item[4],
        taxRate: item[5]
      })
    });
    const data = await getItemsData();
    dispatch(setItemData(data));
    setItems(itemData);
    setDeleted(!deleted);
    setOpenMenu(-1);
  }

  const groupOptions: string[] = [
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

  const additionalFields: object = {
    "Fabric": ["Coverage in Width", "Wastage in Height", "Threshold For Parts Calculation"],
    "Area Based": ["Coverage in Area"],
    "Running length based": [],
    "Piece based": [],
    "Fixed length items": ["Length of Item"],
    "Fixed area items": ["Area Covered"],
    "Tailoring": []
  };

  const sideDropdownOptions: object = {
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

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGroup: string = e.target.value;
    setFormData({
      ...formData,
      groupType: selectedGroup,
      sellingUnit: sellingUnits[selectedGroup]?.[0] || "",
      additionalInputs: additionalFields[selectedGroup]
        ? additionalFields[selectedGroup].reduce((acc: any, field: string) => ({ ...acc, [field]: "" }), {})
        : {},
      sideDropdown: sideDropdownOptions[selectedGroup]?.[0] || ""
    });
  };

  const handleAdditionalInputChange = (field: string, value: string) => {
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
      mrp: formData.mrp,
      taxrate: formData.taxRate
    };

    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updatesingleproduct", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productName: name,
        description: newItem.description,
        groupTypes: newItem.groupType,
        sellingUnit: newItem.costingType,
        mrp: newItem.mrp,
        taxRate: newItem.taxrate
      })
    });
    if (response.status === 200) {
      alert("Item Updated");
      setIsFormOpen(false);
    } else {
      alert("Error");
    }
    const data = await getItemsData();
    dispatch(setItemData(data));
    setItems(itemData);

    setIsFormOpen(false);
    setEditing(false);
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
      mrp: formData.mrp,
      taxrate: formData.taxRate
    };

    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addnewproduct", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productName: newItem.name,
        description: newItem.description,
        groupTypes: newItem.groupType,
        sellingUnit: newItem.costingType,
        mrp: newItem.mrp,
        taxRate: newItem.taxrate
      })
    });
    const data = await getItemsData();
    dispatch(setItemData(data));
    setItems(itemData);

    if (response.status === 200) {
      alert("Item Added");
      setIsFormOpen(false);
    } else {
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
    <div className="bg-gray-50 min-h-screen pt-20 md:p-4">
      <div className="container mx-auto">
        <div className="flex justify-between flex-wrap items-center mb-4">
          <div className="flex items-center gap-5">
            {isFormOpen && (
              <button onClick={() => { setIsFormOpen(false); setEditing(false) }} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                <ChevronFirst />
              </button>
            )}
            <h1 className="text-2xl font-semibold">Items</h1>
          </div>
          <div className="flex items-center md:!gap-5 flex-wrap gap-2">
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                More Options
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Import Product</a></li>
                <li><a className="dropdown-item" href="#">Export Product</a></li>
              </ul>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate("/add-product")}
            >
              <i className="fas fa-plus"></i> + Add Item
            </button>
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-white shadow rounded-lg p-4">
            <h1 className="text-xl font-semibold mb-4">{editing ? "Edit Task" : "Add Task"}</h1>
            <form>
              <div className={`${editing ? "hidden" : "block"}`}>
                <label className="block mb-2">Product Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-4"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>
              <label className="block mb-2">Product Details</label>
              <textarea
                className="w-full p-2 border rounded mb-4"
                value={formData.productDetails}
                onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}
              ></textarea>
              <label className="block mb-2">Group Type</label>
              <select
                className="w-full p-2 border rounded mb-4"
                value={formData.groupType}
                onChange={handleGroupChange}
              >
                <option value="">Select Group Type</option>
                {groupOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="block mb-2">Selling Unit</label>
              <select
                className="w-full p-2 border rounded mb-4"
                value={formData.sellingUnit}
                onChange={(e) => setFormData({ ...formData, sellingUnit: e.target.value })}
                disabled={!formData.groupType}
              >
                {formData.groupType && sellingUnits[formData.groupType]?.map((unit: string) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {formData.groupType && additionalFields[formData.groupType] && (
                <>
                  <h3 className="text-lg font-semibold mt-4">Additional Information</h3>
                  {additionalFields[formData.groupType].map((field: string) => (
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
                      {!(field === "Threshold For Parts Calculation" && formData.groupType === "Fabric") && (
                        <div className="w-1/2">
                          <label className="block mb-2">Unit</label>
                          <select
                            className="w-full p-2 border rounded mb-4"
                            value={formData.sideDropdown}
                            onChange={(e) => setFormData({ ...formData, sideDropdown: e.target.value })}
                          >
                            {sideDropdownOptions[formData.groupType]?.map((option: string) => (
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
              <input
                type="number"
                className="w-full p-2 border rounded mb-4"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
              />
              <label className="block mb-2">Tax Rate</label>
              <input
                type="number"
                className="w-full p-2 border rounded mb-4"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
              />
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={editing ? editItemData : handleSubmit}
              >
                Save Item
              </button>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-4 mt-4 overflow-x-auto" ref={tableRef}>
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 bg-sky-50">
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Costing Type</th>
                <th className="py-3 px-4">Group Type</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t relative hover:bg-sky-50">
                  <td className="py-2 px-4">{item[0]}</td>
                  <td className="py-2 px-4">{item[1]}</td>
                  <td className="py-2 px-4">{item[3]}</td>
                  <td className="py-2 px-4">{item[2]}</td>
                  <td className="py-2 px-4 relative">
                    <button
                      onClick={() => toggleMenu(index)}
                      className="p-2 rounded hover:bg-gray-200 text-gray-600 text-xl"
                      aria-expanded={openMenu === index}
                      aria-controls={`menu-${index}`}
                    >
                      ⋮
                    </button>
                    <div
                      id={`menu-${index}`}
                      className={`absolute right-4 top-10 w-32 bg-white shadow-md border rounded-md z-50 transition-all duration-200 ease-in-out ${
                        openMenu === index
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                      ref={(el) => (menuRefs.current[index] = el)}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => editMenu(item[0])}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => duplicateItem(item)}
                      >
                        Duplicate
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                        onClick={() => deleteItem(item[0])}
                      >
                        Delete
                      </button>
                    </div>
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