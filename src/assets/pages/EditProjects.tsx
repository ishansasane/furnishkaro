/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import OverviewPage from './OverviewPage';
import { setPaymentData , setSalesAssociateData, setInteriorData, setCustomerData, setProducts, setCatalogs, setProjects, setItemData, setProjectFlag, setTasks } from "../Redux/dataSlice";
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

const EditProjects = ({ projectData, index, goBack, projects }) => {

    const [currentStatus, setCurrentStatus] = useState("Unsent");
    const [navState, setNavState] = useState("Overview");

    const dispatch = useDispatch();
    const customerData = useSelector((state : RootState) => state.data.customers);
    const interiorData = useSelector((state : RootState) => state.data.interiors);
    const salesAssociateData = useSelector((state : RootState) => state.data.salesAssociates);
    const products = useSelector((state : RootState) => state.data.products);
    const items = useSelector((state : RootState) => state.data.items);
    const paymentData = useSelector((state : RootState) => state.data.paymentData);

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
    const availableAreas = ["Living Room", "Kitchen", "Bedroom", "Bathroom"];
    
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
        }
    
        interface ProductGroup {
          groupName: string;
          mainProducts: string;
          addonProducts: string;
          color: string;
          needsTailoring: boolean;
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
        if(Object.isFrozen(additionalItems)){
          console.log("frozen");
        }
      }, [projectData]);
      
      

      useEffect(() => {
        async function getData() {
          const data = await fetchInteriors();
          dispatch(setInteriorData(data));
          setinterior(data);
        }
        async function getitemsdata() {
          const response = await fetch(
            "https://sheeladecor.netlify.app/.netlify/functions/server/getsingleproducts",
            { credentials: "include" }
          );
          const data = await response.json();
          const items = data.body || [];
          dispatch(setItemData(items));
          setsingleitems(items);
        }
        if (interiorData.length === 0) {
          getData();
        }
        if (items.length === 0) {
          getitemsdata();
        }
      }, [dispatch]);
      
      useEffect(() => {
        async function getData() {
          const data = await fetchSalesAssociates();
          dispatch(setSalesAssociateData(data));
          setsalesdata(data);
        }
        if (salesAssociateData.length === 0) {
          getData();
        }
      }, [dispatch]);
      
      useEffect(() => {
        async function getData() {
          const data = await fetchProductGroups();
          dispatch(setProducts(data));
          setAvailableProductGroups(data);
        }
        if (products.length === 0) {
          getData();
        }
      }, [dispatch]);
      
      useEffect(() => {
        async function getData() {
          const data = await fetchCatalogues();
          dispatch(setCatalogs(data));
        }
        if (catalogueData.length === 0) {
          getData();
        }
      }, [dispatch]);
      
      useEffect(() => {
        async function getData() {
          const data = await fetchCustomers();
          dispatch(setCustomerData(data));
          setcustomers(data);
        }
        if (customerData.length === 0) {
          getData();
        }
      }, [dispatch]);

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
            salesAssociateArray : JSON.stringify(salesAssociateArray)
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
  const updatedSelections = structuredClone(selections); // Deep clone

  if (!updatedSelections[mainindex].areacollection) {
    updatedSelections[mainindex].areacollection = [];
  }
  
  if (!updatedSelections[mainindex].areacollection[i]) {
    updatedSelections[mainindex].areacollection[i] = {
      productGroup: null,
      items: [""],
      catalogue: null,
      company: null,
      designNo: null,
      reference: null,
      measurement: {
        unit: "Centimeter (cm)",
        width: "0",
        height: "0",
        quantity: "0"
      },
      additionalItems: [],
      totalAmount: [],
      totalTax: []
    };
  }
  
  const newproduct = product.split(",");
  const items = newproduct.slice(1, -2);
  
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

const handleAddArea = () => {
  setSelections([...selections, { area: "", areacollection : []}]);
};

const handleRemoveArea = (index: number) => {
  const updatedSelections = selections.filter((_, i) => i !== index);
  setSelections(updatedSelections);
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
const [Amount, setAmount] = useState(0);
const [Tax, setTax] = useState(0);
const [Paid, setPaid] = useState(0);
const [Discount, setDiscount] = useState(0);
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
  const additionalTaxArray = additionalItems.map(item => parseFloat(item.taxAmount) || 0);
  const additionalAmountArray = additionalItems.map(item => parseFloat(item.totalAmount) || 0);

  const totalTax = [...selectionTaxArray, ...additionalTaxArray].reduce((acc, curr) => acc + curr, 0);
  const totalAmount = [...selectionAmountArray, ...additionalAmountArray].reduce((acc, curr) => acc + curr, 0);

  setTax(totalTax);
  setAmount(totalAmount);
};

const handleItemQuantityChange = (i, quantity) => {
  const updated = [...additionalItems];
  updated[i].quantity = quantity;
  updated[i].netRate = quantity * updated[i].rate; // Net Rate
  updated[i].taxAmount = updated[i].netRate * (updated[i].tax / 100); // Tax Amount
  updated[i].totalAmount = Number(updated[i].netRate) + Number(updated[i].taxAmount); // Total Amount
  setAdditionaItems(updated);

  const additionalTax = updated.reduce((acc, item) => acc + (parseFloat(item.totalTax) || 0), 0);
  const additionalAmount = updated.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0);

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
  updated[i].netRate = rate * updated[i].quantity; // Net Rate
  updated[i].taxAmount = updated[i].netRate * (updated[i].tax / 100); // Tax Amount
  updated[i].totalAmount = Number(updated[i].rate) + Number(updated[i].taxAmount); // Total Amount
  setAdditionaItems(updated);

  const additionalTax = updated.reduce((acc, item) => acc + (parseFloat(item.totalTax) || 0), 0);
  const additionalAmount = updated.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0);

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

// Update tax and auto-update tax amount and total amount
const handleItemTaxChange = (i, tax) => {
  const updated = [...additionalItems];

  // Ensure numeric values
  const rate = parseFloat(updated[i].rate) || 0;
  const quantity = parseFloat(updated[i].quantity) || 0;
  const netRate = rate * quantity;

  updated[i].netRate = netRate; // Net rate
  updated[i].tax = parseFloat(tax) || 0; // Tax %
  updated[i].taxAmount = netRate * (updated[i].tax / 100); // Tax Amount
  updated[i].totalAmount = netRate + updated[i].taxAmount; // Total Amount

  setAdditionaItems(updated);

  // 🧮 Sum from additionalItems
  const additionalTax = updated.reduce((acc, item) => acc + (parseFloat(item.totalTax) || 0), 0);
  const additionalAmount = updated.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0);

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

const handleItemRemarkChange = (i, remark) => {
  const updated = [...additionalItems];
  updated[i].remark = remark;
  setAdditionaItems(updated);
};

    interface Goods {
      date;
      status;
      orderID;
      remark;
    }

    const [goodsArray, setGoodsArray] = useState<Goods[]>([]);

    useEffect(() => {
      const deepClone = (data) => JSON.parse(JSON.stringify(data));
      setAdditionaItems(deepClone(projectData.additionalItems));
      setGoodsArray(deepClone(projectData.goodsArray));
    }, [projectData]);

    useEffect(() => {
      setTax(projectData.totalTax);
      setAmount(projectData.totalAmount);
      setDiscount(projectData.discount);
    })
  
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

const hasFetchedPayments = useRef(false);
const [added, setAdded] = useState(false);
useEffect(() => {
  async function fetchPayments() {
    const data = await fetchPaymentData();
    dispatch(setPaymentData(data));

    // Sum the values at index 1
    const total = data.reduce((acc, curr) => {
      const amount = parseFloat(curr[1]);
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    setReceived(total);
    setAdded(true);
  }
  if (!added) {
    fetchPayments();
  }
}, [dispatch, added, fetchPaymentData]);

const addPaymentFunction = async () => {

  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addPayment", {
    credentials : "include",
    method : "POST",
    headers : {
      "content-type" : "application/json"
    },
    body : JSON.stringify({ Name : projectData.projectName, Received : payment, ReceivedDate : paymentDate, PaymentMode : paymentMode, Remarks : paymentRemarks })
  })
  if(response.status == 200){
    alert("Payment added");
    setAddPayment(false);
    setPayment(0);
    setPaymentDate("");
    setPaymentMode("");
    setPaymentRemarks("");
    if(added){
      setAdded(false);
    }else{
      setAdded(true);
    }
  }else{
    alert("Error");
  }
}

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

const filteredTasks = Tasks
  .filter((task) => task[5] === projectData.projectName)
  .filter((task) => {
    if (taskFilter === "All Tasks") return true;
    return task[7] === taskFilter;
  });

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
    return (
      <div className='p-6'>
        <div className='flex flex-col'>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-[1.4vw] font-semibold'>Order Overview</p>
            <button onClick={goBack} className="mb-4 px-3 py-1 text-white bg-red-500 rounded">← Back</button>
          </div>
          <div className='flex flex-row w-[65vw] justify-between mb-3'>
            <button className='text-[1vw]' onClick={() => setNavState("Overview")}>Overview</button>
            <button className='text-[1vw]' onClick={() => setNavState("Customer & Project Details")}>Customer & Project Details</button>
            <button className='text-[1vw]' onClick={() => setNavState("Material Selection")}>Material Selection</button>
            <button className='text-[1vw]' onClick={() => setNavState("Measurement")}>Measurement</button>
            <button className='text-[1vw]' onClick={() => setNavState("Quotation")}>Quotation</button>
            <button className='text-[1vw]' onClick={() => setNavState("Goods")}>Goods</button>
            <button className='text-[1vw]' onClick={() => setNavState("Tailors")}>Tailors</button>
            <button className='text-[1vw]' onClick={() => setNavState("Payments")}>Payments</button>
            <button className='text-[1vw]' onClick={() => setNavState("Tasks")}>Tasks</button>
          </div>
          {navState == "Overview" &&  
          <div className="flex flex-col justify-between">
            <OverviewPage 
            projectData={projectData}
            status={currentStatus}
            setStatus={setCurrentStatus}
            tasks={Tasks}
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
                <QuotationTable
                  selections={selections}
                  items={items}
                  quantities={quantities}
                  handleQuantityChange={handleQuantityChange}
                  additionalItems={additionalItems}
                  handleAddMiscItem={handleAddMiscItem}
                  handleItemNameChange={handleItemNameChange}
                  handleItemQuantityChange={handleItemQuantityChange}
                  handleItemRateChange={handleItemRateChange}
                  handleItemTaxChange={handleItemTaxChange}
                  handleItemRemarkChange={handleItemRemarkChange}
                  handleDeleteMiscItem={handleDeleteMiscItem}
                  projectData={projectData}
                  setAdditionalItems={setAdditionaItems}
                  Tax={Tax}
                  setTax={setTax}
                  Amount={Amount}
                  setAmount={setAmount}
                  Discount={Discount}
                  setDiscount={setDiscount}
                />

              <div className="flex flex-row justify-between">
                <button onClick={() => setNavState("Measurement")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
                <button onClick={() => setNavState("Goods")} style={{ borderRadius : "8px" }} className="rounded-lg text-white border px-2 h-8 bg-sky-600">Next</button>
              </div>
            </div>
            
          }
          {
            navState == "Goods" && <div className="flex flex-col w-full gap-3">
              <div className="w-full">
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
                {selections.map((selection, mainindex) =>
                  selection.areacollection.map((collection, index) =>
                    collection.items.map((item, i) => (
                      <tr
                        key={`${mainindex}-${index}-${i}`}
                        className="text-center rounded-md"
                      >
                        <td>{i + 1}</td>
                        <td>{selection.area}</td>
                        <td>{item[0]}</td>
                        <td>{collection.company}</td>
                        <td className="mt-2">{collection.catalogue}</td>
                        <td className="mt-2">{collection.designNo}</td>
                        <td>
                          <input
                            type="date"
                            className="border pl-2 rounded-lg w-[8vw] px-1 py-1 text-center mt-2"
                            value={goodsArray[i].date}
                            onChange={(e) => {setGoodsDate(i, e.target.value);}}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="border pl-2 rounded-lg w-[8vw] px-1 py-1 text-center mt-2"
                            value={goodsArray[i].status}
                            onChange={(e) => {setGoodsStatus(i, e.target.value);}}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="border pl-2 rounded-lg w-[5vw] px-1 py-1 text-center mt-2"
                            value={goodsArray[i].orderID}
                            onChange={(e) => {setGoodsOrderID(i, e.target.value);}}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="border pl-2 rounded-lg w-[8vw] px-1 py-1 text-center mt-2"
                            value={goodsArray[i].remark}
                            onChange={(e) => {setGoodsRemark(i, e.target.value);}}
                          />
                        </td>
                      </tr>
                    ))
                  )
                )}
            </table>

              </div>
              <div className="flex flex-row justify-between">
                <button onClick={() => setNavState("Quotation")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
                <button onClick={() => setNavState("Tailors")} style={{ borderRadius : "8px" }} className="rounded-lg text-white border px-2 h-8 bg-sky-600">Next</button>
              </div>
            </div>
          }
          {
            navState === "Tailors" && <TailorsSection selections={selections} setNavState={setNavState} />
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
          />
          }
          {
            addPayment && <div className="flex flex-col z-50 justify-between gap-3 w-[50vw] border rounded-xl p-3">
              <div className="flex flex-col">
                <div className="flex flex-row gap-1"><p className="text-[1.1vw]">Amount Received</p><p className="text-red-500">*</p></div>
                <input type="text" value={payment ? payment : 0} className="border-1 rounded-lg pl-2 h-8" onChange={(e) => setPayment(parseInt(e.target.value))}/>
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
                <button onClick={() => setAddPayment(false)} style={{ borderRadius : "8px" }} className="border-2 border-sky-700 text-sky-600 bg-white px-2 h-8">Close</button>
                <button onClick={() => addPaymentFunction()} style={{ borderRadius : "8px" }} className="text-white bg-sky-600 hover:bg-sky-700 px-2 h-8">Add Payment</button>
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