
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
    width: string;
    height: string;
    quantity: string;
    newquantity?: string;
  }

  interface CollectionArea {
    productGroup: any;
    items: any[];
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
        measurement: { unit: "Centimeter (cm)", width: "0", height: "0", quantity: "0" },
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }
  
    const newproduct = product.split(",");
    updatedSelections[mainindex].areacollection[i].productGroup = newproduct;
  
    const pg = newproduct;
    if (!Array.isArray(pg) || pg.length < 2) return;
  
    const relevantPG = pg.length > 2 ? pg.slice(1, -2) : [];
  
    const newMatchedItems = relevantPG.map(pgItem =>
      items.find(item => item[0] === pgItem)
    ).filter(item => Array.isArray(item));
  
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
        measurement: { unit: "Centimeter (cm)", width: "0", height: "0", quantity: "0" },
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
        measurement: { unit: "Centimeter (cm)", width: "0", height: "0", quantity: "0" },
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
        measurement: { unit: "Centimeter (cm)", width: "0", height: "0", quantity: "0" },
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
        measurement: { unit: "Centimeter (cm)", width: "0", height: "0", quantity: "0" },
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
        measurement: { unit: "Centimeter (cm)", width: "0", height: "0", quantity: "0" },
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
    
      // Add new entries
      setGoodsArray(prev => [...prev, ...newGoods]);
      setTailorsArray(prev => [...prev, ...newTailors]);
    };

    const handleGroupDelete = (mainindex : number, index : number) => {
      const updatedSelection = [...selections];
      if(updatedSelection[mainindex].areacollection[index]){
        updatedSelection[mainindex].areacollection.splice(index, 1);
      }

      setSelections(updatedSelection);
    }
    
  const units = ["Inches (in)", "Centimeter (cm)", "Meters (m)", "Feet (ft)"];

  const handleWidthChange = (mainindex: number, index: number, width: string) => {
    const updatedSelections = [...selections];
    updatedSelections[mainindex].areacollection[index].measurement.width = width;
    setSelections(updatedSelections);
  };

  const handleHeightChange = (mainindex: number, index: number, height: string) => {
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

  const handleQuantityChangeMain = (mainIndex: number, index: number, quantity: string) => {
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
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/getprojectdata",
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.body || !Array.isArray(data.body)) {
      throw new Error("Invalid data format: Expected an array in data.body");
    }

    const parseSafely = (value: any, fallback: any) => {
      try {
        return typeof value === "string" ? JSON.parse(value) : value || fallback;
      } catch (error) {
        console.warn("Invalid JSON:", value, error);
        return fallback;
      }
    };

    const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

    const fixBrokenArray = (input: any): string[] => {
      if (Array.isArray(input)) return input;
      if (typeof input !== "string") return [];

      try {
        const fixed = JSON.parse(input);
        if (Array.isArray(fixed)) return fixed;
        return [];
      } catch {
        try {
          const cleaned = input
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map((item: string) => item.trim().replace(/^"+|"+$/g, ""));
          return cleaned;
        } catch {
          return [];
        }
      }
    };

    const projects = data.body.map((row: any[]) => ({
      projectName: row[0],
      customerLink: parseSafely(row[1], []),
      projectReference: row[2] || "",
      status: row[3] || "",
      totalAmount: parseFloat(row[4]) || 0,
      totalTax: parseFloat(row[5]) || 0,
      paid: parseFloat(row[6]) || 0,
      discount: parseFloat(row[7]) || 0,
      createdBy: row[8] || "",
      allData: deepClone(parseSafely(row[9], [])),
      projectDate: row[10] || "",
      additionalRequests: parseSafely(row[11], []),
      interiorArray: fixBrokenArray(row[12]),
      salesAssociateArray: fixBrokenArray(row[13]),
      additionalItems: deepClone(parseSafely(row[14], [])),
      goodsArray: deepClone(parseSafely(row[15], [])),
      tailorsArray: deepClone(parseSafely(row[16], [])),
      projectAddress : row[17],
    }));

    return projects;
  };

const sendProjectData = async () => {
  try {
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
      }),
    });

    if (response.status === 200) {
      alert("Project Added");

      // ✅ Fetch updated project data
      const updatedData = await fetchProjectData();

      // ✅ Update Redux and local state
      dispatch(setProjects(updatedData));
      setProjects(updatedData);

      // ✅ Update localStorage cache
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


  const [goodsItems, setGoodsItems] = useState<any[]>([]);
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
        fetchAndDispatch(
          async () => {
            const response = await fetch(
              "https://sheeladecor.netlify.app/.netlify/functions/server/getsingleproducts",
              { credentials: "include" }
            );
            const result = await response.json();
            return result.body || [];
          },
          setItemData,
          "itemsData",
          setSingleItems
        ),
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
  }, [availableAreas.length]);

  const bankDetails = ["123213", "!23123213", "123132"];
  const termsConditions = ["sadsdsad", "Adasdad"];

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yOffset = 20;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Quotation", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Sheela Decor", 20, yOffset);
    yOffset += 7;
    doc.text("123 Business Street, City, Country", 20, yOffset);
    yOffset += 7;
    doc.text("Email: contact@sheeladecor.com", 20, yOffset);
    yOffset += 7;
    doc.text("Phone: +123 456 7890", 20, yOffset);
    yOffset += 10;

    doc.setFontSize(10);
    doc.text(`Quotation Date: ${projectDate || "N/A"}`, 20, yOffset);
    doc.text(`Project: ${projectName || "N/A"}`, pageWidth - 80, yOffset);
    yOffset += 7;
    doc.text(`Customer: ${selectedCustomer?.name || "N/A"}`, 20, yOffset);
    doc.text(`Reference: ${projectReference || "N/A"}`, pageWidth - 80, yOffset);
    yOffset += 15;

    const tableData: any[] = [];
    let srNo = 1;

    selections.forEach((selection, mainIndex) => {
      if (selection.areacollection && selection.areacollection.length > 0) {
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
              (item[4] * parseFloat(collection.measurement.quantity)).toFixed(2),
              qty,
              (item[4] * parseFloat(collection.measurement.quantity) * qty).toFixed(2),
              item[5].toFixed(2),
              collection.totalTax[itemIndex]?.toFixed(2) || "0.00",
              collection.totalAmount[itemIndex]?.toFixed(2) || "0.00",
            ]);
          });
        });
      }
    });

    additionalItems.forEach((item, i) => {
      tableData.push([
        srNo++,
        item.name || "N/A",
        "N/A",
        item.rate.toFixed(2),
        item.quantity,
        item.netRate.toFixed(2),
        item.tax.toFixed(2),
        item.taxAmount.toFixed(2),
        item.totalAmount.toFixed(2),
      ]);
    });

    autoTable(doc, {
      startY: yOffset,
      head: [
        ["Sr. No.", "Product Name", "Size", "MRP", "Quantity", "Subtotal", "Tax Rate (%)", "Tax Amount", "Total"],
      ],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    yOffset = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 20, yOffset);
    yOffset += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Sub Total: ${amount.toFixed(2)}`, pageWidth - 80, yOffset);
    yOffset += 7;
    doc.text(`Total Tax Amount: ${tax.toFixed(2)}`, pageWidth - 80, yOffset);
    yOffset += 7;
    doc.text(`Total Amount: ${(amount + tax).toFixed(2)}`, pageWidth - 80, yOffset);
    yOffset += 7;
    doc.text(`Discount: ${discount.toFixed(2)}`, pageWidth - 80, yOffset);
    yOffset += 7;
    doc.text(`Grand Total: ${(amount + tax - discount).toFixed(2)}`, pageWidth - 80, yOffset);

    yOffset = pageHeight - 20;
    doc.setFontSize(8);
    doc.text("Thank you for your business!", pageWidth / 2, yOffset, { align: "center" });

    doc.save(`Quotation_${projectName || "Project"}_${projectDate || "Date"}.pdf`);
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
        setCustomers={setCustomers}
      />
      <ProjectDetails
        selectedCustomer={selectedCustomer}
        interior={interior}
        salesdata={salesData}
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
        setProjectDate={setProjectDate}
        setAdditionalRequests={setAdditionalRequests}
        additionalRequests={additionalRequests}
        projectAddress={projectAddress}
        setProjectAddress={setProjectAddress}
        setSalesData={setSalesData}
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
        handleGroupDelete={handleGroupDelete}
        setAvailableAreas={setAvailableAreas}
      />
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
      <div className="flex flex-col p-6 border rounded-lg w-full shadow-2xl">
        <p className="text-[1.3vw] font-semibold">Quotation</p>
        <div className="flex flex-col gap-3 w-full">
          {selections.map((selection, mainIndex) => (
            <div key={mainIndex} className="w-full">
              <p className="font-semibold mb-2">{selection.area}</p>
              <table className="w-full border-collapse mb-6 text-xs sm:text-sm">
                <tbody>
                  {selection.areacollection && selection.areacollection.length > 0 ? (
                    selection.areacollection.map((collection, collectionIndex) => {
                      const pg = collection.productGroup;
                      if (!Array.isArray(pg) || pg.length < 2) return null;
                      const relevantPG = pg.length > 2 ? pg.slice(1, -2) : [];
                      const matchedItems = relevantPG.map((pgItem) => {
                        const matched = items.find((item) => item[0] === pgItem);
                        return matched || pgItem;
                      });
                      const validMatchedItems = matchedItems.filter((el) => Array.isArray(el));
                      return validMatchedItems.map((item, itemIndex) => {
                        const key = `${mainIndex}-${collectionIndex}-${itemIndex}`;
                        const qty = selection.areacollection[collectionIndex]?.quantities?.[itemIndex] || 0;
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
                                  value={selection.areacollection[collectionIndex]?.quantities?.[itemIndex] || ""}
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
        <div className="border p-4 sm:p-6 rounded-lg w-full flex flex-col">
          <p className="font-semibold text-lg sm:text-xl">Miscellaneous</p>
          <div className="flex w-full flex-col">
            <div className="flex flex-row justify-between items-center mt-4">
              <button
                className="flex flex-row gap-2 !rounded-md bg-sky-50 hover:bg-sky-100 items-center px-2 py-1 text-sm sm:text-base"
                onClick={handleAddMiscItem}
              >
                <FaPlus className="text-sky-500" />
                Add Item
              </button>
            </div>
            <div className="mt-3 w-full overflow-x-auto">
              <table className="w-full hidden sm:table">
                <thead>
                  <tr className="flex flex-wrap w-full justify-between text-sm sm:text-base">
                    <td className="w-12 text-center">SR</td>
                    <td className="w-24">Item Name</td>
                    <td className="w-20">Quantity</td>
                    <td className="w-20">Rate</td>
                    <td className="w-20">Net Rate</td>
                    <td className="w-20">Tax (%)</td>
                    <td className="w-20">Tax Amount</td>
                    <td className="w-20">Total Amount</td>
                    <td className="w-24">Remark</td>
                    <td className="w-20 text-center">Actions</td>
                  </tr>
                </thead>
                <tbody className="flex flex-col w-full">
                  {additionalItems.map((item, i) => (
                    <tr key={i} className="w-full flex flex-row justify-between mt-2 text-sm sm:text-base">
                      <td className="text-center w-12">{i + 1}</td>
                      <td className="w-24">
                        <input
                          onChange={(e) => handleItemNameChange(i, e.target.value)}
                          className="pl-2 w-full border rounded-lg text-sm"
                          value={item.name || ""}
                          type="text"
                        />
                      </td>
                      <td className="w-20">
                        <input
                          onChange={(e) => handleItemQuantityChange(i, e.target.value)}
                          className="pl-2 w-full border rounded-lg text-sm"
                          value={item.quantity || ""}
                          type="text"
                        />
                      </td>
                      <td className="w-20">
                        <input
                          onChange={(e) => handleItemRateChange(i, e.target.value)}
                          className="pl-2 w-full border rounded-lg text-sm"
                          value={item.rate || ""}
                          type="text"
                        />
                      </td>
                      <td className="w-20 text-center">{item.netRate.toFixed(2)}</td>
                      <td className="w-20">
                        <input
                          onChange={(e) => handleItemTaxChange(i, e.target.value)}
                          className="pl-2 w-full border rounded-lg text-sm"
                          value={item.tax || ""}
                          type="text"
                        />
                      </td>
                      <td className="w-20 text-center">{item.taxAmount.toFixed(2)}</td>
                      <td className="w-20 text-center">{item.totalAmount.toFixed(2)}</td>
                      <td className="w-24">
                        <input
                          onChange={(e) => handleItemRemarkChange(i, e.target.value)}
                          className="pl-2 w-full border rounded-lg text-sm"
                          value={item.remark || ""}
                          type="text"
                        />
                      </td>
                      <td className="w-20 text-center">
                        <button onClick={() => handleDeleteMiscItem(i)}>
                          <FaTrash className="text-red-500 hover:text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="sm:hidden flex flex-col gap-4 mt-4">
                {additionalItems.map((item, i) => (
                  <div key={i} className="border rounded-lg p-4 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">SR: {i + 1}</span>
                      <button onClick={() => handleDeleteMiscItem(i)}>
                        <FaTrash className="text-red-500 hover:text-red-600" />
                      </button>
                    </div>
                    <div>
                      <label className="block font-medium">Item Name</label>
                      <input
                        onChange={(e) => handleItemNameChange(i, e.target.value)}
                        className="pl-2 w-full border rounded-lg"
                        value={item.name || ""}
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Quantity</label>
                      <input
                        onChange={(e) => handleItemQuantityChange(i, e.target.value)}
                        className="pl-2 w-full border rounded-lg"
                        value={item.quantity || ""}
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Rate</label>
                      <input
                        onChange={(e) => handleItemRateChange(i, e.target.value)}
                        className="pl-2 w-full border rounded-lg"
                        value={item.rate || ""}
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Net Rate</label>
                      <span>{item.netRate.toFixed(2)}</span>
                    </div>
                    <div>
                      <label className="block font-medium">Tax (%)</label>
                      <input
                        onChange={(e) => handleItemTaxChange(i, e.target.value)}
                        className="pl-2 w-full border rounded-lg"
                        value={item.tax || ""}
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Tax Amount</label>
                      <span>{item.taxAmount.toFixed(2)}</span>
                    </div>
                    <div>
                      <label className="block font-medium">Total Amount</label>
                      <span>{item.totalAmount.toFixed(2)}</span>
                    </div>
                    <div>
                      <label className="block font-medium">Remark</label>
                      <input
                        onChange={(e) => handleItemRemarkChange(i, e.target.value)}
                        className="pl-2 w-full border rounded-lg"
                        value={item.remark || ""}
                        type="text"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-between w-full">
        <div className="flex flex-col gap-4 w-full sm:w-1/2 rounded mt-3 p-4 sm:p-6 shadow-xl border">
          <select className="border p-2 rounded w-full sm:w-1/2 h-12 sm:h-16 text-sm sm:text-base">
            <option value="">Bank Details</option>
            {bankDetails.map((data, index) => (
              <option key={index} value={data}>
                {data}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            className="w-full rounded-lg border py-2 pl-2 text-sm sm:text-base"
            rows={4}
          ></textarea>
          <select className="border p-2 rounded w-full sm:w-1/2 h-12 sm:h-16 text-sm sm:text-base">
            <option value="">Terms & Conditions</option>
            {termsConditions.map((data, index) => (
              <option key={index} value={data}>
                {data}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            className="w-full rounded-lg border py-2 pl-2 text-sm sm:text-base"
            rows={4}
          ></textarea>
        </div>
        <div className="shadow-xl p-4 sm:p-6 flex flex-col gap-4 border w-full sm:w-1/2 rounded-lg">
          <p className="text-lg sm:text-xl font-semibold">Summary</p>
          <div className="flex flex-row justify-between w-full">
            <p className="text-sm sm:text-base">Sub Total</p>
            <p className="text-sm sm:text-base">{amount.toFixed(2)}</p>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-sm sm:text-base">Total Tax Amount</p>
            <p className="text-sm sm:text-base">{tax.toFixed(2)}</p>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-sm sm:text-base">Total Amount</p>
            <p className="text-sm sm:text-base">{(amount + tax).toFixed(2)}</p>
          </div>
          <div className="border border-gray-400"></div>
          <div className="flex justify-between items-center mt-1 w-full">
            <p className="text-sm sm:text-base">Discount</p>
            <input
              className="rounded-lg border text-center w-24 sm:w-32 text-sm sm:text-base"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              type="text"
            />
          </div>
          <div className="border border-gray-400"></div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm sm:text-base">Grand Total</p>
            <p className="text-sm sm:text-base">{(amount + tax - discount).toFixed(2)}</p>
          </div>
          <button
            onClick={sendProjectData}
            className="!rounded-lg bg-sky-700 hover:bg-sky-800 text-white p-2 sm:p-3 text-sm sm:text-base"
          >
            Add Project & Generate Quote
          </button>
          <button
            onClick={generatePDF}
            className="!rounded-lg bg-green-600 hover:bg-green-700 text-white p-2 sm:p-3 text-sm sm:text-base"
          >
            Download Quotation PDF
          </button>
        </div>
      </div>
      <br />
    </div>
  );
}

export default AddProjectForm;
