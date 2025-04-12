import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../Redux/store";
import { setSalesAssociateData, setInteriorData, setCustomerData, setProducts, setCatalogs, setProjects, setItemData } from "../Redux/dataSlice";
import { Plus, Upload } from "lucide-react";
import { FaPlus, FaTrash } from "react-icons/fa";

function AddProjectForm() {

    const dispatch = useDispatch();
    const customerData = useSelector((state : RootState) => state.data.customers);
    const interiorData = useSelector((state : RootState) => state.data.interiors);
    const salesAssociateData = useSelector((state : RootState) => state.data.salesAssociates);
    const products = useSelector((state : RootState) => state.data.products);
    const items = useSelector((state : RootState) => state.data.items);

    let projectData = [];
    const [ count, setCount ] = useState(0);

    const [ customers, setcustomers ] = useState<[]>([]);
    const [ selectedCustomer, setSelectedCustomer ] = useState(null);

    const [singleitems, setsingleitems] = useState([]);

    const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);

    const [ interior, setinterior ] = useState([]);
    const [ salesdata, setsalesdata ] = useState([]);

    const availableAreas = ["Living Room", "Kitchen", "Bedroom", "Bathroom"];
    const [availableProductGroups, setAvailableProductGroups] = useState([]);

    const   catalogueData = useSelector((state : RootState) => state.data.catalogs);

    let availableCompanies = ["D Decor", "Asian Paints", "ZAMAN"];

    const designNo = [ "514", "98", "123" ];

    interface AreaSelection {
      area: string;
      areacollection : collectionArea[];
    }

    interface measurements {
      unit;
      width;
      height;
      quantity;
      newquantity;
    }

    interface collectionArea {
      productGroup;
      items : [];
      company;
      catalogue;
      designNo;
      reference;
      measurement : measurements;
      additionalItems : [];
      totalAmount : number;
      totalTax : number;
    }

    interface ProductGroup {
      groupName: string;
      mainProducts: string;
      addonProducts: string;
      color: string;
      needsTailoring: boolean;
    }

    const [selections, setSelections] = useState<AreaSelection[]>([]);

    const getItemsData = async () => {
 
      const response  = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getsingleproducts");
    
      const data = await response.json();
    
      return data.body;
    }

    const fetchCustomers = async () => {
        try {
          const response = await fetch(
            "https://sheeladecor.netlify.app/.netlify/functions/server/getcustomerdata",
            { credentials: "include" }
          );
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
          return Array.isArray(data.body) ? data.body : [];
        } catch (error) {
          console.error("Error fetching customer data:", error);
          return [];
        }
    };

    async function fetchCatalogues(){
      try {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getcatalogues", {
          credentials: "include",
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        return Array.isArray(data.body) ? data.body : [];
      } catch (error) {
        console.error("Error fetching catalogues:", error);
        return [];
      }
    }

    async function fetchInteriors(){
      try {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getinteriordata", {
          credentials: "include",
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        return data.body;
      } catch (error) {
        console.error("Error fetching interiors:", error);
        return [];
      }
    }
  
    async function fetchSalesAssociates() {
      try {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getsalesassociatedata", {
          credentials: "include",
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        return Array.isArray(data.body) ? data.body : [];
      } catch (error) {
        console.error("Error fetching sales associates:", error);
        return [];
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchProductGroups(): Promise<ProductGroup[]> {
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

      useEffect(() => {
        async function getData(){
          let data = await fetchInteriors();
          dispatch(setInteriorData(data));
          setinterior(interiorData);

        }
        async function getitemsdata(){
          let data = await getItemsData();
          dispatch(setItemData(data));
          setsingleitems(items);
        }
        if(interiorData.length == 0){
          getData();
        }else{
          setinterior(interiorData);
        }
        if(items.length == 0){
          getitemsdata();
        }else{
          setinterior(interiorData);
        }
      },[dispatch, interiorData, items]);

      useEffect(() => {
        async function getData(){
          let data = await fetchSalesAssociates();
          dispatch(setSalesAssociateData(data));
          setsalesdata(salesAssociateData);
        }
        if(salesAssociateData.length == 0){
          getData();
        }else{
          setsalesdata(salesAssociateData);
        }
      },[dispatch, salesAssociateData]);

      useEffect(() => {
        async function getData(){
          let data = await fetchProductGroups();
          dispatch(setProducts(data));
          setAvailableProductGroups(products);        
        }
        if(products.length == 0){
          getData();
        }else{
          setAvailableProductGroups(products);
        }
      },[dispatch, products]);

      useEffect(() => {
        async function getData(){
          let data = await fetchCatalogues();
          dispatch(setCatalogs(data));      
        }
        if(catalogueData.length == 0){
          getData();
        }
      },[dispatch, catalogueData]);

    useEffect(() => {
        async function fetchData(){
          const data = await fetchCustomers();
          dispatch(setCustomerData(data));
          setcustomers(customerData);
        }
        if(customerData.length == 0){
          fetchData();
        }else{
          setcustomers(customerData);
        }
      }, [customerData, dispatch])

      const handleAddArea = () => {
        setSelections([...selections, { area: "", areacollection : []}]);
      };

      const handleRemoveArea = (index: number) => {
        const updatedSelections = selections.filter((_, i) => i !== index);
        setSelections(updatedSelections);
      };

      const handleAreaChange = (mainindex, newArea) => {
        // Clone the selections array to avoid direct mutation of state
        const updatedSelections = [...selections];
      
        // Check if the area exists and update its value
        if (updatedSelections[mainindex]) {
          updatedSelections[mainindex].area = newArea;  // Set the new area for the selected index
        }
      
        // Update the state with the new selections array
        setSelections(updatedSelections);
      };
      
      
      
    

    const handleProductGroupChange = (mainindex: number, product) => {
      const updatedSelections = [...selections];
    
      // Ensure areacollection exists before accessing the index
      if (!updatedSelections[mainindex].areacollection) {
        updatedSelections[mainindex].areacollection = [];
      }
    
      // Ensure the specific index exists
      if (!updatedSelections[mainindex].areacollection[i]) {
        updatedSelections[mainindex].areacollection[i] = { productGroup: null, items : [""], catalogue: null, company: null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : 0, totalTax : 0 };
      }
    
      updatedSelections[mainindex].areacollection[count][0] = product;
      setSelections(updatedSelections);
    };
    
    const handleCatalogueChange = (mainindex: number,i : number, catalogue) => {
      const updatedSelections = [...selections];
    
      if (!updatedSelections[mainindex].areacollection) {
        updatedSelections[mainindex].areacollection = [];
      }
    
      if (!updatedSelections[mainindex].areacollection[i]) {
        updatedSelections[mainindex].areacollection[i] = { productGroup: null, items : [""],  catalogue: null, company: null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : 0, totalTax : 0 };
      }
    
      updatedSelections[mainindex].areacollection[count][2] = catalogue;
      setSelections(updatedSelections);
    };
    
    const handleCompanyChange = (mainindex: number,i : number, company: string) => {
      const updatedSelections = [...selections];
    
      if (!updatedSelections[mainindex].areacollection) {
        updatedSelections[mainindex].areacollection = [];
      }
    
      if (!updatedSelections[mainindex].areacollection[i]) {
        updatedSelections[mainindex].areacollection[i] = { productGroup: null, items : [""], catalogue: null, company: null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : 0, totalTax : 0 };
      }
    
      updatedSelections[mainindex].areacollection[count][1] = company;
      setSelections(updatedSelections);

      console.log(updatedSelections);
    };

    const handleDesignNoChange = (mainindex : number,i : number, designNo) => {
      const updatedSelections = [...selections];

      if(!updatedSelections[mainindex].areacollection){
        updatedSelections[mainindex].areacollection = [];
      }

      if(!updatedSelections[mainindex].areacollection[i]){
        updatedSelections[mainindex].areacollection[i] = { productGroup : null, items : [""], catalogue : null, company : null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : 0, totalTax : 0 };
      }

      updatedSelections[mainindex].areacollection[count][3] = designNo;
      setSelections(updatedSelections);

      console.log(updatedSelections);
    }

    const handleReferenceChange = (mainindex : number, i : number, reference) => {
      const updatedSelection = [...selections];

      if(!updatedSelection[mainindex].areacollection){
        updatedSelection[mainindex].areacollection = [];
      }

      if(!updatedSelection[mainindex].areacollection[i]){
        updatedSelection[mainindex].areacollection[i] = { productGroup : null, items : [""], catalogue : null, company : null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : 0, totalTax : 0 }
      }

      updatedSelection[mainindex].areacollection[count][4] = reference;

      setSelections(updatedSelection);
    }

    const handleAddNewGroup = (mainindex) => {
      // Clone the selections array to avoid direct mutation of state
      const updatedSelections = [...selections];
    
      // Ensure the area exists before proceeding
      if (updatedSelections[mainindex] && updatedSelections[mainindex].area) {
        // Add a new group to the `areacollection` array for the selected area
        updatedSelections[mainindex].areacollection.push({
          productGroup: "",
          company: "",
          catalogue: [],
          designNo: "",
          reference: "",
          measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"},
          items : [""],
          additionalItems : [],
          totalAmount : 0,
          totalTax : 0
        });
    
        // Update the state with the new selections array
        setSelections(updatedSelections);
      }
    };
    
    const handleGroupDelete = (mainindex : number, index : number) => {
      const updatedSelection = [...selections];
      if(updatedSelection[mainindex].areacollection[index]){
        updatedSelection[mainindex].areacollection.splice(index, 1);
      }

      setSelections(updatedSelection);
    }
    
    const units = ["Inches (in)", "Centimeter (cm)", "Meters (m)", "Feet (ft)"];

    const handlewidthchange = (mainindex : number, index : number, width) => {
      const updatedSelection = [...selections];
      updatedSelection[mainindex].areacollection[index].measurement.width = width;
      setSelections(updatedSelection);
    }
    const handleheightchange = (mainindex : number, index : number, height) => {
      const updatedSelection = [...selections];
      updatedSelection[mainindex].areacollection[index].measurement.height = height;
      setSelections(updatedSelection);
    }
    const handlequantitychange = (mainindex : number, index : number, quantity) => {
      const updatedSelection = [...selections];
      updatedSelection[mainindex].areacollection[index].measurement.quantity = quantity;
      setSelections(updatedSelection);
    }
    const handleunitchange = (mainindex : number, index : number, unit) => {
      const updatedSelection = [...selections];
      updatedSelection[mainindex].areacollection[index].measurement.unit = unit;
      setSelections(updatedSelection);
    }
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = async (key, value, mainIndex, collectionIndex, quantity, num1, num2) => {
      setQuantities((prev) => ({
        ...prev,
        [key]: value,
      }));

      console.log(value);
      console.log(num1);
      console.log(num2);
      console.log(quantity);

      const updatedSelections = [...selections];
      
      updatedSelections[mainIndex].areacollection[collectionIndex].totalTax = (num1*quantity*value)*(num2/100);
      updatedSelections[mainIndex].areacollection[collectionIndex].totalAmount = (updatedSelections[mainIndex].areacollection[collectionIndex].totalTax)+(num1*quantity*value);
      setSelections(updatedSelections);
      console.log(selections[mainIndex].areacollection[collectionIndex].totalAmount);
      console.log(selections[mainIndex].areacollection[collectionIndex].totalTax);
    };

    const handleAddMiscItem = (mainIndex: number, collectionIndex: number) => {
      setSelections(prevSelections => 
        prevSelections.map((selection, sIdx) => {
          if (sIdx !== mainIndex) return selection;
    
          return {
            ...selection,
            areacollection: selection.areacollection.map((collection, cIdx) => {
              if (cIdx !== collectionIndex) return collection;
    
              return {
                ...collection,
                additionalItems: [...(collection.additionalItems || []), ["", "", "", "", "", "", "", "", ""]],
              };
            }),
          };
        })
      );
    };

    const handleDeleteMiscItem = (mainIndex: number, collectionIndex: number, itemIndex: number) => {
      setSelections(prevSelections =>
        prevSelections.map((selection, sIdx) => {
          if (sIdx !== mainIndex) return selection;
    
          return {
            ...selection,
            areacollection: selection.areacollection.map((collection, cIdx) => {
              if (cIdx !== collectionIndex) return collection;
    
              return {
                ...collection,
                additionalItems: collection.additionalItems
                  ? collection.additionalItems.filter((_, i) => i !== itemIndex)
                  : [],
              };
            }),
          };
        })
      );
    };

    const handleitemnamechange = (index : number, mainindex : number, i : number, name) => {
      const updatedSelection = [...selections];

      updatedSelection[mainindex].areacollection[index].additionalItems[i][0] = name;

      setSelections(updatedSelection);
    }
    const handleitemquantitychange = (index : number, mainindex : number, i : number, quantity) => {
      const updatedSelection = [...selections];

      updatedSelection[mainindex].areacollection[index].additionalItems[i][1] = quantity;

      setSelections(updatedSelection);
    }
    const handleitemratechange = (index : number, mainindex : number, i : number, rate) => {
      const updatedSelection = [...selections];

      updatedSelection[mainindex].areacollection[index].additionalItems[i][2] = rate;
      updatedSelection[mainindex].areacollection[index].additionalItems[i][3] = updatedSelection[mainindex].areacollection[index].additionalItems[i][1] * rate;
      setSelections(updatedSelection);
    }
    const handleitemtaxchange = (index : number, mainindex : number, i : number, tax) => {
      const updatedSelection = [...selections];

      updatedSelection[mainindex].areacollection[index].additionalItems[i][4] = tax;
      updatedSelection[mainindex].areacollection[index].additionalItems[i][5] = updatedSelection[mainindex].areacollection[index].additionalItems[i][3] * tax / 100;
      updatedSelection[mainindex].areacollection[index].additionalItems[i][6] = updatedSelection[mainindex].areacollection[index].additionalItems[i][5] + updatedSelection[mainindex].areacollection[index].additionalItems[i][3];
      setSelections(updatedSelection);
    }
    const handleitemremarkchange = (index : number, mainindex : number, i : number, remark) => {
      const updatedSelection = [...selections];

      updatedSelection[mainindex].areacollection[index].additionalItems[i][7] = remark;

      setSelections(updatedSelection);
    }
  return (
    <div className="flex flex-col gap-3 w-full h-screen">
        <div className="flex flex-col w-full">
            <p className="lg:text-[1.8vw]">Add New Project</p>
            <div className="flex gap-3 -mt-3">
                <Link to="/" className="text-[1vw] text-black !no-underline">Dashboard</Link>
                <Link to="/projects" className="text-[1vw] text-black !no-underline">All Projects</Link>
            </div>
        </div>
        <div className="flex flex-col gap-3 px-3 py-3 rounded-xl shadow-xl w-full border-gray-200 border-2 mt-3">
            <p className="text-[1.2vw]">Customer Details</p>
            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col w-1/2">
                    <p className="text-[1vw]">Select Customer</p>
                    <select
                      className="border p-2 rounded w-full"
                      value={selectedCustomer ? JSON.stringify(selectedCustomer) : ""}
                      onChange={(e) => {setSelectedCustomer(e.target.value=="" ? null : JSON.parse(e.target.value)); projectData[0] = e.target.value; }}
                      >
                      <option value="">Select Customer</option>
                      {Array.isArray(customers) &&
                          customers.map((customer, index) => (
                              <option key={index} value={JSON.stringify(customer)}>
                                  {customer[0]}
                              </option>
                      ))}
                    </select>
                </div>
                {selectedCustomer ? <div className="flex flex-col w-1/2">
                    <p className="text-[1vw]">Email (optional)</p>
                    <input type="text" className="border p-2 rounded w-full" value={selectedCustomer[2]}/>
                </div> : undefined}
            </div>
            {selectedCustomer ? <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col w-1/2">
                    <p className="text-[1vw]">Phone Number</p>
                    <input type="text" className="border p-2 rounded w-full" value={selectedCustomer[1]}/>
                </div>
                <div className="flex flex-col w-1/2">
                    <p className="text-[1vw]">Alternate Phone Number (optional)</p>
                    <input type="text" className="border p-2 rounded w-full" value={selectedCustomer[4 ]}/>
                </div>
            </div> : undefined}
        </div>
        <div className="flex flex-col gap-3 w-full rounded-xl shadow-2xl border-2 border-gray-200 px-3 py-3">
            <p className="text-[1.2vw]">Project Details</p>
            <div className="flex flex-row w-full gap-2">
                <div className="flex flex-col w-1/2">
                    <p className="text-[1vw]">Reference (optional)</p>
                    <input type="text" className="border p-2 rounded w-full" />
                </div>
                <div className="flex flex-col w-1/2">
                    <p className="text-[1vw]">Project Name (type a unique name)</p>
                    <input type="text" className="border p-2 rounded w-full" />
                </div>
            </div>
            <div className="flex flex-row w-full gap-2">
                {selectedCustomer ? <div className="flex flex-col w-full">
                    <p className="text-[1vw]">Address</p>
                    <input type="text" className="border p-2 rounded w-full" value={selectedCustomer[3]}/>
                </div> : undefined}
            </div>
            <div className="flex flex-row w-full gap-2">
                {selectedCustomer ? <div className="flex flex-col w-full">
                    <p className="text-[1vw]">Any Additional Requests (optional)</p>
                    <input type="text" className="border p-2 rounded w-full"/>
                </div> : undefined}
            </div>
            <div className="flex flex-row w-full gap-2">
              {/* Interior Name Dropdown */}
              <div className="flex flex-col w-1/2">
                  <p className="text-[1vw]">Interior Name (optional)</p>
                  <select className="border p-2 rounded w-full">
                      <option value="">Select Interior Name (optional)</option>
                      {interior.map((data, index) => (
                          <option value={data[0]} key={index}>{data[0]}</option>
                      ))}
                  </select>
              </div>

              {/* Sales Associate Dropdown */}
              <div className="flex flex-col w-1/2">
                  <p className="text-[1vw]">Sales Associate (optional)</p>
                  <select className="border p-2 rounded w-full">
                      <option value="">Select Sales Associate (optional)</option>
                      {salesdata.map((data, index) => (
                          <option value={data[0]} key={index}>{data[0]}</option>
                      ))}
                  </select>
              </div>
            </div>

            <div className="flex flex-row w-full gap-2">
                <div className="flex flex-col w-1/2">
                    <p className="text-[1vw]">Select User</p>
                    <input type="text" className="border p-2 rounded w-full"/>
                </div>
            </div>
        </div>
        <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg">
            <p className="text-[1.2vw] text-gray-700">Material Selection</p>

            <div className="flex flex-row gap-5">
              {/* Left Column: Area Selection */}
              <div className="w-[20vw]">
                <p className="text-[1.1vw]">Area</p>
                {selections.map((selection, index) => (
                  <div key={index} className="flex items-center gap-2 mb-4">
                    <select
                      className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                      value={selection.area}
                      onChange={(e) => handleAreaChange(index, e.target.value)}
                    >
                      <option value="">Select Area</option>
                      {availableAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleRemoveArea(index)}>
                      <FaTrash size={18} />
                    </button>
                  </div>
                ))}
                <button
                  className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 hover:bg-blue-600 transition"
                  onClick={handleAddArea}
                >
                  <FaPlus /> Add Area
                </button>
              </div>

              {/* Right Column: Product Group Selection */}
              <div className="w-[80vw]">
                <div className="flex flex-row items-center justify-between">
                  <p className="text-[1.1vw]">Select Product Groups</p>
                </div>
{selections.map((selection, mainindex) => (
  selection.area && selection.areacollection.length > 0 ? (
    selection.areacollection.map((element, i) => (
      <div key={i} className="mb-4 border p-3 rounded-lg shadow-sm bg-gray-50">
        <div className="flex flex-row justify-between">
          <p className="text-[1.1vw]">{selection.area}</p>
          <button
            className="mb-3 text-lg px-2 py-2 text-white bg-sky-600"
            style={{ borderRadius: "10px" }}
            onClick={() => handleAddNewGroup(mainindex)} // Ensure handleAddNewGroup is called
          >
            Add New Group
          </button>
        </div>
        <div className="gap-3">
          <div className="flex justify-between items-center gap-2">
            {/* Product Group */}
            <div>
              <p>Product Group</p>
              <select
                className="border p-2 rounded w-full"
                value={element.productGroup || ""}
                onChange={(e) => handleProductGroupChange(mainindex, i, e.target.value)}
              >
                <option value="">Select Product Group</option>
                {availableProductGroups.map((product, index) => (
                  <option key={index} value={product[0]}>
                    {product[0]}
                  </option>
                ))}
              </select>
            </div>

            {/* Company */}
            <div>
              <p>Company</p>
              <select
                className="border p-2 rounded w-full"
                value={element.company || ""}
                onChange={(e) => handleCompanyChange(mainindex, i, e.target.value)}
              >
                <option value="">Select Company</option>
                {availableCompanies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* Catalogue */}
            <div>
              <p>Catalogue</p>
              <select
                className="border p-2 rounded w-full"
                value={element.catalogue || ""}
                onChange={(e) => handleCatalogueChange(mainindex, i, e.target.value)}
              >
                <option value="">Select Catalogue</option>
                {catalogueData.map((catalogue, index) => (
                  <option key={index} value={catalogue}>
                    {catalogue}
                  </option>
                ))}
              </select>
            </div>

            {/* Design No */}
            <div>
              <p>Design No</p>
              <select
                className="border p-2 rounded w-full"
                value={element.designNo || ""}
                onChange={(e) => handleDesignNoChange(mainindex, i, e.target.value)}
              >
                <option value="">Select Design No</option>
                {designNo.map((design, index) => (
                  <option key={index} value={design}>
                    {design}
                  </option>
                ))}
              </select>
            </div>

            {/* Reference */}
            <div>
              <p>Reference/Notes</p>
              <input
                type="text"
                value={element.reference || ""}
                placeholder="Enter reference..."
                onChange={(e) => handleReferenceChange(mainindex, i, e.target.value)}
                className="pl-2 w-[10vw] h-[2.6vw] border-2 border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div key={mainindex} className="mb-4 border p-3 rounded-lg shadow-sm bg-gray-50">
      <div className="flex flex-row justify-between">
        <p className="text-[1.1vw]">{selection.area}</p>
        <button
          className="mb-3 text-lg px-2 py-2 text-white bg-sky-600"
          style={{ borderRadius: "10px" }}
          onClick={() => handleAddNewGroup(mainindex)} // Ensure handleAddNewGroup is called
        >
          Add New Group
        </button>
      </div>
      <div className="gap-3">
        <div className="flex justify-between items-center gap-2">
          {/* Product Group */}
          <div>
            <p>Product Group</p>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => handleProductGroupChange(mainindex, 0, e.target.value)}
            >
              <option value="">Select Product Group</option>
              {availableProductGroups.map((product, index) => (
                <option key={index} value={product[0]}>
                  {product[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div>
            <p>Company</p>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => handleCompanyChange(mainindex, 0, e.target.value)}
            >
              <option value="">Select Company</option>
              {availableCompanies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {/* Catalogue */}
          <div>
            <p>Catalogue</p>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => handleCatalogueChange(mainindex, 0, e.target.value)}
            >
              <option value="">Select Catalogue</option>
              {catalogueData.map((catalogue, index) => (
                <option key={index} value={catalogue}>
                  {catalogue}
                </option>
              ))}
            </select>
          </div>

          {/* Design No */}
          <div>
            <p>Design No</p>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => handleDesignNoChange(mainindex, 0, e.target.value)}
            >
              <option value="">Select Design No</option>
              {designNo.map((design, index) => (
                <option key={index} value={design}>
                  {design}
                </option>
              ))}
            </select>
          </div>

          {/* Reference */}
          <div>
            <p>Reference/Notes</p>
            <input
              type="text"
              placeholder="Enter reference..."
              onChange={(e) => handleReferenceChange(mainindex, 0, e.target.value)}
              className="pl-2 w-[10vw] h-[2.6vw] border-2 border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  )
))}



              </div>
            </div>
          </div>
        <br />
    </div>
    
  )
}

export default AddProjectForm;