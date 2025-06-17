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
import MeasurementSection from "./MeasurementSections";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AddProjectForm() {
  const dispatch = useDispatch();
  const customerData = useSelector((state: RootState) => state.data.customers);
  const interiorData = useSelector((state: RootState) => state.data.interiors);
  const salesAssociateData = useSelector((state: RootState) => state.data.salesAssociates);
  const products = useSelector((state: RootState) => state.data.products);
  const items = useSelector((state: RootState) => state.data.items);

  let projectData: any[] = [];
  const [count, setCount] = useState(0);

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const [singleItems, setSingleItems] = useState<any[]>([]);

  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);

  const [interior, setInterior] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  const [availableProductGroups, setAvailableProductGroups] = useState<any[]>([]);

  const catalogueData = useSelector((state: RootState) => state.data.catalogs);

  let availableCompanies = ["D Decor", "Asian Paints", "ZAMAN"];

  const designNo = ["514", "98", "123"];

  const [amount, setAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paid, setPaid] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [additionalItems, setAdditionalItems] = useState<Additional[]>([]);

  const [projectAddress, setProjectAddress] = useState(null);

  const projects = useSelector((state: RootState) => state.data.projects);

  interface Additional {
    name: string;
    quantity: number;
    rate: number;
    netRate: number;
    tax: number;
    taxAmount: number;
    totalAmount: number;
    remark: string;
  }

  interface AreaSelection {
    area: string;
    areacollection: CollectionArea[];
  }

  interface Measurements {
    unit: string;
    width: number;
    height: number;
    quantity: number;
    newquantity?: number;
  }

  interface CollectionArea {
    productGroup: any;
    items: any;
    company: string | null;
    catalogue: any[];
    designNo: string | null;
    reference: string | null;
    measurement: Measurements;
    totalAmount: number[];
    totalTax: number[];
    quantities: any[];
  }

  interface ProductGroup {
    groupName: string;
    mainProducts: string;
    addonProducts: string;
    color: string;
    needsTailoring: boolean;
  }

  interface Goods {
    pg: any;
    date: any;
    status: any;
    orderID: any;
    remark: any;
    mainindex: any;
    groupIndex: any;
    item: any;
  }

  interface Tailor {
    pg: any;
    rate: any;
    tailorData: any;
    status: any;
    remark: any;
    mainindex: any;
    groupIndex: any;
    item: any;
  }

  const [goodsArray, setGoodsArray] = useState<Goods[]>([]);
  const [tailorsArray, setTailorsArray] = useState<Tailor[]>([]);

  const [selections, setSelections] = useState<AreaSelection[]>([]);
  const [availableAreas, setAvailableAreas] = useState([]);

  const getItemsData = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getsingleproducts");
    const data = await response.json();
    return data.body;
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getcustomerdata", {
        credentials: "include",
      });
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

  async function fetchCatalogues() {
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

  async function fetchInteriors() {
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

  const handleAddArea = () => {
    setSelections([...selections, { area: "", areacollection: [] }]);
  };

  const handleRemoveArea = (index: number) => {
    const updatedSelections = selections.filter((_, i) => i !== index);
    setSelections(updatedSelections);
  };

  const handleAreaChange = (mainindex: number, newArea: string) => {
    const updatedSelections = [...selections];
    if (updatedSelections[mainindex]) {
      updatedSelections[mainindex].area = newArea;
    }
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
  
    let relevantPG = pg.length > 2 ? pg.slice(1, -1) : null;
  
    let newMatchedItems = null;

    if(relevantPG != null){
      newMatchedItems = relevantPG.map(pgItem =>
        items.find(item => item[0] === pgItem)
      ).filter(item => Array.isArray(item));
    }else{
      newMatchedItems = [product];
    }

    if(newMatchedItems.length == 0){
      newMatchedItems = [product.split(",")];
    }
  
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
    
  const handleCatalogueChange = (mainindex: number, i: number, catalogue: any) => {
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
        measurement: { unit: "Centimeter (cm)", width: undefined, height: undefined, quantity: undefined},
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }
  
    updatedSelections[mainindex].areacollection[i].catalogue = catalogue;
    setSelections(updatedSelections);
  };
    
  const handleCompanyChange = (mainindex: number, i: number, company: string) => {
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
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }
  
    updatedSelections[mainindex].areacollection[i].company = company;
    setSelections(updatedSelections);
  };

  const handleDesignNoChange = (mainindex: number, i: number, designNo: string) => {
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
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }

    updatedSelections[mainindex].areacollection[i].designNo = designNo;
    setSelections(updatedSelections);
  };

  const handleReferenceChange = (mainindex: number, i: number, reference: string) => {
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
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }

    updatedSelections[mainindex].areacollection[i].reference = reference;
    setSelections(updatedSelections);
  };

  const handleAddNewGroup = (mainindex: number, productGroupString = "") => {
    const updatedSelections = [...selections];
  
    if (!updatedSelections[mainindex]?.areacollection) {
      updatedSelections[mainindex].areacollection = [];
    }
  
    const groupIndex = updatedSelections[mainindex].areacollection.length;
  
    const productGroupArray = productGroupString ? productGroupString.split(",") : [];
  
    const relevantPG = productGroupArray.length > 2 ? productGroupArray.slice(1, -2) : [];
  
    const matchedItems = relevantPG
      .map(pgName => items.find(item => item[0] === pgName))
      .filter(item => Array.isArray(item));
  
    updatedSelections[mainindex].areacollection.push({
      productGroup: productGroupArray,
      company: "",
      catalogue: [],
      designNo: "",
      reference: "",
      measurement: { unit: "Centimeter (cm)", width: undefined, height: undefined, quantity: undefined},
      items: matchedItems,
      additionalItems: [],
      totalAmount: [],
      totalTax: []
    });
  
    setSelections(updatedSelections);
  
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
  
    const newTailors = matchedItems
      .filter(item => item[7] == true)
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
  
    setGoodsArray(prev => [...prev, ...newGoods]);
    setTailorsArray(prev => [...prev, ...newTailors]);
  };

  const handleGroupDelete = (mainindex: number, index: number) => {
    const updatedSelection = [...selections];
    if(updatedSelection[mainindex].areacollection[index]){
      updatedSelection[mainindex].areacollection.splice(index, 1);
    }
    setSelections(updatedSelection);
  };

  const units = ["Inches (in)", "Centimeter (cm)", "Meters (m)", "Feet (ft)"];

  const handleWidthChange = (mainindex: number, index: number, width: number) => {
    const updatedSelections = [...selections];
    updatedSelections[mainindex].areacollection[index].measurement.width = width;
    setSelections(updatedSelections);
  };

  const handleHeightChange = (mainindex: number, index: number, height: number) => {
    const updatedSelections = [...selections];
    updatedSelections[mainindex].areacollection[index].measurement.height = height;
    setSelections(updatedSelections);
  };

  const recalculateTotals = (updatedSelections: AreaSelection[], additionalItems: Additional[]) => {
    const selectionTaxArray = updatedSelections.flatMap((selection) =>
      selection.areacollection.flatMap((col) => col.totalTax || [])
    );
    const selectionAmountArray = updatedSelections.flatMap((selection) =>
      selection.areacollection.flatMap((col) => col.totalAmount || [])
    );
    const additionalTaxArray = additionalItems.map((item) => parseFloat(item.taxAmount.toString()) || 0);
    const additionalAmountArray = additionalItems.map((item) => parseFloat(item.totalAmount.toString()) || 0);
    const totalTax = parseFloat([...selectionTaxArray, ...additionalTaxArray].reduce((acc, curr) => acc + curr, 0).toFixed(2));
    const totalAmount = parseFloat([...selectionAmountArray, ...additionalAmountArray].reduce((acc, curr) => acc + curr, 0).toFixed(2));
    return { totalTax, totalAmount };
  };

  const handleQuantityChangeMain = (mainIndex: number, index: number, quantity: number) => {
    const updatedSelections = [...selections];
    const areaCol = updatedSelections[mainIndex].areacollection[index];
    areaCol.measurement.quantity = quantity;
    if (areaCol.items !== undefined) {
      if (!areaCol.totalTax) areaCol.totalTax = [];
      if (!areaCol.totalAmount) areaCol.totalAmount = [];
      const corrected = areaCol.items.map((item, i) => {
        const itemQuantity = parseFloat(updatedSelections[mainIndex].areacollection[index].quantities?.[i]) || 0;
        const itemRate = parseFloat(item[4]) || 0;
        const itemTaxPercent = parseFloat(item[5]) || 0;
        const netRate = parseFloat(quantity) * itemQuantity * itemRate;
        const taxAmount = parseFloat((netRate * (itemTaxPercent / 100)).toFixed(2));
        const totalAmount = parseFloat((netRate + taxAmount).toFixed(2));
        areaCol.totalTax[i] = taxAmount;
        areaCol.totalAmount[i] = totalAmount;
        return [...item.slice(0, 5), taxAmount, totalAmount];
      });
      areaCol.items = corrected;
    }
    setSelections(updatedSelections);
    const { totalTax, totalAmount } = recalculateTotals(updatedSelections, additionalItems);
    setTax(totalTax);
    setAmount(totalAmount);
  };

  const handleUnitChange = (mainindex: number, index: number, unit: string) => {
    const updatedSelections = [...selections];
    updatedSelections[mainindex].areacollection[index].measurement.unit = unit;
    setSelections(updatedSelections);
  };

  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});

  const handleQuantityChange = async (
    key: string,
    value: string,
    mainIndex: number,
    collectionIndex: number,
    quantity: string,
    num1: number,
    num2: number,
    itemIndex: number
  ) => {
    const updatedSelections = [...selections];
    if (!updatedSelections[mainIndex].areacollection[collectionIndex].quantities) {
      updatedSelections[mainIndex].areacollection[collectionIndex].quantities = [];
    }
    updatedSelections[mainIndex].areacollection[collectionIndex].quantities[itemIndex] = value;
    const cost = num1 * parseFloat(quantity) * parseFloat(value);
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
    setTax(totalTax);
    setAmount(totalAmount);
  };

  const handleAddMiscItem = () => {
    setAdditionalItems((prev) => [
      ...prev,
      {
        name: "",
        quantity: 0,
        rate: 0,
        netRate: 0,
        tax: 0,
        taxAmount: 0,
        totalAmount: 0,
        remark: "",
      },
    ]);
  };

  const handleDeleteMiscItem = (itemIndex: number) => {
    const updated = [...additionalItems];
    updated.splice(itemIndex, 1);
    setAdditionalItems(updated);
    const { totalTax, totalAmount } = recalculateTotals(selections, updated);
    setTax(totalTax);
    setAmount(totalAmount);
  };

  const handleItemNameChange = (i: number, value: string) => {
    const updated = [...additionalItems];
    updated[i].name = value;
    setAdditionalItems(updated);
  };

  const handleItemQuantityChange = (i: number, quantity: string) => {
    const updated = [...additionalItems];
    updated[i].quantity = parseFloat(quantity) || 0;
    updated[i].netRate = parseFloat((updated[i].quantity * updated[i].rate).toFixed(2));
    updated[i].taxAmount = parseFloat((updated[i].netRate * (updated[i].tax / 100)).toFixed(2));
    updated[i].totalAmount = parseFloat((updated[i].netRate + updated[i].taxAmount).toFixed(2));
    setAdditionalItems(updated);
    const { totalTax, totalAmount } = recalculateTotals(selections, updated);
    setTax(totalTax);
    setAmount(totalAmount);
  };

  const [itemTax, setItemTax] = useState(0);
  const [itemTotal, setItemTotal] = useState(0);

  const recalculateItemTotals = (items: Additional[]) => {
    const totalTax = items.reduce((acc, item) => acc + (parseFloat(item.taxAmount.toString()) || 0), 0);
    const totalAmount = items.reduce((acc, item) => acc + (parseFloat(item.totalAmount.toString()) || 0), 0);
    setItemTax(totalTax);
    setItemTotal(totalAmount);
  };

  const handleItemRateChange = (i: number, rate: string) => {
    const updated = [...additionalItems];
    updated[i].rate = parseFloat(rate) || 0;
    updated[i].netRate = parseFloat((updated[i].quantity * updated[i].rate).toFixed(2));
    updated[i].taxAmount = parseFloat((updated[i].netRate * (updated[i].tax / 100)).toFixed(2));
    updated[i].totalAmount = parseFloat((updated[i].netRate + updated[i].taxAmount).toFixed(2));
    setAdditionalItems(updated);
    const { totalTax, totalAmount } = recalculateTotals(selections, updated);
    setTax(totalTax);
    setAmount(totalAmount);
  };

  const handleItemTaxChange = (i: number, tax: string) => {
    const updated = [...additionalItems];
    updated[i].tax = parseFloat(tax) || 0;
    updated[i].netRate = parseFloat((updated[i].quantity * updated[i].rate).toFixed(2));
    updated[i].taxAmount = parseFloat((updated[i].netRate * (updated[i].tax / 100)).toFixed(2));
    updated[i].totalAmount = parseFloat((updated[i].netRate + updated[i].taxAmount).toFixed(2));
    setAdditionalItems(updated);
    const { totalTax, totalAmount } = recalculateTotals(selections, updated);
    setTax(totalTax);
    setAmount(totalAmount);
  };

  const [status, changeStatus] = useState("approved");
  const [interiorArray, setInteriorArray] = useState<any[]>([]);
  const [salesAssociateArray, setSalesAssociateArray] = useState<any[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectReference, setProjectReference] = useState("");
  const [user, setUser] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [additionalRequests, setAdditionalRequests] = useState("");

  const handleItemRemarkChange = (i: number, remark: string) => {
    const updated = [...additionalItems];
    updated[i].remark = remark;
    setAdditionalItems(updated);
  };

  const [selectedMainIndex, setSelectedMainIndex] = useState<number | null>(null);
  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState<number | null>(null);

  const fetchProjectData = async () => {
    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getprojectdata", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.body;
    } catch (error) {
      console.error("Error fetching project data:", error);
      return [];
    }
  };

  const parseSafely = (input: any, fallback: any) => {
    if (typeof input !== "string") return fallback;
    try {
      return JSON.parse(input);
    } catch {
      return fallback;
    }
  };

  const deepClone = (obj: any): any => {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(deepClone);
    const cloned: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  };

  const fixBrokenArray = (input: any): string[] => {
    if (Array.isArray(input)) return input;
    if (typeof input !== "string") return [];
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      const cleaned = input
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((item: string) => item.trim().replace(/^"+|"+$/g, ""));
      return cleaned;
    }
  };

  const sendProjectData = async () => {
    try {
      let allProjects = projects;

      if (!allProjects || allProjects.length === 0) {
        allProjects = await fetchProjectData();
        dispatch(setProjects(allProjects));
      }

      const isDuplicate = allProjects.some(
        (project) => project.projectName?.toLowerCase().trim() === projectName?.toLowerCase().trim()
      );

      if (isDuplicate) {
        alert(`Project "${projectName}" already exists.`);
        return;
      }

      const date = Date.now();

      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/sendprojectdata", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          customerLink: JSON.stringify(selectedCustomer),
          projectReference,
          status,
          totalAmount: amount,
          totalTax: tax,
          paid,
          discount,
          createdBy: user,
          allData: JSON.stringify(selections),
          projectDate,
          additionalRequests,
          interiorArray: JSON.stringify(interiorArray),
          salesAssociateArray: JSON.stringify(salesAssociateArray),
          additionalItems: JSON.stringify(additionalItems),
          goodsArray: JSON.stringify(goodsArray),
          tailorsArray: JSON.stringify(tailorsArray),
          projectAddress: JSON.stringify(projectAddress),
          date
        }),
      });

      if (response.status === 200) {
        alert("Project Added");
        const updatedData = await fetchProjectData();
        dispatch(setProjects(updatedData));
        localStorage.setItem("projectData", JSON.stringify({ data: updatedData, time: Date.now() }));
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Error: Failed to add project");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error: Network issue or server not responding");
    }
  };

  useEffect(() => {
    const fetchAndDispatch = async (
      fetchFn: () => Promise<any>,
      dispatchFn: (data: any) => void,
      key: string,
      setStateFn?: (data: any) => void
    ) => {
      try {
        const oneHour = 3600 * 1000;
        let shouldFetch = true;

        const cached = localStorage.getItem(key);
        if (cached) {
          const { data, time } = JSON.parse(cached);

          if (Date.now() - time < oneHour) {
            dispatch(dispatchFn(data));
            setStateFn?.(data);
            shouldFetch = false;
          } else {
            localStorage.removeItem(key);
          }
        }

        if (shouldFetch) {
          const freshData = await fetchFn();
          dispatch(dispatchFn(freshData));
          setStateFn?.(freshData);
          localStorage.setItem(key, JSON.stringify({ data: freshData, time: Date.now() }));
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
      }
    };

    const fetchAllData = async () => {
      await Promise.all([
        fetchAndDispatch(fetchInteriors, setInteriorData, "interiorData", setInterior),
        fetchAndDispatch(getItemsData, setItemData, "itemsData", setSingleItems),
        fetchAndDispatch(fetchSalesAssociates, setSalesAssociateData, "salesAssociateData", setSalesData),
        fetchAndDispatch(fetchProductGroups, setProducts, "productsData", setAvailableProductGroups),
        fetchAndDispatch(fetchCatalogues, setCatalogs, "catalogueData"),
        fetchAndDispatch(fetchCustomers, setCustomerData, "customerData", setCustomers)
      ]);
    };

    fetchAllData();
  }, [dispatch]);

  useEffect(() => {
    async function getAreas() {
      try {
        const cachedData = localStorage.getItem("areasData");
        const oneHour = 3600 * 1000;

        if (cachedData) {
          const { data, time } = JSON.parse(cachedData);

          if (Date.now() - time < oneHour) {
            setAvailableAreas(data);
            return;
          } else {
            localStorage.removeItem("areasData");
          }
        }

        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getAreas");
        const data = await response.json();
        setAvailableAreas(data.body);

        localStorage.setItem("areasData", JSON.stringify({ data: data.body, time: Date.now() }));
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    }

    if (availableAreas.length === 0) {
      getAreas();
    }
  }, []);

  const bankDetails = ["123213", "!23123213", "123132"];
  const termsConditions = ["sadsdsad", "Adasdad"];

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yOffset = 30; // Increased top gap

    // Setting up fonts and colors
    doc.setFont("helvetica", "normal");
    const primaryColor = [0, 51, 102]; // Dark blue
    const secondaryColor = [33, 33, 33]; // Dark gray
    const accentColor = [0, 102, 204]; // Bright blue
    const lightGray = [245, 245, 245];

    // Header Section with Logo Placeholder and Gradient Background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFillColor(...accentColor);
    doc.rect(0, 40, pageWidth, 2, 'F'); // Accent line
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Quotation", pageWidth / 2, 25, { align: "center" });

    // Company Details
    yOffset += 25;
    doc.setFontSize(12);
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "normal");
    doc.text("Sheela Decor", 20, yOffset);
    yOffset += 7;
    doc.text("123 Business Street, City, Country", 20, yOffset);
    yOffset += 7;
    doc.text("Email: contact@sheeladecor.com | Phone: +123 456 7890", 20, yOffset);
    yOffset += 10;

    // Divider Line with Gradient
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 10;

    // Project and Customer Details in a Card-like Layout
    doc.setFillColor(...lightGray);
    doc.roundedRect(20, yOffset, pageWidth - 40, 30, 3, 3, 'F');
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Project Details", 30, yOffset + 8); // Equal padding
    doc.text("Customer Details", pageWidth / 2 + 20, yOffset + 8); // Equal padding
    yOffset += 15;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(`Project: ${projectName || "N/A"}`, 30, yOffset);
    doc.text(`Customer: ${selectedCustomer?.name || "N/A"}`, pageWidth / 2 + 20, yOffset);
    yOffset += 7;
    doc.text(`Reference: ${projectReference || "N/A"}`, 30, yOffset);
    doc.text(`Address: ${projectAddress || "N/A"}`, pageWidth / 2 + 20, yOffset);
    yOffset += 7;
    doc.text(`Date: ${projectDate || new Date().toLocaleDateString()}`, 30, yOffset);
    yOffset += 15;

    // Table Data Preparation
    const tableData = [];
    let srNo = 1;

    selections.forEach((selection, mainIndex) => {
      if (selection.areacollection && selection.areacollection.length > 0) {
        // Area Header with Background
        tableData.push([
          { content: selection.area, colSpan: 9, styles: { fontStyle: "bold", fillColor: accentColor, textColor: [255, 255, 255], fontSize: 10 } },
        ]);

        selection.areacollection.forEach((collection, collectionIndex) => {
          const pg = collection.productGroup;
          if (!Array.isArray(pg) || pg.length < 2) return;
          const relevantPG = pg.length > 2 ? pg.slice(1, -2) : [];
          const matchedItems = relevantPG.map((pgItem) => {
            const matched = items.find((item) => item[0] === pgItem);
            return matched || pgItem;
          });
          const validMatchedItems = matchedItems.filter((el) => Array.isArray(el));
          validMatchedItems.forEach((item, itemIndex) => {
            const qty = collection.quantities?.[itemIndex] || 0;
            tableData.push([
              srNo++,
              `${item[0]} * ${collection.measurement.quantity}`,
              `${collection.measurement.width} x ${collection.measurement.height} ${collection.measurement.unit}`,
              `₹${(item[4] * parseFloat(collection.measurement.quantity)).toFixed(2)}`,
              qty,
              `₹${(item[4] * parseFloat(collection.measurement.quantity) * qty).toFixed(2)}`,
              `${item[5].toFixed(2)}%`,
              `₹${collection.totalTax[itemIndex]?.toFixed(2) || "0.00"}`,
              `₹${collection.totalAmount[itemIndex]?.toFixed(2) || "0.00"}`,
            ]);
          });
        });
      }
    });

    // Miscellaneous Items Header
    if (additionalItems.length > 0) {
      tableData.push([
        { content: "Miscellaneous Items", colSpan: 9, styles: { fontStyle: "bold", fillColor: accentColor, textColor: [255, 255, 255], fontSize: 10 } },
      ]);

      additionalItems.forEach((item, i) => {
        tableData.push([
          srNo++,
          item.name || "N/A",
          "N/A",
          `₹${item.rate.toFixed(2)}`,
          item.quantity,
          `₹${item.netRate.toFixed(2)}`,
          `${item.tax.toFixed(2)}%`,
          `₹${item.taxAmount.toFixed(2)}`,
          `₹${item.totalAmount.toFixed(2)}`,
        ]);
      });
    }

    // Table Rendering with Enhanced Styling
    autoTable(doc, {
      startY: yOffset,
      head: [
        ["Sr. No.", "Product Name", "Size", "MRP", "Quantity", "Subtotal", "Tax Rate (%)", "Tax Amount", "Total"],
      ],
      body: tableData,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 4,
        textColor: secondaryColor,
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, // Sr. No.
        1: { cellWidth: 40 }, // Product Name
        2: { cellWidth: 30 }, // Size
        3: { cellWidth: 20, halign: "right" }, // MRP
        4: { cellWidth: 15, halign: "center" }, // Quantity
        5: { cellWidth: 20, halign: "right" }, // Subtotal
        6: { cellWidth: 15, halign: "center" }, // Tax Rate
        7: { cellWidth: 20, halign: "right" }, // Tax Amount
        8: { cellWidth: 20, halign: "right" }, // Total
      },
      margin: { left: 20, right: 20 },
      didDrawPage: (data) => {
        // Add Page Number
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${data.pageNumber}`, pageWidth - 20, pageHeight - 10, { align: "right" });
      },
    });

    yOffset = doc.lastAutoTable.finalY + 15;

    // Summary Section with Card-like Layout
    doc.setFillColor(...lightGray);
    doc.roundedRect(pageWidth - 110, yOffset - 5, 90, 65, 3, 3, 'F'); // Adjusted width and height
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Summary", pageWidth - 105, yOffset);
    yOffset += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    const summaryItems = [
      { label: "Sub Total", value: `₹${amount.toFixed(2)}` },
      { label: "Total Tax Amount", value: `₹${tax.toFixed(2)}` },
      { label: "Total Amount", value: `₹${(amount + tax).toFixed(2)}` },
      { label: "Discount", value: `₹${discount.toFixed(2)}` },
      { label: "Grand Total", value: `₹${(amount + tax - discount).toFixed(2)}` },
    ];

    summaryItems.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.text(item.label, pageWidth - 105, yOffset);
      doc.setFont("helvetica", "normal");
      doc.text(item.value, pageWidth - 25, yOffset, { align: "right" }); // Adjusted right padding
      yOffset += 10; // Increased spacing
    });

    // Terms and Conditions
    yOffset += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Terms & Conditions", 20, yOffset);
    yOffset += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    const terms = [
      "Prices are inclusive of taxes unless otherwise stated.",
      "Quotation is valid for 30 days from the date of issue.",
      "All payments must be made in INR.",
    ];
    terms.forEach((term) => {
      doc.text(`• ${term}`, 20, yOffset);
      yOffset += 6;
    });

    // Footer with Accent Line
    doc.setFillColor(...accentColor);
    doc.rect(0, pageHeight - 30, pageWidth, 2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing Sheela Decor!", pageWidth / 2, pageHeight - 20, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("Sheela Decor - All Rights Reserved", pageWidth / 2, pageHeight - 12, { align: "center" });

    // Save PDF
    doc.save(`Quotation_${projectName || "Project"}_${projectDate || new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Add New Project</h1>
        <div className="flex gap-4 text-sm md:text-base">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors no-underline">
            Dashboard
          </Link>
          <Link to="/projects" className="text-blue-600 hover:text-blue-800 transition-colors no-underline">
            All Projects
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Customer Details */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <CustomerDetails
            customers={customers}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            projectData={projectData}
            setCustomers={setCustomers}
          />
        </div>

        {/* Project Details */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <ProjectDetails
            selectedCustomer={selectedCustomer}
            interior={interior}
            setInterior={setInterior}
            salesdata={salesData}
            interiorArray={interiorArray}
            setInteriorArray={setInteriorArray}
            salesAssociateArray={salesAssociateArray}
            setSalesAssociateArray={setSalesData}
            projectName={projectName}
            setProjectName={setProjectName}
            projectReference={projectReference}
            setProjectReference={setProjectReference}
            user={user}
            setUser={setUser}
            projectDate={projectDate}
            setProjectDate={setProjectDate}
            setAdditionalRequests={setAdditionalRequests}
            additionalRequests={additionalRequests}
            projectAddress={projectAddress}
            setProjectAddress={setProjectAddress}
            setSalesData={setSalesData}
          />
        </div>

        {/* Material Selection */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
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
            handleGroupDelete={handleGroupDelete}
            setAvailableAreas={setAvailableAreas}
            singleItems={singleItems}
          />
        </div>

        {/* Measurement Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <MeasurementSection
            selections={selections}
            units={units}
            handleRemoveArea={handleRemoveArea}
            handleReferenceChange={handleReferenceChange}
            handleunitchange={handleUnitChange}
            handlewidthchange={handleWidthChange}
            handleheightchange={handleHeightChange}
            handlequantitychange={handleQuantityChangeMain}
            setSelections={setSelections}
            handleGroupDelete={handleGroupDelete}
          />
        </div>

        {/* Quotation Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Quotation</h2>
          <div className="space-y-6">
            {selections.map((selection, mainIndex) => (
              <div key={mainIndex} className="w-full">
                <h3 className="font-semibold text-lg text-gray-700 mb-3">{selection.area}</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full bg-white">
                    <tbody>
                      {selection.areacollection && selection.areacollection.length > 0 ? (
                        selection.areacollection.map((collection, collectionIndex) => {
                          if (!Array.isArray(collection.items)) {
                            return (
                              <tr key={`error-${collectionIndex}`}>
                                <td colSpan={9} className="text-center text-red-500 py-4 text-sm">
                                  No items found for collection {collectionIndex + 1}
                                </td>
                              </tr>
                            );
                          }

                          return collection.items.map((item: any, itemIndex: number) => {
                            const key = `${mainIndex}-${collectionIndex}-${itemIndex}`;
                            const qty = collection.quantities?.[itemIndex] || 0;

                            return (
                              <tr
                                key={key}
                                className="flex flex-col sm:table-row border-b border-gray-200 hover:bg-gray-50"
                              >
                                <td className="py-3 px-4 text-sm text-center">{itemIndex + 1}</td>
                                <td className="py-3 px-4 text-sm">{item[0] + " * " + collection.measurement.quantity}</td>
                                <td className="py-3 px-4 text-sm">
                                  {collection.measurement.width +
                                    " x " +
                                    collection.measurement.height +
                                    " " +
                                    collection.measurement.unit}
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  ₹{(item[4] * parseFloat(collection.measurement.quantity)).toFixed(2)}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex flex-col gap-1">
                                    <input
                                      type="number"
                                      value={collection.quantities?.[itemIndex] || ""}
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          key,
                                          e.target.value,
                                          mainIndex,
                                          collectionIndex,
                                          collection.measurement.quantity,
                                          item[4],
                                          item[5],
                                          itemIndex
                                        )
                                      }
                                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-20"
                                      min="0"
                                    />
                                    <p className="text-xs text-gray-500">{item[3]}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  ₹{(item[4] * parseFloat(collection.measurement.quantity) * qty).toFixed(2)}
                                </td>
                                <td className="py-3 px-4 text-sm">{item[5]}%</td>
                                <td className="py-3 px-4 text-sm">
                                  ₹{collection.totalTax[itemIndex]?.toFixed(2) || "0.00"}
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  ₹{collection.totalAmount[itemIndex]?.toFixed(2) || "0.00"}
                                </td>
                              </tr>
                            );
                          });
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className="text-center py-4 text-gray-500 text-sm">
                            No product data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Miscellaneous Section */}
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Miscellaneous</h3>
            <div className="flex justify-end mb-4">
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                onClick={handleAddMiscItem}
              >
                <FaPlus className="w-4 h-4" />
                Add Item
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full bg-white hidden sm:table">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                    <th className="py-3 px-4 text-center">SR</th>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Rate</th>
                    <th className="py-3 px-4">Net Rate</th>
                    <th className="py-3 px-4">Tax (%)</th>
                    <th className="py-3 px-4">Tax Amount</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Remark</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {additionalItems.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-center text-sm">{i + 1}</td>
                      <td className="py-3 px-4">
                        <input
                          onChange={(e) => handleItemNameChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.name || ""}
                          type="text"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          onChange={(e) => handleItemQuantityChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.quantity || ""}
                          type="number"
                          min="0"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          onChange={(e) => handleItemRateChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.rate || ""}
                          type="number"
                          min="0"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-center">₹{item.netRate.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <input
                          onChange={(e) => handleItemTaxChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.tax || ""}
                          type="number"
                          min="0"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-center">₹{item.taxAmount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-center">₹{item.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <input
                          onChange={(e) => handleItemRemarkChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.remark || ""}
                          type="text"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button onClick={() => handleDeleteMiscItem(i)}>
                          <FaTrash className="text-red-500 hover:text-red-600 w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mobile View for Miscellaneous */}
              <div className="sm:hidden flex flex-col gap-4 mt-4">
                {additionalItems.map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-sm">SR: {i + 1}</span>
                      <button onClick={() => handleDeleteMiscItem(i)}>
                        <FaTrash className="text-red-500 hover:text-red-600 w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input
                          onChange={(e) => handleItemNameChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.name || ""}
                          type="text"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          onChange={(e) => handleItemQuantityChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.quantity || ""}
                          type="number"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rate</label>
                        <input
                          onChange={(e) => handleItemRateChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.rate || ""}
                          type="number"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Net Rate</label>
                        <span className="text-sm">₹{item.netRate.toFixed(2)}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tax (%)</label>
                        <input
                          onChange={(e) => handleItemTaxChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.tax || ""}
                          type="number"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tax Amount</label>
                        <span className="text-sm">₹{item.taxAmount.toFixed(2)}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                        <span className="text-sm">₹{item.totalAmount.toFixed(2)}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Remark</label>
                        <input
                          onChange={(e) => handleItemRemarkChange(i, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={item.remark || ""}
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary and Bank Details */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Bank Details and Terms */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Details & Terms</h3>
            <div className="space-y-4">
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Bank Details</option>
                {bankDetails.map((data, index) => (
                  <option key={index} value={data}>
                    {data}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Bank Details Description"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              ></textarea>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Terms & Conditions</option>
                {termsConditions.map((data, index) => (
                  <option key={index} value={data}>
                    {data}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Terms & Conditions Description"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              ></textarea>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sub Total</span>
                <span className="font-medium">₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Tax Amount</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium">₹{(amount + tax).toFixed(2)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Discount</span>
                <input
                  className="w-24 border border-gray-300 rounded-md px-3 py-1 text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  type="number"
                  min="0"
                />
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-semibold">Grand Total</span>
                <span className="font-semibold text-blue-600">₹{(amount + tax - discount).toFixed(2)}</span>
              </div>
              <div className="flex gap-2 flex-col">
              <button
                onClick={sendProjectData}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium mt-4"
              >
                Add Project & Generate Quote
              </button>
              
              <button
                onClick={generatePDF}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Download Quotation PDF
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProjectForm;