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
  const groupTypes = [["Fabric", ["Meter"]], ["Area Based", ["Sq.Feet"]], ["Running Length based", ["Meter", "Feet"]], ["Piece Based", ["Piece", "Items", "Sets"]], ["Fixed Length Items", ["Piece"]], ["Fixed Area Items", ["Piece", "Roll"]], ["Tailoring", ["Parts", "Sq.Feet"]]]
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [productName, setProductName] = useState("");
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [groupType, setGroupType] = useState("");
  const [sellingUnit, setSellingUnit] = useState("");
  const [mrp, setMrp] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [publish, setPublish] = useState(false);
  const [accessory, setAccessory] = useState(false);

  const dispatch = useDispatch();
  const itemData = useSelector((state: RootState) => state.data.items);

  const [needsTailoring, setNeedsTailoring] = useState(false);

  const [selectedGroupType, setSelectedGroupType] = useState("");
  
  const selectedUnits = groupTypes.find((type) => type[0] === selectedGroupType)?.[1] || [];

  const [openMenu, setOpenMenu] = useState(-1); // Track which dropdown is open
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for dropdown menus
  const tableRef = useRef<HTMLDivElement>(null); // Ref for table container

  const toggleMenu = (index: number) => {
    setOpenMenu(openMenu === index ? -1 : index); // Toggle menu for the clicked row
  };

  const editMenu = (item) => {
    console.log(item);
    setIsFormOpen(true);
    setEditing(true);
    setProductName(item[0]);
    setDescription(item[1]);
    setSelectedGroupType(item[2]);
    setSellingUnit(item[3]);
    setMrp(item[4]);
    setTaxRate(item[5]);
    setNeedsTailoring(item[6]);
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
    const fetchData = async () => {
      const cached = localStorage.getItem("itemData");
      const oneHour = 60 * 60 * 1000;
  
      if (cached) {
        const { data, time } = JSON.parse(cached);
        if (Date.now() - time < oneHour && Array.isArray(data)) {
          dispatch(setItemData(data));
          setItems(data);
          return;
        }
      }
  
      // Fetch fresh data from backend
      const freshData = await getItemsData();
      dispatch(setItemData(freshData));
      setItems(freshData);
      localStorage.setItem("itemData", JSON.stringify({ data: freshData, time: Date.now() }));
    };
  
    fetchData();
  }, [isFormOpen, deleted, dispatch]);
  

const deleteItem = async (name: string) => {
  try {
    // Delete request
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/deletesingleproduct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productName: name }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete the item");
    }

    // Refetch updated items
    const updatedData = await getItemsData();

    // Update Redux and local state
    dispatch(setItemData(updatedData));
    setItems(updatedData);

    // Update cache
    localStorage.setItem(
      "itemData",
      JSON.stringify({ data: updatedData, time: Date.now() })
    );

    // UI updates
    setDeleted((prev) => !prev);
    setOpenMenu(-1);
  } catch (err) {
    console.error("Error deleting item:", err);
  }
};

const duplicateItem = async (item: Array<string>) => {

  const date = new Date();

  try {
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/addnewproduct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productName: item[0],
          description: item[1],
          groupTypes: item[2],
          sellingUnit: item[3],
          mrp: item[4],
          taxRate: item[5],
          needsTailoring : item[7],
          date : date
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to duplicate the item");
    }

    const updatedData = await getItemsData();

    // Update state and cache
    dispatch(setItemData(updatedData));
    setItems(updatedData);
    localStorage.setItem(
      "itemData",
      JSON.stringify({ data: updatedData, time: Date.now() })
    );

    setDeleted((prev) => !prev);
    setOpenMenu(-1);
  } catch (err) {
    console.error("Error duplicating item:", err);
  }
};


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
  try {
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/updatesingleproduct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productName,
          description,
          groupTypes: selectedGroupType,
          sellingUnit,
          mrp,
          taxRate,
          needsTailoring
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update item");
    }

    alert("Item Updated");

    const updatedData = await getItemsData();

    // 1. Update global state
    dispatch(setItemData(updatedData));

    // 2. Update local state
    setItems(updatedData);

    // 3. Refresh cache
    localStorage.setItem(
      "itemData",
      JSON.stringify({ data: updatedData, time: Date.now() })
    );

    // 4. Reset UI/form state
    setIsFormOpen(false);
    setEditing(false);
    setOpenMenu(-1);
    setFormData({
      productName: "",
      productDetails: "",
      groupType: "",
      sellingUnit: "",
      mrp: "",
      taxRate: "",
      additionalInputs: {},
      sideDropdown: "",
    });

  } catch (error) {
    console.error("Edit error:", error);
    alert("Something went wrong while updating the item.");
  }
};


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
    taxrate: formData.taxRate,
    needsTailoring : needsTailoring
  };

  try {
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/addnewproduct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productName: newItem.name,
          description: newItem.description,
          groupTypes: newItem.groupType,
          sellingUnit: newItem.costingType,
          mrp: newItem.mrp,
          taxRate: newItem.taxrate,
          needsTailoring
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add new item");
    }

    const updatedData = await getItemsData();

    dispatch(setItemData(updatedData));
    setItems(updatedData);
    localStorage.setItem("itemData", JSON.stringify({ data: updatedData, time: Date.now() }));

    alert("Item Added");
    setIsFormOpen(false);
    setFormData({
      productName: "",
      productDetails: "",
      groupType: "",
      sellingUnit: "",
      mrp: "",
      taxRate: "",
      additionalInputs: {},
      sideDropdown: "",
    });
    setNeedsTailoring(false);

  } catch (error) {
    console.error("Error adding item:", error);
    alert("Error adding item");
  }
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
            <h1 className="text-2xl font-semibold">Products</h1>
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
              <i className="fas fa-plus"></i> + Add Product
            </button>
          </div>
        </div>

        {isFormOpen && (
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
              <div>
                <label className="block font-medium">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={productName}
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
                onChange={(e) => setSelectedGroupType(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Group Type</option>
                {groupTypes.map(([label]) => (
                  <option key={label} value={label}>
                    {label}
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
                  <label className="block font-medium">Tax Rate</label>
                  <input
                    type="text"
                    name="taxRate"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder="Enter Tax Rate"
                    className="w-full p-2 border rounded-md"
                  />
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
              </div>
      
              <div className="flex gap-2 justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditing(false); setProductName(""); setDescription(""); setGroupType(""); setSellingUnit(""); setMrp(""); setTaxRate(""); }}
                  className="px-4 py-2 border !rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white !rounded-lg"
                  onClick={editItemData}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={ `bg-white shadow rounded-lg p-4 mt-4 overflow-x-auto ${isFormOpen ? "hidden" : ""}`}ref={tableRef}>
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
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Costing Type</th>
                <th className="py-3 px-4">Group Type</th>
                <th className="py-3 px-4">Added Date</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items != undefined && items.map((item, index) => (
                <tr key={index} className="border-t relative hover:bg-sky-50">
                  <td onClick={() => editMenu(item)} className="py-2 px-4">{item[0]}</td>
                  <td className="py-2 px-4">{item[1]}</td>
                  <td className="py-2 px-4">{item[3]}</td>
                  <td className="py-2 px-4">{item[2]}</td>
                  <td className="py-2 px-4">{item[6]}</td>
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
                        onClick={() => editMenu(item)}
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