/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import OverviewPage from './OverviewPage';
import { setPaymentData , setSalesAssociateData, setInteriorData, setCustomerData, setProducts, setCatalogs, setProjects, setItemData, setProjectFlag, setTasks, setTailorData } from "../Redux/dataSlice";
import CustomerDetails from "./CustomerDetails";
import ProjectDetails from "./ProjectDetails";
import EditCustomerDetails from "./Edit/EditCustomerDetails";
import EditProjectDetails from "./Edit/EditProjectDetails";
import MaterialSelectionComponent from "./MaterialSelectionComponent";
import MeasurementSection from "./MeasurementSections";
import QuotationTable from "./QuotationTable";
import { Disc, Edit } from "lucide-react";
import { FaPlus, FaTrash } from "react-icons/fa";
import PaymentsSection from "./PaymentSection";
import TailorsSection from "./TailorsSection";
import { AnimatePresence, motion } from "framer-motion";
import TaskDialog from "../compoonents/TaskDialog";
import { useCallback } from "react";

const EditProjects = ({ projectData, index, goBack, projects, Tax, setTax, Amount, setAmount, Discount, setDiscount }) => {

    const [currentStatus, setCurrentStatus] = useState("Unsent");
    const [navState, setNavState] = useState("Overview");
    const [status, changeStatus] = useState("approved");

    const dispatch = useDispatch();
    const customerData = useSelector((state : RootState) => state.data.customers);
    const interiorData = useSelector((state : RootState) => state.data.interiors);
    const salesAssociateData = useSelector((state : RootState) => state.data.salesAssociates);
    const products = useSelector((state : RootState) => state.data.products);
    const items = useSelector((state : RootState) => state.data.items);
    const paymentData = useSelector((state : RootState) => state.data.paymentData);
    const tailors = useSelector((state : RootState) => state.data.tailors);

    const catalogueData = useSelector((state : RootState) => state.data.catalogs);
    const Tasks = useSelector((state : RootState) => state.data.tasks);
    let availableCompanies = ["D Decor", "Asian Paints", "ZAMAN"];
    const designNo = [ "514", "98", "123" ];
    
    const [ customers, setcustomers ] = useState<[]>([]);
    const [ selectedCustomer, setSelectedCustomer ] = useState(null);
    
    const [singleitems, setsingleitems] = useState([]);
    
    const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
    
    const [ interior, setinterior ] = useState([]);
    const [ salesdata, setsalesdata ] = useState([]);
    const [availableProductGroups, setAvailableProductGroups] = useState([]);

    const [additionalItems, setAdditionaItems] = useState<additional[]>([]);

    const [editPayments, setEditPayments] = useState(undefined);
    interface additional{
      name : string;
      quantity : number;
      rate : number;
      netRate : number;
      tax : number;
      taxAmount : number;
      totalAmount : number;
      remark : string;
    }
    const [availableAreas, setAvailableAreas] = useState([]);
    
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
          totalAmount : [];
          totalTax : [];
          quantities : [];
        }
    
        interface ProductGroup {
          groupName: string;
          mainProducts: string;
          addonProducts: string;
          color: string;
          needsTailoring: boolean;
        }
        interface Goods {
          pg;
          date;
          status;
          orderID;
          remark;
          mainindex;
          groupIndex;
          item;
        }
    
        interface Tailor{
          pg;
          rate;
          tailorData;
          status;
          remark;
          mainindex;
          groupIndex;
          item;
        }
    const units = ["Inches (in)", "Centimeter (cm)", "Meters (m)", "Feet (ft)"];
    
    const [selections, setSelections] = useState<AreaSelection[]>([]);
    const [interiorArray, setInteriorArray] = useState([]);
    const [salesAssociateArray, setSalesAssociateArray] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [projectReference, setProjectReference] = useState("");
    const [user, setUser] = useState("");
    const [projectDate, setPRojectDate] = useState("");
    const [additionalRequests, setAdditionalRequests] = useState("");
    const [projectAddress, setProjectAddress] = useState("");

    const fetchTaskData = async () => {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks");
      const data = await response.json();
      return data.body;
    };

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
      
      async function fetchAllAreas(){
        try {
          const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getAreas", {
            credentials: "include",
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          return Array.isArray(data.body) ? data.body : [];
        } catch (error) {
          console.error("Error fetching Areas:", error);
          return [];
        }      
      }

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
        const clonedSelections = JSON.parse(JSON.stringify(projectData.allData || []));
        const clonedAdditionalItems = JSON.parse(JSON.stringify(projectData.additionalItems || []));
      
        setSelections(clonedSelections);
        setAdditionaItems(clonedAdditionalItems);
        setSelectedCustomer(projectData.customerLink);
        setUser(projectData.createdBy);
        setPRojectDate(projectData.projectDate);
        setAdditionalRequests(projectData.additionalRequests);
        setInteriorArray(projectData.interiorArray);
        setSalesAssociateArray(projectData.salesAssociateArray);
        setProjectReference(projectData.projectReference);
        setProjectAddress(projectData.projectAddres);
        if(Object.isFrozen(additionalItems)){
          console.log("frozen");
        }
      }, [projectData]);
      

      const useFetchData = () => {
        const fetchAndSetData = useCallback(
          async (fetchFn, dispatchFn, localStateSetter, storeData, keyName = "") => {
            try {
              const oneHour = 3600 * 1000; // 1 hour in ms
              let shouldFetch = true;
      
              if (keyName) {
                const cached = localStorage.getItem(keyName);
                if (cached) {
                  const { data, time } = JSON.parse(cached);
      
                  // If cache is valid
                  if (Date.now() - time < oneHour) {
                    dispatch(dispatchFn(data));
                    if (localStateSetter) localStateSetter(data);
                    shouldFetch = false; // No need to fetch from server
                  } else {
                    localStorage.removeItem(keyName); // expired cache
                  }
                }
              }
      
              // If store is empty or cache expired, fetch fresh
              if (shouldFetch || storeData.length === 0) {
                const data = await fetchFn();
                dispatch(dispatchFn(data));
                if (localStateSetter) localStateSetter(data);
      
                if (keyName) {
                  localStorage.setItem(keyName, JSON.stringify({ data, time: Date.now() }));
                }
              }
            } catch (error) {
              console.error(`Error fetching ${keyName || 'data'}:`, error);
            }
          },
          [dispatch]
        );
      
        useEffect(() => {
          fetchAndSetData(fetchInteriors, setInteriorData, setinterior, interiorData, "interiorData");
      
          fetchAndSetData(
            async () => {
              const response = await fetch(
                "https://sheeladecor.netlify.app/.netlify/functions/server/getsingleproducts",
                { credentials: "include" }
              );
              const data = await response.json();
              return data.body || [];
            },
            setItemData,
            setsingleitems,
            items,
            "itemsData"
          );
      
          fetchAndSetData(fetchSalesAssociates, setSalesAssociateData, setsalesdata, salesAssociateData, "salesAssociateData");
      
          fetchAndSetData(fetchProductGroups, setProducts, setAvailableProductGroups, products, "productsData");
      
          fetchAndSetData(fetchCatalogues, setCatalogs, null, catalogueData, "catalogueData");
      
          fetchAndSetData(fetchCustomers, setCustomerData, setcustomers, customerData, "customerData");
      
        }, [
          fetchAndSetData,
          interiorData.length,
          items.length,
          salesAssociateData.length,
          products.length,
          catalogueData.length,
          customerData.length,
        ]);
      };
      

  useFetchData();

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
     

  const handleProductGroupChange = (mainindex: number, i: number, product: string) => {
    const updatedSelections = [...selections];
  
    if (!updatedSelections[mainindex].areacollection) {
      updatedSelections[mainindex].areacollection = [];
    }
  
    if (!updatedSelections[mainindex].areacollection[i]) {
      updatedSelections[mainindex].areacollection[i] = {
        productGroup: null,
        items: [],
        catalogue: [],
        company: null,
        designNo: null,
        reference: null,
        measurement: { unit: "Centimeter (cm)", width: undefined, height: undefined, quantity: undefined },
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }
  
    const newproduct = product.split(",");
    updatedSelections[mainindex].areacollection[i].productGroup = newproduct;
  

    const pg = newproduct;
    if (!Array.isArray(pg) || pg.length < 2) return;
  
    console.log(pg);

    let relevantPG = pg.length > 2 ? pg.slice(1, -1) : null;
  
    let newMatchedItems = null;

    console.log(relevantPG);

    if(relevantPG != null){
      newMatchedItems = relevantPG.map(pgItem =>
        items.find(item => item[0] === pgItem)
      ).filter(item => Array.isArray(item));
    }else{
      newMatchedItems = [product];
    }
    console.log(newMatchedItems);

    if(newMatchedItems.length == 0){
      newMatchedItems = [product.split(",")];
    }
    console.log(newMatchedItems);
  
    updatedSelections[mainindex].areacollection[i].items = newMatchedItems;
    setSelections(updatedSelections);
  
    const filteredGoods = goodsArray.filter(
      g => !(g.mainindex === mainindex && g.groupIndex === i)
    );
  
    const newGoods = newMatchedItems.map((item) => ({
      mainindex,
      groupIndex: i,
      pg: newproduct,
      date: "",
      status: "Pending",
      orderID: "",
      remark: "NA",
      item: item,
    }));
  
    setGoodsArray([...filteredGoods, ...newGoods]);
  
    const filteredTailors = tailorsArray.filter(
      t => !(t.mainindex === mainindex && t.groupIndex === i)
    );
  
    const newTailors = newMatchedItems
      .filter(item => item[7] == true)
      .map((item, itemIndex) => ({
        mainindex,
        groupIndex: i,
        pg: newproduct,
        rate: 0,
        tailorData: [""],
        status: "Pending",
        remark: "NA",
        item: item,
      }));
  
    setTailorsArray([...filteredTailors, ...newTailors]);
  };
  
  

  const handleCatalogueChange = (mainindex: number, i: number, catalogue: string) => {
    const updatedSelections = [...selections];
  
    if (!updatedSelections[mainindex].areacollection) {
      updatedSelections[mainindex].areacollection = [];
    }
  
    if (!updatedSelections[mainindex].areacollection[i]) {
      updatedSelections[mainindex].areacollection[i] = {
        productGroup: null,
        items: [""],
        catalogue: [],
        company: null,
        designNo: null,
        reference: null,
        measurement: { unit: "Centimeter (cm)", width: undefined, height: undefined, quantity: undefined },
        additionalItems: [],
        totalAmount: [],
        totalTax: []
      };
    }
  
    updatedSelections[mainindex].areacollection[i].catalogue = catalogue
      .split(",")
      .map(item => item.trim())
      .filter(item => item);
  
    setSelections(updatedSelections);
    console.log(updatedSelections[mainindex].areacollection[i].catalogue)
  };

const handleCompanyChange = (mainindex: number,i : number, company: string) => {
  const updatedSelections = [...selections];

  if (!updatedSelections[mainindex].areacollection) {
    updatedSelections[mainindex].areacollection = [];
  }

  if (!updatedSelections[mainindex].areacollection[i]) {
    updatedSelections[mainindex].areacollection[i] = { productGroup: null, items : [""], catalogue: null, company: null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : undefined, height : undefined, quantity : undefined}, additionalItems : [], totalAmount : [], totalTax : [] };
  }

  updatedSelections[mainindex].areacollection[i].company = company;
  setSelections(updatedSelections);
};

const handleDesignNoChange = (mainindex : number,i : number, designNo) => {
  const updatedSelections = [...selections];

  if(!updatedSelections[mainindex].areacollection){
    updatedSelections[mainindex].areacollection = [];
  }

  if(!updatedSelections[mainindex].areacollection[i]){
    updatedSelections[mainindex].areacollection[i] = { productGroup : null, items : [""], catalogue : null, company : null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : undefined, height : undefined, quantity : undefined}, additionalItems : [], totalAmount : [], totalTax : [] };
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
    updatedSelection[mainindex].areacollection[i] = { productGroup : null, items : [""], catalogue : null, company : null, designNo : null, reference : null, measurement : {unit : "Centimeter (cm)", width : undefined, height : undefined, quantity : undefined}, additionalItems : [], totalAmount : [], totalTax : [] }
  }

  updatedSelection[mainindex].areacollection[i].reference = reference;

  setSelections(updatedSelection);

}

const handleAddNewGroup = (mainindex: number, productGroupString = "") => {
  const updatedSelections = [...selections];

  if (!updatedSelections[mainindex]?.areacollection) {
    updatedSelections[mainindex].areacollection = [];
  }

  const groupIndex = updatedSelections[mainindex].areacollection.length;

  // Parse product group string (can be empty initially)
  const productGroupArray = productGroupString ? productGroupString.split(",") : [];

  const relevantPG = productGroupArray.length > 2 ? productGroupArray.slice(1, -2) : [];

  const matchedItems = relevantPG
    .map(pgName => items.find(item => item[0] === pgName))
    .filter(item => Array.isArray(item));

  // Add the new group
  updatedSelections[mainindex].areacollection.push({
    productGroup: productGroupArray,
    company: "",
    catalogue: [],
    designNo: "",
    reference: "",
    measurement: { unit: "Centimeter (cm)", width: undefined, height: undefined, quantity: undefined },
    items: matchedItems,
    additionalItems: [],
    totalAmount: [],
    totalTax: []
  });

  setSelections(updatedSelections);

  // Create new goodsArray entries
  const newGoods = matchedItems.map(item => ({
    mainindex,
    groupIndex,
    pg: productGroupArray,
    date: "",
    status: "Pending",
    orderID: "",
    remark: "NA",
    item : item,
  }));

  // Create new tailorsArray entries
  const newTailors = matchedItems
    .filter(item => item[2] === "Tailoring")
    .map(item => ({
      mainindex,
      groupIndex,
      pg: productGroupArray,
      rate: 0,
      tailorData: [""],
      status: "Pending",
      remark: "NA",
      item : item
    }));

  // Add new entries
  setGoodsArray(prev => [...prev, ...newGoods]);
  setTailorsArray(prev => [...prev, ...newTailors]);
};


const handleGroupDelete = (mainindex: number, index: number) => {
  const updatedSelection = [...selections];
  if (updatedSelection[mainindex].areacollection[index]) {
    updatedSelection[mainindex].areacollection.splice(index, 1);
  }

  setSelections(updatedSelection);

  // Remove matching goods and tailors for this group
  setGoodsArray(prev =>
    prev.filter(g => !(g.mainindex === mainindex && g.groupIndex === index))
  );

  setTailorsArray(prev =>
    prev.filter(t => !(t.mainindex === mainindex && t.groupIndex === index))
  );

  console.log(goodsArray);
  console.log(tailorsArray);
};


const handleAddArea = () => {
  setSelections([...selections, { area: "", areacollection : []}]);
};

const handleRemoveArea = (index: number) => {
  const updatedSelections = [...selections];
  const removedArea = updatedSelections[index];

  // Count how many product groups (areacollection) are in the removed area
  let productGroupCount = 0;
  removedArea.areacollection.forEach(collection => {
    productGroupCount += collection.items.length;
  });

  // Calculate the starting index in goodsArray and tailorsArray for this area
  let startIndex = 0;
  for (let i = 0; i < index; i++) {
    selections[i].areacollection.forEach(collection => {
      startIndex += collection.items.length;
    });
  }

  // Remove corresponding items from goodsArray and tailorsArray
  const updatedGoodsArray = [...goodsArray];
  const updatedTailorsArray = [...tailorsArray];
  updatedGoodsArray.splice(startIndex, productGroupCount);
  updatedTailorsArray.splice(startIndex, productGroupCount);

  // Update state
  setGoodsArray(updatedGoodsArray);
  setTailorsArray(updatedTailorsArray);
  setSelections(updatedSelections.filter((_, i) => i !== index));
};


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
const recalculateTotals = (updatedSelections, additionalItems) => {
  const selectionTaxArray = updatedSelections.flatMap(selection =>
    selection.areacollection.flatMap(col => col.totalTax || [])
  );

  const selectionAmountArray = updatedSelections.flatMap(selection =>
    selection.areacollection.flatMap(col => col.totalAmount || [])
  );

  const additionalTaxArray = additionalItems.map(item => parseFloat(item.taxAmount) || 0);
  const additionalAmountArray = additionalItems.map(item => parseFloat(item.totalAmount) || 0);

  const totalTax = parseFloat(([...selectionTaxArray, ...additionalTaxArray].reduce((acc, curr) => acc + curr, 0)).toFixed(2));
  const totalAmount = parseFloat(([...selectionAmountArray, ...additionalAmountArray].reduce((acc, curr) => acc + curr, 0)).toFixed(2));

  return { totalTax, totalAmount };
};

const handlequantitychange = (mainIndex, index, quantity) => {
  const updatedSelections = [...selections];
  const areaCol = updatedSelections[mainIndex].areacollection[index];

  // Update the quantity in measurement
  areaCol.measurement.quantity = quantity;

  let taxSum = 0;
  let amountSum = 0;
  let corrected = [[]];
  if (areaCol.items !== undefined) {
    // Ensure arrays exist
    if (!areaCol.totalTax) areaCol.totalTax = [];
    if (!areaCol.totalAmount) areaCol.totalAmount = [];
  
    let taxSum = 0;
    let amountSum = 0;
  
    const corrected = areaCol.items.map((item, i) => {
      const itemQuantity = parseFloat(updatedSelections[mainIndex].areacollection[index].quantities?.[i]) || 0;
      const itemRate = parseFloat(item[4]) || 0;
      const itemTaxPercent = parseFloat(item[5]) || 0;
  
      const netRate = quantity * itemQuantity * itemRate;
      const taxAmount = parseFloat((netRate * (itemTaxPercent / 100)).toFixed(2));
      const totalAmount = parseFloat((netRate + taxAmount).toFixed(2));
  
      // Store per-item totals in the areaCol arrays
      areaCol.totalTax[i] = taxAmount;
      areaCol.totalAmount[i] = totalAmount;
  
      taxSum += taxAmount;
      amountSum += totalAmount;
  
      // Update item[5] = taxAmount and item[6] = totalAmount
      return [
        ...item.slice(0, 5),
        taxAmount,     // index 5
        totalAmount    // index 6
      ];
    });
  
    areaCol.items = corrected; // Optional: store full amount sum
  }
  

  setSelections(updatedSelections);

  const { totalTax, totalAmount } = recalculateTotals(updatedSelections, additionalItems);
  setTax(totalTax);
  setAmount(totalAmount);

};

const handleunitchange = (mainindex : number, index : number, unit) => {
  const updatedSelection = [...selections];
  updatedSelection[mainindex].areacollection[index].measurement.unit = unit;
  setSelections(updatedSelection);
}
const [quantities, setQuantities] = useState({});
const [Paid, setPaid] = useState(0);
const [Received, setReceived] = useState(0);

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

  if (!updatedSelections[mainIndex].areacollection[collectionIndex].quantities) {
    updatedSelections[mainIndex].areacollection[collectionIndex].quantities = [];
  }

  updatedSelections[mainIndex].areacollection[collectionIndex].quantities[itemIndex] = value;

  const cost = num1 * quantity * value;
  const taxAmount = cost * (num2 / 100);
  const totalWithTax = cost + taxAmount;

  if (!updatedSelections[mainIndex].areacollection[collectionIndex].totalTax) {
    updatedSelections[mainIndex].areacollection[collectionIndex].totalTax = [];
  }

  if (!updatedSelections[mainIndex].areacollection[collectionIndex].totalAmount) {
    updatedSelections[mainIndex].areacollection[collectionIndex].totalAmount = [];
  }

  updatedSelections[mainIndex].areacollection[collectionIndex].totalTax[itemIndex] = parseFloat(taxAmount.toFixed(2));
  updatedSelections[mainIndex].areacollection[collectionIndex].totalAmount[itemIndex] = parseFloat(totalWithTax.toFixed(2));

  setSelections(updatedSelections);

  const { totalTax, totalAmount } = recalculateTotals(updatedSelections, additionalItems);
  console.log(totalAmount);
  setTax(totalTax);
  setAmount(totalAmount);
};

const handleItemQuantityChange = (i, quantity) => {
  const updated = [...additionalItems];
  updated[i].quantity = quantity;
  updated[i].netRate = parseFloat((quantity * updated[i].rate).toFixed(2)); // Net Rate
  updated[i].taxAmount = parseFloat((updated[i].netRate * (updated[i].tax / 100)).toFixed(2)); // Tax Amount
  updated[i].totalAmount = parseFloat(((updated[i].netRate) + Number(updated[i].taxAmount)).toFixed(2)); // Total Amount
  setAdditionaItems(updated);
};

const handleAddMiscItem = () => {
  setAdditionaItems(prev => [
    ...prev,
    {
      name: "",
      quantity: 0,
      rate: 0,
      netRate: 0,
      tax: 0,
      taxAmount: 0,
      totalAmount: 0,
      remark: ""
    }
  ]);
};


// Delete item by index
const handleDeleteMiscItem = (itemIndex) => {
  const updated = [...additionalItems];
  updated.splice(itemIndex, 1);
  setAdditionaItems(updated);
};

const [itemTax, setItemTax] = useState(0);
const [itemTotal, setItemTotal] = useState(0);

const handleItemNameChange = (i, value) => {
  const updated = [...additionalItems];
  updated[i].name = value;
  setAdditionaItems(updated);
};

const recalculateItemTotals = (items) => {
  const totalTax = items.reduce((acc, item) => acc + (parseFloat(item[5]) || 0), 0);
  const totalAmount = items.reduce((acc, item) => acc + (parseFloat(item[6]) || 0), 0);

  setItemTax(totalTax);
  setItemTotal(totalAmount);
};

// Update rate and auto-update net rate, tax amount, and total amount
const handleItemRateChange = (i, rate) => {
  const updated = [...additionalItems];
  updated[i].rate = rate;
  updated[i].netRate = parseFloat((updated[i].quantity * updated[i].rate).toFixed(2));// Net Rate
  updated[i].taxAmount = parseFloat((updated[i].netRate * (updated[i].tax / 100)).toFixed(2)); // Tax Amount
  updated[i].totalAmount = parseFloat(((updated[i].netRate) + updated[i].taxAmount).toFixed(2)); // Total Amount
  setAdditionaItems(updated);

    // 🧮 Sum from additionalItems
    const additionalTax = updated.reduce((acc, item) => acc + (parseFloat(item.taxAmount) || 0), 0);
    const additionalAmount = updated.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0);
  
    // 🧮 Sum from selections.areacollection totalTax and totalAmount
    const selectionTax = selections.flatMap(sel =>
      sel.areacollection.flatMap(col => col.totalTax || [])
    ).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  
    const selectionAmount = selections.flatMap(sel =>
      sel.areacollection.flatMap(col => col.totalAmount || [])
    ).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  
    // 💡 Combine both
    const totalTax = parseFloat((additionalTax + selectionTax).toFixed(2));
    const totalAmount = parseFloat((additionalAmount + selectionAmount).toFixed(2));
  
    setTax(totalTax);
    setAmount(totalAmount);
};

// Update tax and auto-update tax amount and total amount
const handleItemTaxChange = (i, tax) => {
  const updated = [...additionalItems];

  // Ensure numeric values
  const rate = parseFloat(updated[i].rate) || 0;
  const quantity = parseFloat(updated[i].quantity) || 0;
  const netRate = rate * quantity;

  updated[i].netRate =  parseFloat((quantity * updated[i].rate).toFixed(2));; // Net rate
  updated[i].tax = tax; // Tax %
  updated[i].taxAmount = parseFloat((updated[i].netRate * (updated[i].tax / 100)).toFixed(2)); // Tax Amount
  updated[i].totalAmount = parseFloat(((updated[i].netRate) + updated[i].taxAmount).toFixed(2)); // Total Amount

  setAdditionaItems(updated);

  // 🧮 Sum from additionalItems
  const additionalTax = updated.reduce((acc, item) => acc + (parseFloat(item.taxAmount) || 0), 0);
  const additionalAmount = updated.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0);

  // 🧮 Sum from selections.areacollection totalTax and totalAmount
  const selectionTax = selections.flatMap(sel =>
    sel.areacollection.flatMap(col => col.totalTax || [])
  ).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

  const selectionAmount = selections.flatMap(sel =>
    sel.areacollection.flatMap(col => col.totalAmount || [])
  ).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

  // 💡 Combine both
  const totalTax = parseFloat((additionalTax + selectionTax).toFixed(2));
  const totalAmount = parseFloat((additionalAmount + selectionAmount).toFixed(2));

  setTax(totalTax);
  setAmount(totalAmount);
};
const handleItemRemarkChange = (i, remark) => {
  const updated = [...additionalItems];
  updated[i].remark = remark;
  setAdditionaItems(updated);
};



    const [goodsArray, setGoodsArray] = useState<Goods[]>([]);
    const [tailorsArray, setTailorsArray] = useState<Tailor[]>([]);

    useEffect(() => {
      const deepClone = (data) => JSON.parse(JSON.stringify(data));
      setAdditionaItems(deepClone(projectData.additionalItems));
      setGoodsArray(deepClone(projectData.goodsArray));
      setTailorsArray(deepClone(projectData.tailorsArray));
      console.log(projectData.goodsArray);
    }, [projectData]);

  
  const [selectedMainIndex, setSelectedMainIndex] = useState(null);
  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState(null);

const setGoodsDate = (index , date) => {
  let newarray = [...goodsArray];
  newarray[index].date = date;
  setGoodsArray(newarray);
}
const setGoodsStatus = (index , status) => {
  let newarray = [...goodsArray];
  newarray[index].status = status;
  setGoodsArray(newarray);
}
const setGoodsOrderID = (index , orderID) => {
  let newarray = [...goodsArray];
  newarray[index].orderID = orderID;
  setGoodsArray(newarray);
}
const setGoodsRemark  = (index , remark) => {
  let newarray = [...goodsArray];
  newarray[index].remark = remark;
  setGoodsArray(newarray);
}

const [payment, setPayment] = useState(0);
const [paymentDate, setPaymentDate] = useState("");
const [paymentMode, setPaymentMode] = useState("");
const [paymentRemarks, setPaymentRemarks] = useState("");

const [addPayment , setAddPayment] = useState(false);

// eslint-disable-next-line react-hooks/exhaustive-deps
const fetchPaymentData = async () => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments"); 
  const data = await response.json();
  return data.message;
}

const fetchTailorData = async () => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettailors");
  const data = await response.json();
  return data.body;
}

const hasFetchedPayments = useRef(false);
const [added, setAdded] = useState(false);
useEffect(() => {
  let isMounted = true; // To avoid state updates on unmounted component

  const fetchAndStoreData = async () => {
    try {
      // Parallel fetch
      const [paymentData, tailorData] = await Promise.all([
        fetchPaymentData(),
        fetchTailorData()
      ]);

      // --- PAYMENT DATA ---
      if (paymentData && isMounted) {
        dispatch(setPaymentData(paymentData));

        // Compute total payment for this project
        const totalReceived = paymentData.reduce((sum, record) => {
          const [_, projectName, amountStr] = record;
          if (projectName === projectData.projectName) {
            const amount = parseFloat(amountStr);
            return sum + (isNaN(amount) ? 0 : amount);
          }
          return sum;
        }, 0);

        setReceived(totalReceived);
      }

      // --- TAILOR DATA ---
      if (tailorData && isMounted) {
        dispatch(setTailorData(tailorData));
      }

      // Prevent re-fetching
      if (isMounted) setAdded(true);
    } catch (error) {
      console.error("❌ Failed to fetch payment or tailor data:", error);
      // Optional: showToast("Error loading data")
    }
  };

  if (!added) {
    fetchAndStoreData();
  }

  return () => {
    isMounted = false; // Cleanup for async calls
  };
}, [added, dispatch, projectData.projectName]);





useEffect(() => {
  async function getAreas() {
    try {
      // Check localStorage first to avoid unnecessary API calls
      const cachedData = localStorage.getItem("areasData");
      const oneHour = 3600 * 1000; // 1 hour expiration for cached data

      if (cachedData) {
        const { data, time } = JSON.parse(cachedData);

        if (Date.now() - time < oneHour) {
          // Use cached data if it hasn't expired
          setAvailableAreas(data);
          return;
        } else {
          // Remove expired data from localStorage
          localStorage.removeItem("areasData");
        }
      }

      // If no valid cached data, fetch from the API
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getAreas");
      const data = await response.json();
      setAvailableAreas(data.body);

      // Cache the fresh data
      localStorage.setItem("areasData", JSON.stringify({ data: data.body, time: Date.now() }));

    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  }

  // Fetch areas only if not already loaded
  if (availableAreas.length === 0) {
    getAreas();
  }
}, [availableAreas.length]);// Only re-run when availableAreas length changes


const addPaymentFunction = async () => {
  const isEdit = typeof editProjects !== "undefined";

  const url = isEdit
    ? "https://sheeladecor.netlify.app/.netlify/functions/server/updateProjects"
    : "https://sheeladecor.netlify.app/.netlify/functions/server/addPayment";

  const payload = isEdit
    ? {
        customerName: projectData.customerLink[0],
        Name: projectData.projectName,
        Received: payment,
        ReceivedDate: paymentDate,
        PaymentMode: paymentMode,
        Remarks: paymentRemarks,// send this if backend needs it
      }
    : {
        customerName: projectData.customerLink[0],
        Name: projectData.projectName,
        Received: payment,
        ReceivedDate: paymentDate,
        PaymentMode: paymentMode,
        Remarks: paymentRemarks,
      };

  try {
    const response = await fetch(url, {
      credentials: "include",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      alert(isEdit ? "Payment updated" : "Payment added");
      setAddPayment(false);
      setPayment(0);
      setPaymentDate("");
      setPaymentMode("");
      setPaymentRemarks("");
      setAdded(prev => !prev);
    } else {
      alert("Error");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Network or server error");
  }
};


const deletePayment = async (p, pd, pm, re) => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletePayment", {
    credentials : "include",
    method : "POST",
    headers : {
      "content-type" : "application/json",
    },
    body : JSON.stringify({ Name : projectData.projectName, Received : p, ReceivedDate : pd, PaymentMode : pm, Remarks : re })
  });

  if(response.status == 200){
    alert("Deleted");
    if(added){
      setAdded(false);
    }else{
      setAdded(true);
    }
  }else{
    alert("Error");
  }
}

const [taskFilter, setTaskFilter] = useState("All Tasks");
const statusArray = ["Pending", "Ordered", "Received", "In Stock"];

const [filteredTasks, setFilteredTasks] = useState([]);

useEffect(() => {
  const filteredTasks = Tasks
  .filter((task) => task[5] === projectData.projectName)
  .filter((task) => {
    if (taskFilter === "All Tasks") return true;
    return task[7] === taskFilter;
  });

  setFilteredTasks(filteredTasks);

}, [projectData]);

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editing, setediting] = useState<[]>(null);

  const [name, setName] = useState("");

  useEffect(() => {

    async function taskData(){
      const data = await fetchTaskData();
      dispatch(setTasks(data));
      setAdded(true);
    }
    if (!added) {
      taskData();
    }
  } ,[dispatch, taskDialogOpen, added]);

  const deleteTask = async (name: string) => {
    await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetask", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title: name }),
    });

    setAdded(false);
  };

  const bankDetails = ["123123", "!23123", "!2312331"];
  const termsCondiditions = ["asdasd", "asasda"];

  const updateTailorData = (index, data) => {
    const formattedData = data.split(",").map(item => item.trim()); // split and trim spaces
    const newtailors = [...tailorsArray];
    newtailors[index].tailorData = formattedData;
    console.log(newtailors[index]);
    setTailorsArray(newtailors);
  };
  
  const updateTailorRate = (index, data) => {
    const newtailors = [...tailorsArray];
    newtailors[index].rate = data;
    setTailorsArray(newtailors);
  }
  const updateTailorStatus = (index, data) => {
    const newtailors = [...tailorsArray];
    newtailors[index].status = data;
    setTailorsArray(newtailors);
  }
  const updateTailorRemark = (index, data) => {
    const newtailors = [...tailorsArray];
    newtailors[index].remark = data;
    setTailorsArray(newtailors);
  }

  const setCancelPayment = () => {
    if(editPayments){
      setPayment(0);
      setPaymentDate("");
      setPaymentMode("");
      setPaymentRemarks("NA");
      setAddPayment(false);
    }else{
      setAddPayment(false);
    }
  }

  const sendProjectData = async () => {
    try {
      const response = await fetch(
        "https://sheeladecor.netlify.app/.netlify/functions/server/updateprojectdata",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            projectName: projectData.projectName,
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
            goodsArray : JSON.stringify(goodsArray),
            tailorsArray : JSON.stringify(tailorsArray),
            projectAddress : JSON.stringify(projectAddress),
          }),
        }
      );
  
      if (response.status === 200) {
        alert("Project Edited");
        goBack();
      } else {
        const errorText = await response.text(); // Get error details
        console.error("Error response:", errorText);
        alert("Error: Failed to edit project");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error: Network issue or server not responding");
    }
  };

    return (
      <div className='p-6'>
        <div className='flex flex-col'>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-[1.4vw] font-semibold'>Order Overview</p>
            <button onClick={goBack} className="mb-4 px-3 py-1 text-white bg-red-500 rounded">← Back</button>
          </div>
          <div className='flex flex-row w-[65vw] justify-between mb-3 bg-sky-50 px-2 py-2 rounded-lg'>
            <button className={`text-[1vw] ${navState == "Overview" ? "text-sky-700 font-semibold" : ""}`} onClick={() => setNavState("Overview")}>Overview</button>
            <button className={`text-[1vw] ${navState == "Customer & Project Details" ? "text-sky-700  font-semibold" : ""}`} onClick={() => setNavState("Customer & Project Details")}>Customer & Project Details</button>
            <button className={`text-[1vw] ${navState == "Material Selection" ? "text-sky-700  font-semibold" : ""}`} onClick={() => setNavState("Material Selection")}>Material Selection</button>
            <button className={`text-[1vw] ${navState == "Measurement" ? "text-sky-700  font-semibold" : ""}`} onClick={() => setNavState("Measurement")}>Measurement</button>
            <button className={`text-[1vw] ${navState == "Quotation" ? "text-sky-700  font-semibold" : ""}`} onClick={() => setNavState("Quotation")}>Quotation</button>
            <button className={`text-[1vw] ${navState == "Goods" ? "text-sky-700  font-semibold" : ""}`} onClick={() => setNavState("Goods")}>Goods</button>
            <button className={`text-[1vw] ${navState == "Tailors" ? "text-sky-700  font-semibold" : ""}`} onClick={() => setNavState("Tailors")}>Tailors</button>
            <button className={`text-[1vw] ${navState == "Payments" ? "text-sky-700  font-semibold" : ""}`} onClick={() => setNavState("Payments")}>Payments</button>
            <button className={`text-[1vw] ${navState == "Tasks" ? "text-sky-700  font-semibold" : ""}`} onClick={() => setNavState("Tasks")}>Tasks</button>
          </div>
          {navState == "Overview" &&  
          <div className="flex flex-col justify-between">
            <OverviewPage 
            projectData={projectData}
            status={currentStatus}
            setStatus={setCurrentStatus}
            tasks={Tasks}
            setNavState={setNavState}
            tailorsArray={tailorsArray}
            setTailorsArray={setTailorsArray}
            goodsArray={goodsArray}
            setGoodsArray={setGoodsArray}
            projectDate={projectDate}
            setPRojectDate={setPRojectDate}
            interiorArray={interiorArray}
            salesAssociateArray={salesAssociateArray}
            projects={projects}
            setAddPayment={setAddPayment}
            addPayment={addPayment}
            />
            <div className="flex flex-row justify-between mt-3">
                <button onClick={() => setNavState("Tasks")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
                <button onClick={() => setNavState("Customer & Project Details")} style={{ borderRadius : "8px" }} className="rounded-lg text-white border px-2 h-8 bg-sky-600">Next</button>
            </div>
          </div>
            }
          {
            navState == "Customer & Project Details" &&  
            <div className="flex flex-col gap-3">
                <EditCustomerDetails
                customers={customers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                projectData={projectData}
                setcustomers={setcustomers}
                />
                <EditProjectDetails
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
                projectData={projectData}
                setSalesData={setsalesdata}
                />
                <div className="flex flex-row justify-between">
                    <button onClick={() => setNavState("Overview")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
                    <button onClick={() => setNavState("Material Selection")} style={{ borderRadius : "8px" }} className="rounded-lg text-white border px-2 h-8 bg-sky-600">Next</button>
                </div>
            </div>
          }
          {
            navState == "Material Selection" && <div className="flex flex-col gap-3">
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
                  projectData={projectData}
                  setAvailableAreas={setAvailableAreas}
                  singleItems={singleitems}
                />
              <div className="flex flex-row justify-between">
                    <button onClick={() => setNavState("Customer & Project Details")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
                    <button onClick={() => setNavState("Measurement")} style={{ borderRadius : "8px" }} className="rounded-lg text-white border px-2 h-8 bg-sky-600">Next</button>
                </div>
            </div>
          }
          {
            navState == "Measurement" && <div className="flex flex-col gap-3">
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
              <div className="flex flex-row justify-between">
                <button onClick={() => setNavState("Material Selection")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
                <button onClick={() => setNavState("Quotation")} style={{ borderRadius : "8px" }} className="rounded-lg text-white border px-2 h-8 bg-sky-600">Next</button>
              </div>
            </div>
          }
          {
            navState == "Quotation" && <div className="flex flex-col gap-3">
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
    if (!Array.isArray(collection.items)) {
      return (
        <tr key={`error-${collectionIndex}`}>
          <td colSpan={9} className="text-center text-red-500 text-sm py-2">
            No items found for collection {collectionIndex + 1}
          </td>
        </tr>
      );
    }

    return collection.items.map((item: any, itemIndex: number) => {
      const key = `${mainindex}-${collectionIndex}-${itemIndex}`;
      const qty = collection.quantities?.[itemIndex] || 0;

      return (
        <tr
          key={key}
          className="flex flex-col sm:flex-row justify-between w-full border-b p-2 sm:p-4"
        >
          <td className="w-full sm:w-[10%] text-xs sm:text-sm">{itemIndex + 1}</td>
          <td className="w-full sm:w-[45%] text-xs sm:text-sm">
            {item[0] + " * " + collection.measurement.quantity}
          </td>
          <td className="w-full sm:w-[45%] text-xs sm:text-sm">
            {collection.measurement.width +
              " x " +
              collection.measurement.height +
              " " +
              collection.measurement.unit}
          </td>
          <td className="w-full sm:w-[20%] text-xs sm:text-sm">
            {(item[4] * parseFloat(collection.measurement.quantity)).toFixed(2)}
          </td>
          <td className="w-full sm:w-[20%]">
            <div className="flex flex-col">
              <input
                type="text"
                value={collection.quantities?.[itemIndex] || ""}
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
                className="border w-full sm:w-2/5 px-2 py-1 rounded text-xs sm:text-sm"
              />
              <p className="text-[10px] sm:text-xs text-gray-600">{item[3]}</p>
            </div>
          </td>
          <td className="w-full sm:w-[20%] text-xs sm:text-sm">
            {(item[4] * parseFloat(collection.measurement.quantity) * qty).toFixed(2)}
          </td>
          <td className="w-full sm:w-[20%] text-xs sm:text-sm">{item[5]}</td>
          <td className="w-full sm:w-[20%] text-xs sm:text-sm">
            {collection.totalTax[itemIndex] ? collection.totalTax[itemIndex].toFixed(2) : "0.00"}
          </td>
          <td className="w-full sm:w-[20%] text-xs sm:text-sm">
            {collection.totalAmount[itemIndex] ? collection.totalAmount[itemIndex].toFixed(2) : "0.00"}
          </td>
        </tr>
      );
    });
  })
) : (
  <tr>
    <td colSpan={9} className="text-center py-2 text-gray-500 text-sm sm:text-base">
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
                value={item.name || ""}
                type="text"
              />
            </td>
            <td>
              <input
                onChange={(e) => handleItemQuantityChange(i, e.target.value)}
                className="pl-2 w-[6vw] border rounded-lg"
                value={item.quantity || ""}
                type="text"
              />
            </td>
            <td>
              <input
                onChange={(e) => handleItemRateChange(i, e.target.value)}
                className="pl-2 w-[6vw] border rounded-lg"
                value={item.rate || ""}
                type="text"
              />
            </td>
            <td className="w-[6vw] text-center">{item.netRate}</td>
            <td>
              <input
                onChange={(e) => handleItemTaxChange(i, e.target.value)}
                className="pl-2 w-[6vw] border rounded-lg"
                value={item.tax || ""}
                type="text"
              />
            </td>
            <td className="w-[6vw] text-center">{item.taxAmount || 0}</td>
            <td className="w-[6vw] text-center">{item.totalAmount || 0}</td>
            <td>
              <input
                onChange={(e) => handleItemRemarkChange(i, e.target.value)}
                className="pl-2 w-[6vw] border rounded-lg"
                value={item.remark || ""}
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
        <div className="flex flex-row gap-3 justify-between w-full">
          <div className="flex flex-col gap-2 w-1/2 rounded mt-3 p-6 shadow-xl border">
            <div className="flex flex-row justify-between">
              <select
                className="border p-2 rounded w-1/2 h-16"
                value={""}
                
              >
                <option value="">Bank Details</option>
                {bankDetails.map((data, index) => (
                  <option key={index} value={data}>
                    {data}
                  </option>
                ))}
              </select>
              <button><FaPlus size={18} className="text-sky-600 hover:text-sky-800"/></button>
            </div>
            <textarea placeholder="Description" className="w-full rounded-lg border py-2 pl-2"></textarea>
            <select
              className="border p-2 rounded w-1/2 h-16"
              value={""}
              
            >
              <option value="">Terms & Conditions</option>
              {termsCondiditions.map((data, index) => (
                <option key={index} value={data}>
                  {data}
                </option>
              ))}
            </select>
            <textarea placeholder="Description" className="w-full rounded-lg border py-2 pl-2"></textarea>
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
              <p className="text-[1.1vw]">{parseFloat((Amount + Tax).toFixed(2))}</p>
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex justify-between mt-1 w-full">
              <p className="text-[1.1vw]">Discount</p>
              <input className="rounded-lg border text-center" value={Discount} onChange={(e) => setDiscount(e.target.value)} type="text" />
            </div>
            <div className="border border-gray-400"></div>
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-[1.1vw]">Grand Total</p>
              <p className="text-[1.1vw]">{parseFloat((Amount + Tax - Discount).toFixed(2))}</p>
            </div>
            <button onClick={sendProjectData} style={{borderRadius : "10px"}} className="rounded-lg bg-sky-700 hover:bg-sky-800 text-white p-[6px]">Edit Project & Generate Quote</button>
          </div>
        </div>


              <div className="flex flex-row justify-between">
                <button onClick={() => setNavState("Measurement")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
                <button onClick={() => setNavState("Goods")} style={{ borderRadius : "8px" }} className="rounded-lg text-white border px-2 h-8 bg-sky-600">Next</button>
              </div>
            </div>
            
          }
          {
            navState == "Goods" && <div className="flex flex-col w-full gap-3 mt-3">
              <div className="w-full">
              <p className="text-[1.3vw] font-semibold">Goods</p>
              <table className="w-full table-auto ">
                <tr className="bg-gray-100 text-center">
                  <th>Sr.No.</th>
                  <th>Area</th>
                  <th>Product Group</th>
                  <th>Company</th>
                  <th>Catalogue</th>
                  <th>Design No</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Order ID</th>
                  <th>Remark</th>
                </tr>
                <tbody>
  {goodsArray != undefined && goodsArray.map((goods, index) => {
    const selection = selections[goods.mainindex];
    const collection = selection?.areacollection?.[goods.groupIndex];

    return (
      <tr key={index} className="text-center rounded-md">
        <td>{index + 1}</td>
        <td>{selection?.area || ""}</td>
        <td>{goods?.item?.[0] || ""}</td>
        <td>{collection?.company || ""}</td>
        <td>{collection?.catalogue?.[0] || ""}</td>
        <td>{collection?.designNo || ""}</td>
        <td>
          <input
            type="date"
            className="border pl-2 rounded-lg w-[8vw] px-1 py-1 text-center mt-2"
            value={goods?.date || ""}
            onChange={(e) => setGoodsDate(index, e.target.value)}
          />
        </td>
        <td>
          <select
            className="border px-2 py-1 mt-2 rounded w-full"
            value={goods?.status || ""}
            onChange={(e) => setGoodsStatus(index, e.target.value)}
          >
            <option value="">Pending</option>
            {statusArray.map((data, i) => (
              <option key={i} value={data}>
                {data}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            type="text"
            className="border pl-2 rounded-lg w-[5vw] px-1 py-1 text-center mt-2"
            value={goods?.orderID || ""}
            onChange={(e) => setGoodsOrderID(index, e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            className="border pl-2 rounded-lg w-[8vw] px-1 py-1 text-center mt-2"
            value={goods?.remark || ""}
            onChange={(e) => setGoodsRemark(index, e.target.value)}
          />
        </td>
      </tr>
    );
  })}
</tbody>


            </table>

              </div>
              <div className="flex flex-row justify-between">
                <button onClick={() => setNavState("Quotation")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
                <button onClick={() => setNavState("Tailors")} style={{ borderRadius : "8px" }} className="rounded-lg text-white border px-2 h-8 bg-sky-600">Next</button>
              </div>
            </div>
          }
          {
            navState === "Tailors" && <TailorsSection 
            updateTailorRate={updateTailorRate}
            updateTailorRemark={updateTailorRemark} 
            updateTailorData={updateTailorData} 
            updateTailorStatus={updateTailorStatus}
            tailors={tailors} 
            statusArray={statusArray} 
            selections={selections} 
            setNavState={setNavState} 
            tailorsArray={tailorsArray} 
            setTailorsArray={setTailorsArray} />
          }
          {
            navState == "Payments" && <PaymentsSection
            addPayment={addPayment}
            setAddPayment={setAddPayment}
            Amount={Amount}
            Tax={Tax}
            Received={Received}
            Discount={Discount}
            paymentData={paymentData}
            deletePayment={deletePayment}
            setNavState={setNavState}
            setEditPayments={setEditPayments}
            setPayment={setPayment}
            setPaymentDate={setPaymentDate}
            setPaymentRemarks={setPaymentRemarks}
            setPaymentMode={setPaymentMode}
            projectData={projectData}
          />
          }
          { 
            addPayment && <div className="flex flex-col z-50 justify-between gap-3 w-[50vw] border rounded-xl p-3">
              <div className="flex flex-col">
                <div className="flex flex-row gap-1"><p className="text-[1.1vw]">Amount Received</p><p className="text-red-500">*</p></div>
                <input type="text" value={payment} className="border-1 rounded-lg pl-2 h-8" onChange={(e) => setPayment(e.target.value == "" ? 0 : parseFloat(e.target.value))}/>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-1"><p className="text-[1.1vw]">Payment Date</p><p className="text-red-500">*</p></div>
                <input type="date" value={paymentDate} className="border-1 rounded-lg pl-2 h-8 pr-2" onChange={(e) => setPaymentDate(e.target.value)}/>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-1"><p className="text-[1.1vw]">Payment Mode</p><p className="text-red-500">*</p></div>
                <input type="text" value={paymentMode}  className="border-1 rounded-lg pl-2 h-8" onChange={(e) => setPaymentMode(e.target.value)}/>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-1"><p className="text-[1.1vw]">Remarks</p><p className="text-red-500">*</p></div>
                <input type="text" value={paymentRemarks} className="border-1 rounded-lg pl-2 h-8" onChange={(e) => setPaymentRemarks(e.target.value)}/>
              </div>
              <div className="flex flex-row justify-end gap-3">
                <button onClick={() => {if(editPayments != undefined){ setEditPayments(undefined); } setCancelPayment()}} style={{ borderRadius : "8px" }} className="border-2 border-sky-700 text-sky-600 bg-white px-2 h-8">Close</button>
                <button onClick={() => addPaymentFunction()} style={{ borderRadius : "8px" }} className={`${editPayments == undefined ? "" : "hidden"} text-white bg-sky-600 hover:bg-sky-700 px-2 h-8`}>Add Payment</button>
                <button onClick={() => addPaymentFunction()} style={{ borderRadius : "8px" }} className={`${editPayments != undefined ? "" : "hidden"} text-white bg-sky-600 hover:bg-sky-700 px-2 h-8`}>Edit Payment</button>
              </div>
            </div>
          }
          {
            navState == "Tasks" && <div className="flex flex-col w-full justify-between gap-3 mt-3 p-3">
              <div className="flex flex-row w-full justify-between items-center">
                  <p className="text-[1.4vw] font-semibold">Tasks</p>
                  <button onClick={() => setTaskDialogOpen(true)} style={{ borderRadius : "8px" }} className="bg-sky-600 text-white hover:bg-sky-700 px-2 h-8">Add Task</button>
              </div>
              <div className="flex flex-row gap-5">
                <div className="flex flex-col gap-3">
                  <button onClick={() => setTaskFilter("All Tasks")} className={` text-[1.1vw] text-gray-600 font-semibold`}>All Tasks</button>
                  <div className={`${taskFilter != "All Tasks" ? "bg-white" : "bg-sky-500"} w-full h-[2px] rounded-full`}></div>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setTaskFilter("To Do")} className={`text-[1.1vw] text-gray-600 font-semibold`}>To Do</button>
                  <div className={`${taskFilter != "To Do" ? "bg-white" : "bg-sky-500"} w-full h-[2px] rounded-full`}></div>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setTaskFilter("In Progress")} className={`text-[1.1vw] text-gray-600 font-semibold`}>In Progress</button>
                  <div className={`${taskFilter != "In Progress" ? "bg-white" : "bg-sky-500"} w-full h-[2px] rounded-full`}></div>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setTaskFilter("Completed")} className={`text-[1.1vw] text-gray-600 font-semibold`}>Completed</button>
                  <div className={`${taskFilter != "Completed" ? "bg-white" : "bg-sky-500"} w-full h-[2px] rounded-full`}></div>
                </div>
              </div>
              <table className="w-full p-3">
                <thead>
                  <tr>
                    <td>Sr.No.</td>
                    <td>Task Name</td>
                    <td>Priority</td>
                    <td>Project</td>
                    <td>Assignee</td>
                    <td>Due Date</td>
                    <td>Status</td>
                    <td>Created At</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody className="overflow-y-scroll">
                  {filteredTasks.map((task, index) => (
                    <tr
                      key={index}
                      className="max-h-fit border-b border-gray-200 py-3" // Added padding for vertical spacing
                    >
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2">{task[0]}</td>
                      <td className={`py-2 font-semibold ${task[6] == "Low" ? "text-green-600" : ""} ${task[6] == "Moderate" ? "text-yellow-600" : ""} ${task[6] == "High" ? "text-red-500" : ""}`}>{task[6]}</td>
                      <td className="py-2">{task[5]}</td>
                      <td className="py-2">{task[4]}</td>
                      <td className="py-2">{task[2]}</td>
                      <td className={`py-2 font-semibold ${task[7] == "Completed" ? "text-green-600" : ""} ${task[7] == "In Progress" ? "text-yellow-600" : ""} ${task[7] == "To Do" ? "text-red-500" : ""}`}>{task[7]}</td>
                      <td className="py-2">{task[3]}</td>
                      <td className="flex flex-row gap-2 items-center py-2">
                        <button onClick={() => { setName(task[0]); setediting(task); setTaskDialogOpen(true);}}>
                          <Edit size={18} />
                        </button>
                        <button onClick={() => deleteTask(task[0])}>
                          <FaTrash size={18} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-row justify-between">
                <button onClick={() => setNavState("Payments")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
                <button onClick={() => setNavState("Overview")} style={{ borderRadius : "8px" }} className="rounded-lg text-white border px-2 h-8 bg-sky-600">Next</button>
              </div>
            </div>
          }
                <AnimatePresence>
        {taskDialogOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTaskDialogOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <TaskDialog
                onClose={() => setTaskDialogOpen(false)}
                isEditing={editing}
                setediting={setediting}
                name={name}
                projectData={projects}
                setTaskDialogOpen={setTaskDialogOpen}
                taskDialogOpen={taskDialogOpen}
                setProjectFlag={setProjectFlag}
                setAdded={setAdded}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
        </div>
        
      </div>
    );
  };
  

export default EditProjects