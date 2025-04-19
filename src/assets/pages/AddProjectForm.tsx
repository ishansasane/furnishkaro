import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../Redux/store";
import { setSalesAssociateData, setInteriorData, setCustomerData, setProducts, setCatalogs, setProjects, setItemData } from "../Redux/dataSlice";
import { Plus, Upload } from "lucide-react";
import { FaPlus, FaTrash } from "react-icons/fa";
import CustomerDetails from "./CustomerDetails";
import ProjectDetails from "./ProjectDetails";
import MaterialSelectionComponent from "./MaterialSelectionComponent";
import React from "react";
import MeasurementSection from "./MeasurementSections";

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

    const catalogueData = useSelector((state : RootState) => state.data.catalogs);

    let availableCompanies = ["D Decor", "Asian Paints", "ZAMAN"];

    const designNo = [ "514", "98", "123" ];

    const [Amount, setAmount] = useState(0);
    const [Tax, setTax] = useState(0);
    const [Paid, setPaid] = useState(0);
    const [Discount, setDiscount] = useState(0);

    const [additionalItems, setAdditionaItems] = useState([]);
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
      totalAmount : number;
      totalTax : number;
      quantities : [];
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
          const data = await fetchSalesAssociates();
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
      },[dispatch, fetchProductGroups, products]);

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
         

    const handleProductGroupChange = (mainindex: number,i : number, product) => {
      const updatedSelections = [...selections];
    
      // Ensure areacollection exists before accessing the index
      if (!updatedSelections[mainindex].areacollection) {
        updatedSelections[mainindex].areacollection = [];
      }
    
      // Ensure the specific index exists
      if (!updatedSelections[mainindex].areacollection[i]) {
        updatedSelections[mainindex].areacollection[i] = { productGroup: null, items : [""], catalogue: null, company: null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : [], totalTax : []};
      }
      
      const newproduct = product.split(",");

      const items = newproduct.slice(1, -2);
      console.log(items);

      updatedSelections[mainindex].areacollection[i].productGroup = newproduct;
      updatedSelections[mainindex].areacollection[i].items = items;
      setSelections(updatedSelections);
    };
    
    const handleCatalogueChange = (mainindex: number,i : number, catalogue) => {
      const updatedSelections = [...selections];
    
      if (!updatedSelections[mainindex].areacollection) {
        updatedSelections[mainindex].areacollection = [];
      }
    
      if (!updatedSelections[mainindex].areacollection[i]) {
        updatedSelections[mainindex].areacollection[i] = { productGroup: null, items : [""],  catalogue: null, company: null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : [], totalTax : [] };
      }
    
      updatedSelections[mainindex].areacollection[i].catalogue = catalogue;
      setSelections(updatedSelections);
    };
    
    const handleCompanyChange = (mainindex: number,i : number, company: string) => {
      const updatedSelections = [...selections];
    
      if (!updatedSelections[mainindex].areacollection) {
        updatedSelections[mainindex].areacollection = [];
      }
    
      if (!updatedSelections[mainindex].areacollection[i]) {
        updatedSelections[mainindex].areacollection[i] = { productGroup: null, items : [""], catalogue: null, company: null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : [], totalTax : [] };
      }
    
      updatedSelections[mainindex].areacollection[i].company = company;
      setSelections(updatedSelections);

      console.log(updatedSelections);
    };

    const handleDesignNoChange = (mainindex : number,i : number, designNo) => {
      const updatedSelections = [...selections];

      if(!updatedSelections[mainindex].areacollection){
        updatedSelections[mainindex].areacollection = [];
      }

      if(!updatedSelections[mainindex].areacollection[i]){
        updatedSelections[mainindex].areacollection[i] = { productGroup : null, items : [""], catalogue : null, company : null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : [], totalTax : [] };
      }

      updatedSelections[mainindex].areacollection[i].designNo = designNo;
      setSelections(updatedSelections);

      console.log(updatedSelections);
    }

    const handleReferenceChange = (mainindex : number, i : number, reference) => {
      const updatedSelection = [...selections];

      if(!updatedSelection[mainindex].areacollection){
        updatedSelection[mainindex].areacollection = [];
      }

      if(!updatedSelection[mainindex].areacollection[i]){
        updatedSelection[mainindex].areacollection[i] = { productGroup : null, items : [""], catalogue : null, company : null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : "0", height : "0", quantity : "0"}, additionalItems : [], totalAmount : [], totalTax : [] }
      }

      updatedSelection[mainindex].areacollection[i].reference = reference;

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
          totalAmount : [],
          totalTax : []
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

    const handleQuantityChange = async (
      key,
      value,
      mainIndex,
      collectionIndex,
      quantity,
      num1,
      num2,
      itemIndex
    ) => {
      const updatedSelections = [...selections];
    
      // Ensure the quantities array exists in this areacollection
      if (!updatedSelections[mainIndex].areacollection[collectionIndex].quantities) {
        updatedSelections[mainIndex].areacollection[collectionIndex].quantities = [];
      }
    
      // Update the quantity for this itemIndex
      updatedSelections[mainIndex].areacollection[collectionIndex].quantities[itemIndex] = value;
    
      // Calculate cost, tax and total
      const cost = num1 * quantity * value;
      const taxAmount = cost * (num2 / 100);
      const totalWithTax = cost + taxAmount;
    
      // Ensure totalTax and totalAmount arrays exist
      if (!updatedSelections[mainIndex].areacollection[collectionIndex].totalTax) {
        updatedSelections[mainIndex].areacollection[collectionIndex].totalTax = [];
      }
      if (!updatedSelections[mainIndex].areacollection[collectionIndex].totalAmount) {
        updatedSelections[mainIndex].areacollection[collectionIndex].totalAmount = [];
      }
    
      // Update tax and total values for the item
      updatedSelections[mainIndex].areacollection[collectionIndex].totalTax[itemIndex] = taxAmount;
      updatedSelections[mainIndex].areacollection[collectionIndex].totalAmount[itemIndex] = totalWithTax;
    
      setSelections(updatedSelections);
    
      // Gather tax and amount from all area collections
      const selectionTaxArray = updatedSelections.flatMap(selection =>
        selection.areacollection.flatMap(col => col.totalTax || [])
      );
      const selectionAmountArray = updatedSelections.flatMap(selection =>
        selection.areacollection.flatMap(col => col.totalAmount || [])
      );
    
      // Include additional items in total
      const additionalTaxArray = additionalItems.map(item => parseFloat(item[5]) || 0);
      const additionalAmountArray = additionalItems.map(item => parseFloat(item[6]) || 0);
    
      const totalTax = [...selectionTaxArray, ...additionalTaxArray].reduce((acc, curr) => acc + curr, 0);
      const totalAmount = [...selectionAmountArray, ...additionalAmountArray].reduce((acc, curr) => acc + curr, 0);
    
      setTax(totalTax);
      setAmount(totalAmount);
    };
    
    

    // Add a new empty item
const handleAddMiscItem = () => {
  setAdditionaItems(prev => [...prev, ["", "", "", "", "", "", "", ""]]);
};

// Delete item by index
const handleDeleteMiscItem = (itemIndex) => {
  const updated = [...additionalItems];
  updated.splice(itemIndex, 1);
  setAdditionaItems(updated);
};

// Update item name
const handleItemNameChange = (i, value) => {
  const updated = [...additionalItems];
  updated[i][0] = value;
  setAdditionaItems(updated);
};

// Update quantity and auto-update net rate, tax amount, and total amount
const handleItemQuantityChange = (i, quantity) => {
  const updated = [...additionalItems];
  updated[i][1] = quantity;
  updated[i][3] = quantity * updated[i][2]; // Net Rate
  updated[i][5] = updated[i][3] * (updated[i][4] / 100); // Tax Amount
  updated[i][6] = Number(updated[i][3]) + Number(updated[i][5]); // Total Amount
  setAdditionaItems(updated);
};

const [itemTax, setItemTax] = useState(0);
const [itemTotal, setItemTotal] = useState(0);

const recalculateItemTotals = (items) => {
  const totalTax = items.reduce((acc, item) => acc + (parseFloat(item[5]) || 0), 0);
  const totalAmount = items.reduce((acc, item) => acc + (parseFloat(item[6]) || 0), 0);

  setItemTax(totalTax);
  setItemTotal(totalAmount);
};

// Update rate and auto-update net rate, tax amount, and total amount
const handleItemRateChange = (i, rate) => {
  const updated = [...additionalItems];
  updated[i][2] = rate;
  updated[i][3] = rate * updated[i][1]; // Net Rate
  updated[i][5] = updated[i][3] * (updated[i][4] / 100); // Tax Amount
  updated[i][6] = Number(updated[i][3]) + Number(updated[i][5]); // Total Amount
  setAdditionaItems(updated);
};

// Update tax and auto-update tax amount and total amount
const handleItemTaxChange = (i, tax) => {
  const updated = [...additionalItems];

  // Ensure numeric values
  const rate = parseFloat(updated[i][2]) || 0;
  const quantity = parseFloat(updated[i][1]) || 0;
  const netRate = rate * quantity;

  updated[i][3] = netRate; // Net rate
  updated[i][4] = parseFloat(tax) || 0; // Tax %
  updated[i][5] = netRate * (updated[i][4] / 100); // Tax Amount
  updated[i][6] = netRate + updated[i][5]; // Total Amount

  setAdditionaItems(updated);

  // 🧮 Sum from additionalItems
  const additionalTax = updated.reduce((acc, item) => acc + (parseFloat(item[5]) || 0), 0);
  const additionalAmount = updated.reduce((acc, item) => acc + (parseFloat(item[6]) || 0), 0);

  // 🧮 Sum from selections.areacollection totalTax and totalAmount
  const selectionTax = selections.flatMap(sel =>
    sel.areacollection.flatMap(col => col.totalTax || [])
  ).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

  const selectionAmount = selections.flatMap(sel =>
    sel.areacollection.flatMap(col => col.totalAmount || [])
  ).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

  // 💡 Combine both
  const totalTax = additionalTax + selectionTax;
  const totalAmount = additionalAmount + selectionAmount;

  setTax(totalTax);
  setAmount(totalAmount);
};


const [status, changeStatus] = useState("approved");
const [interiorArray, setInteriorArray] = useState([]);
const [salesAssociateArray, setSalesAssociateArray] = useState([]);
const [projectName, setProjectName] = useState("");
const [projectReference, setProjectReference] = useState("");
const [user, setUser] = useState("");
const [projectDate, setPRojectDate] = useState("");
const [additionalRequests, setAdditionalRequests] = useState("");
// Update remark
const handleItemRemarkChange = (i, remark) => {
  const updated = [...additionalItems];
  updated[i][7] = remark;
  setAdditionaItems(updated);
};

    const [selectedMainIndex, setSelectedMainIndex] = useState(null);
    const [selectedCollectionIndex, setSelectedCollectionIndex] = useState(null);

    const sendProjectData = async () => {
      try {
        const response = await fetch(
          "https://sheeladecor.netlify.app/.netlify/functions/server/sendprojectdata",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              projectName: projectName,
              customerLink: JSON.stringify(selectedCustomer), // Serialize array to string
              projectReference: projectReference,
              status: status,
              totalAmount: Amount,
              totalTax: Tax,
              paid: Paid,
              discount: Discount,
              createdBy: user,
              allData: JSON.stringify(selections), // Serialize object/array to string
              projectDate: projectDate,
              additionalRequests : additionalRequests,
              interiorArray : JSON.stringify(interiorArray),
              salesAssociateArray : JSON.stringify(salesAssociateArray),
              additionalItems : JSON.stringify(additionalItems),
            }),
          }
        );
    
        console.log("Response:", response);
    
        if (response.status === 200) {
          alert("Project Added");
        } else {
          const errorText = await response.text(); // Get error details
          console.error("Error response:", errorText);
          alert("Error: Failed to add project");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Error: Network issue or server not responding");
      }
    };

  return (
    <div className="flex flex-col gap-3 w-full h-screen">
        <div className="flex flex-col w-full">
            <p className="lg:text-[1.8vw]">Add New Project</p>
            <div className="flex gap-3 -mt-3">
                <Link to="/" className="text-[1vw] text-black !no-underline">Dashboard</Link>
                <Link to="/projects" className="text-[1vw] text-black !no-underline">All Projects</Link>
            </div>
        </div>
        <CustomerDetails
          customers={customers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          projectData={projectData}
        />
        <ProjectDetails
              selectedCustomer={selectedCustomer}
              interior={interior}
              salesdata={salesdata}
              interiorArray={interiorArray}
              setInteriorArray={setInteriorArray}
              salesAssociateArray={salesAssociateArray}
              setSalesAssociateArray={setSalesAssociateArray}
              projectName={projectName}
              setProjectName={setProjectName}
              projectReference={projectReference}
              setProjectReference={setProjectReference}
              user={user}
              setUser={setUser}
              projectDate={projectDate}
              setProjectDate={setPRojectDate}
              setAdditionalRequests={setAdditionalRequests}
              additionalRequests={additionalRequests}
            />

        <MaterialSelectionComponent
          selections={selections}
          availableAreas={availableAreas}
          availableProductGroups={availableProductGroups}
          availableCompanies={availableCompanies}
          catalogueData={catalogueData}
          designNo={designNo}
          handleAddArea={handleAddArea}
          handleRemoveArea={handleRemoveArea}
          handleAreaChange={handleAreaChange}
          handleAddNewGroup={handleAddNewGroup}
          handleProductGroupChange={handleProductGroupChange}
          handleCompanyChange={handleCompanyChange}
          handleCatalogueChange={handleCatalogueChange}
          handleDesignNoChange={handleDesignNoChange}
          handleReferenceChange={handleReferenceChange}
          handleGroupDelete = {handleGroupDelete}
        />
        
        <MeasurementSection
          selections={selections}
          units={units}
          handleRemoveArea={handleRemoveArea}
          handleReferenceChange={handleReferenceChange}
          handleunitchange={handleunitchange}
          handlewidthchange={handlewidthchange}
          handleheightchange={handleheightchange}
          handlequantitychange={handlequantitychange}
        />
        <div className="flex flex-col p-6 border rounded-lg w-full shadow-2xl">
      <p className="text-[1.1vw]">Quotation</p>
      <div className="flex flex-col gap-3 w-full">
        {selections.map((selection, mainindex) => (
          <div key={mainindex} className="w-full">
            <p className="text-[1.1vw] font-semibold mb-2">{selection.area}</p>
            <table className="w-full border-collapse mb-6 text-[0.95vw]">
              <thead>
                <tr className="flex justify-between w-full bg-gray-100 p-2 border-b font-semibold">
                  <td className="w-[10%]">Sr. No.</td>
                  <td className="w-[45%]">Product Name</td>
                  <td className="w-[45%]">Size</td>
                  <td className="w-[20%]">MRP</td>
                  <td className="w-[20%]">Quantity</td>
                  <td className="w-[20%]">Subtotal</td>
                  <td className="w-[20%]">Tax Rate (%)</td>
                  <td className="w-[20%]">Tax Amount</td>
                  <td className="w-[20%]">Total</td>
                </tr>
              </thead>
              <tbody>
  {selection.areacollection && selection.areacollection.length > 0 ? (
    selection.areacollection.map((collection, collectionIndex) => {
      const pg = collection.productGroup;

      if (!Array.isArray(pg) || pg.length < 2) return null;

      const relevantPG = pg.length > 2 ? pg.slice(1, -2) : [];

      // Replace strings in productGroup with matched item arrays
      const matchedItems = relevantPG.map((pgItem) => {
        const matched = items.find((item) => item[0] === pgItem);
        return matched || pgItem; // if match not found, keep original
      });

      // Update productGroup with replaced arrays
      collection.items = [                 // keep the first element (title/groupName maybe)
        ...matchedItems,          // updated product items       // last (e.g., addon maybe)
      ];

      // Filter only matched full item arrays (to avoid rendering original strings)
      const validMatchedItems = matchedItems.filter((el) => Array.isArray(el));

      return validMatchedItems.map((item, itemIndex) => {
        const key = `${mainindex}-${collectionIndex}-${itemIndex}`;
        const qty = selection.areacollection[collectionIndex]?.quantities?.[itemIndex] || 0;

        return (
          <tr key={key} className="flex justify-between w-full border-b p-2">
            <td className="w-[10%]">{itemIndex + 1}</td>
            <td className="w-[45%]">{item[0] + " * " + collection.measurement.quantity}</td>
            <td className="w-[45%]">
              {collection.measurement.width + "*" + collection.measurement.height + " " + collection.measurement.unit}
            </td>
            <td className="w-[20%]">{item[4] * collection.measurement.quantity}</td>
            <td className="w-[20%]">
              <div className="flex flex-col">
                <input
                  type="text"
                  value={selection.areacollection[collectionIndex]?.quantities?.[itemIndex] || ""} 
                  onChange={(e) =>
                    handleQuantityChange(
                      key,
                      e.target.value,
                      mainindex,
                      collectionIndex,
                      collection.measurement.quantity,
                      item[4],
                      item[5],
                      itemIndex
                    )
                  }
                  className="border w-[40%] px-2 py-1 rounded"
                />
                <p className=" text-[0.8vw] text-gray-600">{item[3]}</p>
              </div>
            </td>
            <td className="w-[20%]">{item[4] * collection.measurement.quantity * qty}</td>
            <td className="w-[20%]">{item[5]}</td>
            <td className="w-[20%]">{collection.totalTax[itemIndex]}</td>
            <td className="w-[20%]">{collection.totalAmount[itemIndex]}</td>
          </tr>
        );
      });
    })
  ) : (
    <tr>
      <td colSpan="7" className="text-center py-2 text-gray-500">
        No product data available.
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        ))}
      </div>
      <div className="border p-6 rounded-lg w-full flex flex-col">
  <p className="text-[1.1vw] font-semibold">Miscellaneous</p>
  <div className="flex w-full flex-col">
    <div className="flex flex-row justify-between items-center mt-4">
      <button
        className="flex flex-row gap-2 rounded-xl bg-sky-50 hover:bg-sky-100 items-center px-2 py-1"
        onClick={handleAddMiscItem}
      >
        <FaPlus className="text-sky-500 mt-1" />
        Add Item
      </button>
    </div>

    <table className="mt-3 w-full">
      <thead>
        <tr className="ml-3 flex text-[1.1vw] w-full justify-between">
          <td className="w-[3vw]">SR</td>
          <td className="w-[6vw]">Item Name</td>
          <td className="w-[6vw]">Quantity</td>
          <td className="w-[6vw]">Rate</td>
          <td className="w-[6vw]">Net Rate</td>
          <td className="w-[6vw]">Tax (%)</td>
          <td className="w-[6vw]">Tax Amount</td>
          <td className="w-[6vw]">Total Amount</td>
          <td className="w-[6vw]">Remark</td>
          <td className="w-[6vw]">Actions</td>
        </tr>
      </thead>

      <tbody className="flex flex-col w-full">
        {additionalItems.map((item, i) => (
          <tr key={i} className="w-full flex flex-row justify-between mt-2">
            <td className="text-center w-[3vw]">{i + 1}</td>
            <td>
              <input
                onChange={(e) => handleItemNameChange(i, e.target.value)}
                className="pl-2 w-[6vw] border rounded-lg"
                value={item[0] || ""}
                type="text"
              />
            </td>
            <td>
              <input
                onChange={(e) => handleItemQuantityChange(i, e.target.value)}
                className="pl-2 w-[6vw] border rounded-lg"
                value={item[1] || ""}
                type="text"
              />
            </td>
            <td>
              <input
                onChange={(e) => handleItemRateChange(i, e.target.value)}
                className="pl-2 w-[6vw] border rounded-lg"
                value={item[2] || ""}
                type="text"
              />
            </td>
            <td className="w-[6vw] text-center">{item[3]}</td>
            <td>
              <input
                onChange={(e) => handleItemTaxChange(i, e.target.value)}
                className="pl-2 w-[6vw] border rounded-lg"
                value={item[4] || ""}
                type="text"
              />
            </td>
            <td className="w-[6vw] text-center">{item[5] || 0}</td>
            <td className="w-[6vw] text-center">{item[6] || 0}</td>
            <td>
              <input
                onChange={(e) => handleItemRemarkChange(i, e.target.value)}
                className="pl-2 w-[6vw] border rounded-lg"
                value={item[7] || ""}
                type="text"
              />
            </td>
            <td className="w-[6vw] text-center">
              <button onClick={() => handleDeleteMiscItem(i)}>
                <FaTrash className="text-red-500 hover:text-red-600" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
          <div className="shadow-xl p-6 flex flex-col gap-2 border w-1/2 rounded-lg">
            <p className="text-[1.2vw]">Summary</p>
            <div className="flex flex-row justify-between w-full">
              <p className="text-[1.1vw]">Sub Total</p>
              <p className="text-[1.1vw]">{Amount}</p>
            </div>
            <div className="flex flex-row justify-between w-full">
              <p className="text-[1.1vw]">Total Tax Amount</p>
              <p className="text-[1.1vw]">{Tax}</p>
            </div>
            <div className="flex flex-row justify-between w-full">
              <p className="text-[1.1vw]">Total Amount</p>
              <p className="text-[1.1vw]">{Amount + Tax}</p>
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex justify-between mt-1 w-full">
              <p className="text-[1.1vw]">Discount</p>
              <input className="rounded-lg border text-center" value={Discount} onChange={(e) => setDiscount(e.target.value)} type="text" />
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-[1.1vw]">Grand Total</p>
              <p className="text-[1.1vw]">{Amount + Tax - Discount}</p>
            </div>
            <button onClick={sendProjectData} style={{borderRadius : "10px"}} className="rounded-lg bg-sky-700 hover:bg-sky-800 text-white p-[6px]">Update & Generate Quote</button>
          </div>

        <br />
    </div>
  )
}

export default AddProjectForm;