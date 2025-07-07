import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../Redux/store";
import {
  setSalesAssociateData,
  setInteriorData,
  setCustomerData,
  setProducts,
  setCatalogs,
  setProjects,
  setItemData,
  setTermsData,
  setBankData,
} from "../Redux/dataSlice";
import { Plus, Upload } from "lucide-react";
import { FaPlus, FaTrash } from "react-icons/fa";
import CustomerDetails from "./CustomerDetails";
import ProjectDetails from "./ProjectDetails";
import MaterialSelectionComponent from "./MaterialSelectionComponent";
import MeasurementSection from "./MeasurementSections";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchWithLoading } from "../Redux/fetchWithLoading";

function AddProjectForm() {
  const dispatch = useDispatch();
  const customerData = useSelector((state: RootState) => state.data.customers);
  const interiorData = useSelector((state: RootState) => state.data.interiors);
  const salesAssociateData = useSelector(
    (state: RootState) => state.data.salesAssociates
  );
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

  const termData = useSelector((state: RootState) => state.data.termsData);
  const bankData = useSelector((state: RootState) => state.data.bankData);

  const [terms, setTerms] = useState("NA");
  const [bank, setBank] = useState("NA");
  const [availableProductGroups, setAvailableProductGroups] = useState<any[]>(
    []
  );

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

  const [discountType, setDiscountType] = useState("cash");

  const [grandTotal, setGrandTotal] = useState(0);

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
    const response = await fetchWithLoading(
      "https://sheeladecor.netlify.app/.netlify/functions/server/getsingleproducts"
    );
    const data = await response.json();
    return data.body;
  };

  useEffect(() => {
    const loadCustomers = async () => {
      const response = await fetch(
        "https://sheeladecor.netlify.app/.netlify/functions/server/getcustomerdata",
        { credentials: "include" }
      );
      const data = await response.json();
      const parsed = Array.isArray(data.body) ? data.body : [];
      setCustomers(parsed);
    };

    loadCustomers();
  }, []); // fetch only once on mount


  const fetchCustomers = async () => {
    try {
      const response = await fetchWithLoading(
        "https://sheeladecor.netlify.app/.netlify/functions/server/getcustomerdata",
        {
          credentials: "include",
        }
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

  async function fetchCatalogues() {
    try {
      const response = await fetchWithLoading(
        "https://sheeladecor.netlify.app/.netlify/functions/server/getcatalogues",
        {
          credentials: "include",
        }
      );
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
      const response = await fetchWithLoading(
        "https://sheeladecor.netlify.app/.netlify/functions/server/getinteriordata",
        {
          credentials: "include",
        }
      );
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
      const response = await fetchWithLoading(
        "https://sheeladecor.netlify.app/.netlify/functions/server/getsalesassociatedata",
        {
          credentials: "include",
        }
      );
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
      const response = await fetchWithLoading(
        "https://sheeladecor.netlify.app/.netlify/functions/server/getallproductgroup",
        {
          credentials: "include",
        }
      );
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
  const fetchTermsData = async () => {
    const response = await fetchWithLoading(
      "https://sheeladecor.netlify.app/.netlify/functions/server/getTermsData"
    );
    const data = await response.json();
    return data.body || [];
  };
  const fetchBankData = async () => {
    const response = await fetchWithLoading(
      "https://sheeladecor.netlify.app/.netlify/functions/server/getBankData"
    );
    const data = await response.json();
    return data.body || [];
  };
  useEffect(() => {
    const fetchAndCacheBankData = async () => {
      const now = Date.now();
      const cached = localStorage.getItem("bankData");

      if (cached) {
        const parsed = JSON.parse(cached);
        const timeDiff = now - parsed.time;
        if (timeDiff < 5 * 60 * 1000 && parsed.data.length > 0) {
          dispatch(setBankData(parsed.data));
          return;
        }
      }

      const data = await fetchBankData();
      dispatch(setBankData(data));
      localStorage.setItem("bankData", JSON.stringify({ data, time: now }));
    };

    fetchAndCacheBankData();
  }, [dispatch]);

  useEffect(() => {
    const fetchAndCacheTermData = async () => {
      const now = Date.now();
      const cached = localStorage.getItem("termData");

      if (cached) {
        const parsed = JSON.parse(cached);
        const timeDiff = now - parsed.time;

        if (timeDiff < 5 * 60 * 1000 && parsed.data.length > 0) {
          dispatch(setTermsData(parsed.data));
          return;
        }
      }

      const data = await fetchTermsData();
      dispatch(setTermsData(data));
      localStorage.setItem("termData", JSON.stringify({ data, time: now }));
    };

    fetchAndCacheTermData();
  }, [dispatch]);

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

  const handleProductGroupChange = (
    mainindex: number,
    i: number,
    product: string
  ) => {
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
        measurement: {
          unit: "Centimeter (cm)",
          width: undefined,
          height: undefined,
          quantity: undefined,
        },
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }

    const newproduct = product;
    updatedSelections[mainindex].areacollection[i].productGroup = newproduct;

    const pg = newproduct;
    if (!Array.isArray(pg) || pg.length < 2) return;

    let relevantPG = pg.length > 2 ? pg.slice(1, -1) : null;

    let newMatchedItems = null;

    if (relevantPG != null) {
      newMatchedItems = relevantPG
        .map((pgItem) => items.find((item) => item[0] === pgItem))
        .filter((item) => Array.isArray(item));
    } else {
      newMatchedItems = [product];
    }

    if (newMatchedItems.length == 0) {
      newMatchedItems = [product];
    }

    updatedSelections[mainindex].areacollection[i].items = newMatchedItems;
    setSelections(updatedSelections);

    const filteredGoods = goodsArray.filter(
      (g) => !(g.mainindex === mainindex && g.groupIndex === i)
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
      (t) => !(t.mainindex === mainindex && t.groupIndex === i)
    );

    const newTailors = newMatchedItems
      .filter((item) => item[7] == true)
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

  const handleCatalogueChange = (mainindex, i, catalogue) => {
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
        measurement: {
          unit: "Centimeter (cm)",
          width: undefined,
          height: undefined,
          quantity: undefined,
        },
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }

    updatedSelections[mainindex].areacollection[i].catalogue = catalogue[0];
    setSelections(updatedSelections);
  };

  const handleCompanyChange = (
    mainindex: number,
    i: number,
    company: string
  ) => {
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
        measurement: {
          unit: "Centimeter (cm)",
          width: undefined,
          height: undefined,
          quantity: undefined,
        },
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }

    updatedSelections[mainindex].areacollection[i].company = company;
    setSelections(updatedSelections);
  };

  const handleDesignNoChange = (
    mainindex: number,
    i: number,
    designNo: string
  ) => {
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
        measurement: {
          unit: "Centimeter (cm)",
          width: undefined,
          height: undefined,
          quantity: undefined,
        },
        totalAmount: [],
        totalTax: [],
        quantities: [],
      };
    }

    updatedSelections[mainindex].areacollection[i].designNo = designNo;
    setSelections(updatedSelections);
  };

  const handleReferenceChange = (
    mainindex: number,
    i: number,
    reference: string
  ) => {
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
        measurement: {
          unit: "Centimeter (cm)",
          width: undefined,
          height: undefined,
          quantity: undefined,
        },
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

    const productGroupArray = productGroupString
      ? productGroupString.split(",")
      : [];

    const relevantPG =
      productGroupArray.length > 2 ? productGroupArray.slice(1, -2) : [];

    const matchedItems = relevantPG
      .map((pgName) => items.find((item) => item[0] === pgName))
      .filter((item) => Array.isArray(item));

    updatedSelections[mainindex].areacollection.push({
      productGroup: productGroupArray,
      company: "",
      catalogue: [],
      designNo: "",
      reference: "",
      measurement: {
        unit: "Centimeter (cm)",
        width: undefined,
        height: undefined,
        quantity: undefined,
      },
      items: matchedItems,
      additionalItems: [],
      totalAmount: [],
      totalTax: [],
    });

    setSelections(updatedSelections);

    const newGoods = matchedItems.map((item) => ({
      mainindex,
      groupIndex,
      pg: productGroupArray,
      date: "",
      status: "Pending",
      orderID: "",
      remark: "NA",
      item: item,
    }));

    const newTailors = matchedItems
      .filter((item) => item[7] == true)
      .map((item) => ({
        mainindex,
        groupIndex,
        pg: productGroupArray,
        rate: 0,
        tailorData: [""],
        status: "Pending",
        remark: "NA",
        item: item,
      }));

    setGoodsArray((prev) => [...prev, ...newGoods]);
    setTailorsArray((prev) => [...prev, ...newTailors]);
  };

  const handleGroupDelete = (mainindex: number, index: number) => {
    const updatedSelection = [...selections];
    if (updatedSelection[mainindex].areacollection[index]) {
      updatedSelection[mainindex].areacollection.splice(index, 1);
    }
    setSelections(updatedSelection);
  };

  const units = ["Inches (in)", "Centimeter (cm)", "Meters (m)", "Feet (ft)"];
  const getSubtotal = (
    rate: number,
    measurementQty: number,
    quantity: number
  ): string => {
    const subtotal = rate * measurementQty * quantity;
    return subtotal.toFixed(2);
  };

  const handleWidthChange = (
    mainindex: number,
    index: number,
    width: number
  ) => {
    const updatedSelections = [...selections];
    updatedSelections[mainindex].areacollection[index].measurement.width =
      width;
    setSelections(updatedSelections);
  };

  const handleHeightChange = (
    mainindex: number,
    index: number,
    height: number
  ) => {
    const updatedSelections = [...selections];
    updatedSelections[mainindex].areacollection[index].measurement.height =
      height;
    setSelections(updatedSelections);
  };

    const recalculateTotals = (
      updatedSelections: AreaSelection[],
      additionalItems: Additional[]
    ) => {
      const selectionTaxArray = updatedSelections.flatMap((selection) =>
        selection.areacollection.flatMap((col) => col.totalTax || [])
      );

      const selectionAmountArray = updatedSelections.flatMap((selection) =>
        selection.areacollection.flatMap((col) => col.totalAmount || [])
      );

      const additionalTaxArray = additionalItems.map(
        (item) => parseFloat(item.taxAmount.toString()) || 0
      );

      const additionalAmountArray = additionalItems.map(
        (item) => parseFloat(item.totalAmount.toString()) || 0
      );

      const totalTax = parseFloat(
        [...selectionTaxArray, ...additionalTaxArray]
          .reduce((acc, curr) => acc + curr, 0)
          .toFixed(2)
      );

      const totalAmount = parseFloat(
        [...selectionAmountArray, ...additionalAmountArray]
          .reduce((acc, curr) => acc + curr, 0)
          .toFixed(2)
      );

      return { totalTax, totalAmount };
    };

const handleQuantityChangeMain = (
  mainIndex: number,
  index: number,
  quantity: number
) => {
  const updatedSelections = [...selections];
  const areaCol = updatedSelections[mainIndex].areacollection[index];

  if (!areaCol.quantities) areaCol.quantities = [];

  areaCol.measurement.quantity = quantity;
  areaCol.quantities[0] = quantity.toString();

  // Step 1: Calculate pre-tax subtotal for this areaCol
  let preTaxTotal = 0;
  areaCol.items?.forEach((item, i) => {
    const itemQty = parseFloat(areaCol.quantities?.[i]) || 0;
    const itemRate = parseFloat(item[4]) || 0;
    preTaxTotal += quantity * itemQty * itemRate;
  });

  // Step 2: Compute effective discount percentage
  let effectiveDiscountPercent = 0;
  if (discountType === "percent") {
    effectiveDiscountPercent = discount;
  } else if (discountType === "cash" && preTaxTotal > 0) {
    effectiveDiscountPercent = (discount / preTaxTotal) * 100;
  }

  if (!areaCol.totalTax) areaCol.totalTax = [];
  if (!areaCol.totalAmount) areaCol.totalAmount = [];

  // Step 3: Apply discount and tax per item
  areaCol.items = areaCol.items?.map((item, i) => {
    const itemQty = parseFloat(areaCol.quantities?.[i]) || 0;
    const itemRate = parseFloat(item[4]) || 0;
    const itemTaxPercent = parseFloat(item[5]) || 0;

    const baseAmount = quantity * itemQty * itemRate;
    const discountAmount = (baseAmount * effectiveDiscountPercent) / 100;
    const discountedAmount = baseAmount - discountAmount;

    const taxAmount = parseFloat(((discountedAmount * itemTaxPercent) / 100).toFixed(2));
    const totalAmount = parseFloat((discountedAmount + taxAmount).toFixed(2));

    areaCol.totalTax[i] = taxAmount;
    areaCol.totalAmount[i] = totalAmount;

    return [...item.slice(0, 6), taxAmount, totalAmount];
  });

  setSelections(updatedSelections);

  // Step 4: Recalculate correct subtotal (no tax)
  const selectionSubtotals = updatedSelections.flatMap(sel =>
    sel.areacollection.flatMap(col =>
      col.items?.reduce((acc, itm, idx) => {
        const areaQty = col.measurement.quantity || 0;
        const itemQty = parseFloat(col.quantities?.[idx]) || 0;
        const itemRate = parseFloat(itm[4]) || 0;
        return acc + areaQty * itemQty * itemRate;
      }, 0) || 0
    )
  );

  const additionalSubtotals = additionalItems.map(item => item.quantity * item.rate);
  const subtotal = [...selectionSubtotals, ...additionalSubtotals].reduce((a, b) => a + b, 0);
  setAmount(parseFloat(subtotal.toFixed(2)));  // ✅ This is pure subtotal without tax

  // Step 5: Recalculate total tax and grand total
  const { totalTax, totalAmount } = recalculateTotals(updatedSelections, additionalItems);
  setTax(totalTax);
  setGrandTotal(parseFloat(totalAmount.toFixed(2)));  // ✅ Grand Total includes tax
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
  rate: number, // num1
  taxPercent: number, // num2
  itemIndex: number
) => {
  const updatedSelections = [...selections];
  const areaCol = updatedSelections[mainIndex].areacollection[collectionIndex];

  const itemQty = parseFloat(value) || 0; // New quantity from user input
  const measurementQty = parseFloat(quantity) || 0; // Measurement quantity

  // Ensure quantities array is initialized
  if (!areaCol.quantities) areaCol.quantities = [];
  areaCol.quantities[itemIndex] = itemQty.toString();

  // Ensure measurement object and quantity are valid
  if (!areaCol.measurement) areaCol.measurement = {};
  areaCol.measurement.quantity = 1;

  // Step 1: Calculate Base Cost
  const baseCost = rate * 1 * itemQty;

  // Step 2: Calculate Discount
  let effectiveDiscountPercent = 0;

  if (discountType === "percent") {
    effectiveDiscountPercent = discount;
  } else if (discountType === "cash" && baseCost > 0) {
    effectiveDiscountPercent = (discount / baseCost) * 100;
  }

  const discountAmount = (baseCost * effectiveDiscountPercent) / 100;
  const discountedCost = baseCost - discountAmount;

  // Step 3: Calculate Tax
  const taxAmount = parseFloat(((discountedCost * taxPercent) / 100).toFixed(2));
  const totalWithTax = parseFloat((discountedCost + taxAmount).toFixed(2));

  // Ensure arrays exist
  if (!areaCol.totalTax) areaCol.totalTax = [];
  if (!areaCol.totalAmount) areaCol.totalAmount = [];

  areaCol.totalTax[itemIndex] = taxAmount;
  areaCol.totalAmount[itemIndex] = totalWithTax;

  // Step 4: Update state
  setSelections(updatedSelections);

  // Step 5: Calculate subtotal (excluding tax)
  const selectionSubtotals = updatedSelections.flatMap((selection) =>
    selection.areacollection.flatMap((col) =>
      col.items?.reduce((acc, item, idx) => {
        const areaQty = parseFloat(col.measurement?.quantity || 1);
        const itemQuantity = parseFloat(col.quantities?.[idx] || "0");
        const itemRate = parseFloat(item[4]) || 0;
        return acc + 1 * itemQuantity * itemRate;
      }, 0) || 0
    )
  );

  // Additional Items subtotal
  const additionalSubtotals = additionalItems.map((itm) =>
    parseFloat(itm.quantity) * parseFloat(itm.rate)
  );

  const pureSubtotal = [...selectionSubtotals, ...additionalSubtotals].reduce((a, b) => a + b, 0);
  setAmount(parseFloat(pureSubtotal.toFixed(2))); // subtotal without tax

  // Step 6: Recalculate final tax and grand total
  const { totalTax, totalAmount } = recalculateTotals(updatedSelections, additionalItems);
  setTax(totalTax);
  setGrandTotal(parseFloat(totalAmount.toFixed(2)));
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
 const handleTaxChange = (
  mainIndex: number,
  collectionIndex: number,
  newTaxRate: number,
  rate: number,
  measurementQty: number,
  qty: number
) => {
  const updatedSelections = [...selections];
  const collection = updatedSelections[mainIndex].areacollection[collectionIndex];

  const parsedMeasurementQty = 1;
  const subtotal = rate * parsedMeasurementQty * qty;
  const taxAmount = subtotal * (newTaxRate / 100);
  const total = subtotal + taxAmount;

  // ✅ Update the item’s tax and amounts
  if (collection.items?.[0]) {
    collection.items[0][5] = newTaxRate;
  }
  collection.totalTax[0] = parseFloat(taxAmount.toFixed(2));
  collection.totalAmount[0] = parseFloat(total.toFixed(2));

  setSelections(updatedSelections);

  // ✅ Recalculate subtotal (pure base amount without tax)
  const selectionSubtotals = updatedSelections.flatMap(sel =>
    sel.areacollection.flatMap(col =>
      col.items?.reduce((acc, item, idx) => {
        const areaQty = col.measurement.quantity || 1;
        const itemQty = parseFloat(col.quantities?.[idx]) || 0;
        const itemRate = parseFloat(item[4]) || 0;
        return acc + 1 * itemQty * itemRate;
      }, 0) || 0
    )
  );

  const additionalSubtotals = additionalItems.map(itm => itm.quantity * itm.rate);
  const pureSubtotal = [...selectionSubtotals, ...additionalSubtotals].reduce((a, b) => a + b, 0);
  setAmount(parseFloat(pureSubtotal.toFixed(2)));  // ✅ Subtotal without tax

  // ✅ Recalculate totals (with tax)
  const { totalTax, totalAmount } = recalculateTotals(updatedSelections, additionalItems);
  setTax(totalTax);
  setGrandTotal(parseFloat(totalAmount.toFixed(2)));  // ✅ Total including tax
};


  // Delete item by index
const handleDeleteMiscItem = (itemIndex: number) => {
  const updated = [...additionalItems];
  updated.splice(itemIndex, 1);
  setAdditionalItems(updated);

  // Step 1: Recalculate Subtotal (pure base price, no tax)
  const selectionSubtotals = selections.flatMap(selection =>
    selection.areacollection.flatMap(col =>
      col.items?.reduce((acc, item, idx) => {
        const areaQty = col.measurement.quantity || 0;
        const itemQty = parseFloat(col.quantities?.[idx]) || 0;
        const itemRate = parseFloat(item[4]) || 0;
        return acc + 1 * itemQty * itemRate;
      }, 0) || 0
    )
  );

  const additionalSubtotals = updated.map(itm => itm.quantity * itm.rate);

  const pureSubtotal = [...selectionSubtotals, ...additionalSubtotals]
    .reduce((acc, val) => acc + val, 0);

  setAmount(parseFloat(pureSubtotal.toFixed(2)));  // ✅ Subtotal without tax

  // Step 2: Recalculate Tax and Total (including tax)
  const { totalTax, totalAmount } = recalculateTotals(selections, updated);
  setTax(totalTax);

  // Step 3: Optional: Apply Discount Amount for Display (not used in calculation here)
  let discountAmt = 0;
  if (discountType === "percent") {
    discountAmt = parseFloat(((pureSubtotal * discount) / 100).toFixed(2));
  } else if (discountType === "cash") {
    discountAmt = discount;
  }

  // Step 4: Set Grand Total (already includes discount inside recalculateTotals if you coded it there)
  setGrandTotal(parseFloat(totalAmount.toFixed(2)));
};


  const handleItemNameChange = (i: number, value: string) => {
    const updated = [...additionalItems];
    updated[i].name = value;
    setAdditionalItems(updated);
  };

const handleItemQuantityChange = (i: number, quantity: string) => {
  const updated = [...additionalItems];
  const item = updated[i];

  const parsedQuantity = parseFloat(quantity) || 0;
  item.quantity = parsedQuantity;

  // Step 1: Calculate totalBeforeDiscount using all additional items
  const totalBeforeDiscount = updated.reduce(
    (acc, itm) => acc + itm.quantity * itm.rate,
    0
  );

  // Step 2: Determine effective discount percentage
  let effectiveDiscountPercent = 0;
  if (discountType === "percent") {
    effectiveDiscountPercent = discount;
  } else if (discountType === "cash" && totalBeforeDiscount > 0) {
    effectiveDiscountPercent = (discount / totalBeforeDiscount) * 100;
  }

  // Step 3: Apply discount to this specific item
  const baseNetRate = parsedQuantity * item.rate;
  const discountAmount = (baseNetRate * effectiveDiscountPercent) / 100;
  const discountedNetRate = baseNetRate - discountAmount;

  // Step 4: Apply tax on discounted net rate
  const taxAmount = parseFloat(
    ((discountedNetRate * item.tax) / 100).toFixed(2)
  );
  const totalAmount = parseFloat((discountedNetRate + taxAmount).toFixed(2));

  item.netRate = parseFloat(discountedNetRate.toFixed(2));
  item.taxAmount = taxAmount;
  item.totalAmount = totalAmount;

  updated[i] = item;

  setAdditionalItems(updated);

  // Step 5: Calculate subtotal (Amount) — this is base price without any tax
  const selectionSubtotals = selections.flatMap(selection =>
    selection.areacollection.flatMap(col =>
      col.items?.reduce((acc, item, idx) => {
        const areaQty = col.measurement.quantity || 0;
        const itemQty = parseFloat(col.quantities?.[idx]) || 0;
        const itemRate = parseFloat(item[4]) || 0;
        return acc + 1 * itemQty * itemRate;
      }, 0) || 0
    )
  );

  const additionalSubtotals = updated.map(itm => itm.quantity * itm.rate);

  const pureSubtotal = [...selectionSubtotals, ...additionalSubtotals]
    .reduce((acc, val) => acc + val, 0);

  setAmount(parseFloat(pureSubtotal.toFixed(2)));  // ✅ Subtotal without tax

  // Step 6: Recalculate grand total and tax
  const { totalTax, totalAmount : grandSubtotal } = recalculateTotals(selections, updated);
  setTax(totalTax);
  setGrandTotal(parseFloat(grandSubtotal.toFixed(2)));  // ✅ Grand total including tax
};

  
  const [itemTax, setItemTax] = useState(0);
  const [itemTotal, setItemTotal] = useState(0);

  const recalculateItemTotals = (items: Additional[]) => {
    let totalTax = 0;
    let totalAmount = 0;

    // Calculate total before tax to determine effective cash discount if needed
    const totalBeforeDiscount = items.reduce(
      (acc, item) => acc + item.quantity * item.rate,
      0
    );

    let effectiveDiscountPercent = 0;
    if (discountType === "percent") {
      effectiveDiscountPercent = discount;
    } else if (discountType === "cash" && totalBeforeDiscount > 0) {
      effectiveDiscountPercent = (discount / totalBeforeDiscount) * 100;
    }

    const updatedItems = items.map((item) => {
      const baseNet = item.quantity * item.rate;
      const discountAmount = (baseNet * effectiveDiscountPercent) / 100;
      const discountedNet = baseNet - discountAmount;

      const taxAmt = parseFloat(((discountedNet * item.tax) / 100).toFixed(2));
      const totalAmt = parseFloat((discountedNet + taxAmt).toFixed(2));

      totalTax += taxAmt;
      totalAmount += totalAmt;

      return {
        ...item,
        netRate: parseFloat(discountedNet.toFixed(2)),
        taxAmount: taxAmt,
        totalAmount: totalAmt,
      };
    });

    setAdditionalItems(updatedItems);
    setItemTax(parseFloat(totalTax.toFixed(2)));
    setItemTotal(parseFloat(totalAmount.toFixed(2)));
  };

const handleItemRateChange = (i: number, rate: string) => {
  const updated = [...additionalItems];
  const item = updated[i];

  item.rate = parseFloat(rate) || 0;
  const baseNet = item.quantity * item.rate;

  // Step 1: Calculate total before discount (for cash discount % conversion)
  const totalBeforeDiscount = updated.reduce(
    (acc, itm) => acc + itm.quantity * itm.rate,
    0
  );

  // Step 2: Determine effective discount %
  let effectiveDiscountPercent = 0;
  if (discountType === "percent") {
    effectiveDiscountPercent = discount;
  } else if (discountType === "cash" && totalBeforeDiscount > 0) {
    effectiveDiscountPercent = (discount / totalBeforeDiscount) * 100;
  }

  // Step 3: Apply discount and compute tax
  const discountAmount = (baseNet * effectiveDiscountPercent) / 100;
  const discountedNet = baseNet - discountAmount;

  item.netRate = parseFloat(discountedNet.toFixed(2));
  item.taxAmount = parseFloat(((discountedNet * item.tax) / 100).toFixed(2));
  item.totalAmount = parseFloat((item.netRate + item.taxAmount).toFixed(2));

  updated[i] = item;

  setAdditionalItems(updated);

  // ===== Recalculate Subtotal (Without Tax) =====
  const selectionSubtotals = selections.flatMap(selection =>
    selection.areacollection.flatMap(col =>
      col.items?.reduce((acc, item, idx) => {
        const areaQty = col.measurement.quantity || 0;
        const itemQty = parseFloat(col.quantities?.[idx]) || 0;
        const itemRate = parseFloat(item[4]) || 0;
        return acc + 1 * itemQty * itemRate;
      }, 0) || 0
    )
  );

  const additionalSubtotals = updated.map(itm => itm.quantity * itm.rate);

  const subTotalOnly = [...selectionSubtotals, ...additionalSubtotals]
    .reduce((acc, val) => acc + val, 0);

  setAmount(parseFloat(subTotalOnly.toFixed(2)));  // ✅ Subtotal without tax

  const { totalTax, totalAmount } = recalculateTotals(selections, updated);
  setTax(totalTax);
  setGrandTotal(parseFloat(totalAmount.toFixed(2)));  // ✅ Grand total including tax
};

const handleItemTaxChange = (i: number, tax: string) => {
  const updated = [...additionalItems];
  const item = updated[i];

  item.tax = parseFloat(tax) || 0;
  const baseNet = item.quantity * item.rate;

  // Step 1: Calculate total before discount (for cash discount % conversion)
  const totalBeforeDiscount = updated.reduce(
    (acc, itm) => acc + itm.quantity * itm.rate,
    0
  );

  // Step 2: Determine effective discount %
  let effectiveDiscountPercent = 0;
  if (discountType === "percent") {
    effectiveDiscountPercent = discount;
  } else if (discountType === "cash" && totalBeforeDiscount > 0) {
    effectiveDiscountPercent = (discount / totalBeforeDiscount) * 100;
  }

  // Step 3: Apply discount and compute tax
  const discountAmount = (baseNet * effectiveDiscountPercent) / 100;
  const discountedNet = baseNet - discountAmount;

  item.netRate = parseFloat(discountedNet.toFixed(2));
  item.taxAmount = parseFloat(((discountedNet * item.tax) / 100).toFixed(2));
  item.totalAmount = parseFloat((item.netRate + item.taxAmount).toFixed(2));

  updated[i] = item;

  setAdditionalItems(updated);

  // ===== Recalculate Subtotal (Without Tax) =====
  const selectionSubtotals = selections.flatMap(selection =>
    selection.areacollection.flatMap(col =>
      col.items?.reduce((acc, item, idx) => {
        const areaQty = col.measurement.quantity || 0;
        const itemQty = parseFloat(col.quantities?.[idx]) || 0;
        const itemRate = parseFloat(item[4]) || 0;
        return acc + 1 * itemQty * itemRate;
      }, 0) || 0
    )
  );

  const additionalSubtotals = updated.map(itm => itm.quantity * itm.rate);

  const subTotalOnly = [...selectionSubtotals, ...additionalSubtotals]
    .reduce((acc, val) => acc + val, 0);

  setAmount(parseFloat(subTotalOnly.toFixed(2)));  // ✅ Subtotal without tax

  const { totalTax, totalAmount } = recalculateTotals(selections, updated);
  setTax(totalTax);
  setGrandTotal(parseFloat(totalAmount.toFixed(2)));  // ✅ Grand total including tax
};


  const [status, changeStatus] = useState("approved");
  const [interiorArray, setInteriorArray] = useState<any[]>([]);
  const [salesAssociateArray, setSalesAssociateArray] = useState<any[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectReference, setProjectReference] = useState("");
  const [user, setUser] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");

  const handleItemRemarkChange = (i: number, remark: string) => {
    const updated = [...additionalItems];
    updated[i].remark = remark;
    setAdditionalItems(updated);
  };

  const [selectedMainIndex, setSelectedMainIndex] = useState<number | null>(
    null
  );
  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState<
    number | null
  >(null);

const fetchProjectData = async () => {
  try {
    const response = await fetchWithLoading(
      "https://sheeladecor.netlify.app/.netlify/functions/server/getprojectdata",
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure data.body is an array; fallback to empty array if invalid
    const projectsData = Array.isArray(data.body) ? data.body : [];

    const parseSafely = (value: any, fallback: any) => {
      try {
        return typeof value === "string"
          ? JSON.parse(value)
          : value || fallback;
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

    const projects = projectsData.map((row: any[]) => ({
      projectName: row[0] || "",
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
      projectAddress: row[17] || null,
      date: row[18] || "",
      grandTotal: parseFloat(row[19]) || 0,
      discountType: row[20] || "cash",
      bankDetails: deepClone(parseSafely(row[21], [])),
      termsConditions: deepClone(parseSafely(row[22], [])),
    }));

    return projects;
  } catch (error) {
    console.error("Fetch error in fetchProjectData:", error);
    return []; // Return empty array on error to prevent breaking
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

const handleDiscountChange = (newDiscount: number, newDiscountType: string) => {
  setDiscount(newDiscount);
  setDiscountType(newDiscountType);

  const updatedSelections = [...selections];
  const updatedAdditionalItems = [...additionalItems];

  let totalBaseAmount = 0;

  // === First: Calculate total base (pre-tax, pre-discount) ===
  updatedSelections.forEach((selection) => {
    selection.areacollection.forEach((areaCol) => {
      const areaQuantity = 1;

      let areaBase = 0;
      areaCol.items?.forEach((item, i) => {
        const itemQty = parseFloat(areaCol.quantities?.[i]) || 0;
        const itemRate = parseFloat(item[4]) || 0;
        areaBase += areaQuantity * itemQty * itemRate;
      });

      areaCol._baseAmount = areaBase; // Store temporarily
      totalBaseAmount += areaBase;
    });
  });

  const additionalBase = updatedAdditionalItems.reduce(
    (acc, item) => acc + item.quantity * item.rate,
    0
  );

  totalBaseAmount += additionalBase;

  // === Calculate discount ratio ===
  const isPercent = newDiscountType === "percent";
  const discountPercent = isPercent
    ? newDiscount
    : totalBaseAmount > 0
    ? (newDiscount / totalBaseAmount) * 100
    : 0;

  const discountRatio = discountPercent / 100;

  // === Apply to Selections ===
  updatedSelections.forEach((selection) => {
    selection.areacollection.forEach((areaCol) => {
      const areaQuantity = 1;
      const areaBase = areaCol._baseAmount || 0;

      if (!areaCol.totalTax) areaCol.totalTax = [];
      if (!areaCol.totalAmount) areaCol.totalAmount = [];

      areaCol.items = areaCol.items?.map((item, i) => {
        const itemQty = parseFloat(areaCol.quantities?.[i]) || 0;
        const itemRate = parseFloat(item[4]) || 0;
        const itemTaxPercent = parseFloat(item[5]) || 0;

        const baseAmount = areaQuantity * itemQty * itemRate;

        const itemDiscount = baseAmount * discountRatio;
        const discountedAmount = baseAmount - itemDiscount;

        const taxAmount = parseFloat(((discountedAmount * itemTaxPercent) / 100).toFixed(2));
        const totalAmount = parseFloat((discountedAmount + taxAmount).toFixed(2));

        areaCol.totalTax[i] = taxAmount;
        areaCol.totalAmount[i] = totalAmount;

        return [...item.slice(0, 6), taxAmount, totalAmount];
      });
    });
  });

  // === Apply to Additional Items ===
  updatedAdditionalItems.forEach((item) => {
    const baseNet = item.quantity * item.rate;
    const itemDiscount = baseNet * discountRatio;
    const discountedNet = baseNet - itemDiscount;

    item.netRate = parseFloat(discountedNet.toFixed(2));
    item.taxAmount = parseFloat(((discountedNet * item.tax) / 100).toFixed(2));
    item.totalAmount = parseFloat((item.netRate + item.taxAmount).toFixed(2));
  });

  // === Final Totals Calculation ===
  const selectionTaxArray = updatedSelections.flatMap((selection) =>
    selection.areacollection.flatMap((col) => col.totalTax || [])
  );

  const selectionAmountArray = updatedSelections.flatMap((selection) =>
    selection.areacollection.flatMap((col) => col.totalAmount || [])
  );

  const additionalTaxArray = updatedAdditionalItems.map(
    (item) => parseFloat(item.taxAmount?.toString()) || 0
  );

  const additionalAmountArray = updatedAdditionalItems.map(
    (item) => parseFloat(item.totalAmount?.toString()) || 0
  );

  const totalTax = parseFloat(
    [...selectionTaxArray, ...additionalTaxArray].reduce((acc, val) => acc + val, 0).toFixed(2)
  );

  const totalAmount = parseFloat(
    [...selectionAmountArray, ...additionalAmountArray].reduce((acc, val) => acc + val, 0).toFixed(2)
  );

  setSelections(updatedSelections);
  setAdditionalItems(updatedAdditionalItems);
  setTax(totalTax);
  setAmount(totalBaseAmount);
  setGrandTotal(totalAmount);
  setGrandTotal(parseFloat(totalAmount.toFixed(2)));
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
        (project) =>
          project.projectName?.toLowerCase().trim() ===
          projectName?.toLowerCase().trim()
      );

      if (isDuplicate) {
        alert(`Project "${projectName}" already exists.`);
        return;
      }

      let date = new Date();
      const day = date.getDay();
      const month = date.getMonth();
      const year = date.getFullYear();

      const newdate = day + "/" + month + "/" + year;

      const finalAmount =
  typeof amount !== "undefined" && !isNaN(amount)
    ? amount
    : parseFloat(paymentData?.totalValue || "0");

const finalPaid =
  typeof paid !== "undefined" && !isNaN(paid)
    ? paid
    : parseFloat(paymentData?.paid || "0");

const finalGrandTotal =
  typeof grandTotal !== "undefined" && !isNaN(grandTotal)
    ? grandTotal
    : finalAmount;


      const response = await fetchWithLoading(
        "https://sheeladecor.netlify.app/.netlify/functions/server/sendprojectdata",
        {
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
            totalAmount: finalAmount,
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
            date: newdate,
            grandTotal,
            discountType,
            bankDetails: JSON.stringify(bank),
            termsConditions: JSON.stringify(terms),
          }),
        }
      );

      if (response.status === 200) {
        alert("Project Added");
        const updatedData = await fetchProjectData();
        dispatch(setProjects(updatedData));
        localStorage.setItem(
          "projectData",
          JSON.stringify({ data: updatedData, time: Date.now() })
        );
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
          localStorage.setItem(
            key,
            JSON.stringify({ data: freshData, time: Date.now() })
          );
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
      }
    };

    const fetchAllData = async () => {
      await Promise.all([
        fetchAndDispatch(
          fetchInteriors,
          setInteriorData,
          "interiorData",
          setInterior
        ),
        fetchAndDispatch(
          getItemsData,
          setItemData,
          "itemsData",
          setSingleItems
        ),
        fetchAndDispatch(
          fetchSalesAssociates,
          setSalesAssociateData,
          "salesAssociateData",
          setSalesData
        ),
        fetchAndDispatch(
          fetchProductGroups,
          setProducts,
          "productsData",
          setAvailableProductGroups
        ),
        fetchAndDispatch(fetchCatalogues, setCatalogs, "catalogueData"),
        fetchAndDispatch(
          fetchCustomers,
          setCustomerData,
          "customerData",
          setCustomers
        ),
      ]);
    };

    fetchAllData();
  }, [dispatch]);

useEffect(() => {
  const getAreas = async () => {
    try {
      const response = await fetchWithLoading(
        "https://sheeladecor.netlify.app/.netlify/functions/server/getAreas"
      );
      const data = await response.json();
      setAvailableAreas(data.body || []);  // Even if empty, it's fine
    } catch (error) {
      console.error("Error fetching areas:", error);
      setAvailableAreas([]);  // Optional: set empty array in case of error
    }
  };

  getAreas();
}, []);  // Only run once when component mounts


  const bankDetails = ["123213", "!23123213", "123132"];
  const termsConditions = ["sadsdsad", "Adasdad"];

const generatePDF = () => {
 const formatNumber = (value: number): string =>
  Math.round(value).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });


  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yOffset = 20;

  const primaryColor = [0, 51, 102];
  const secondaryColor = [33, 33, 33];
  const accentColor = [0, 102, 204];
  const lightGray = [245, 245, 245];

  doc.setFont("helvetica", "normal");
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setFillColor(...accentColor);
  doc.rect(0, 30, pageWidth, 1, "F");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", pageWidth / 2, 18, { align: "center" });

  yOffset += 15;

  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("SHEELA DECOR", 15, yOffset);
  doc.setFont("helvetica", "normal");
  yOffset += 5;
  doc.text("2, Shivneri Heights, Nagar-Kalyan Road, Ahmednagar - 414001", 15, yOffset);
  yOffset += 5;
  doc.text("GSTIN/UIN: 27FOPPS8740H1Z3", 15, yOffset);
  yOffset += 5;
  doc.text("Email: sheeladecor@gmail.com | Phone: 9822097512 / 7020870276", 15, yOffset);

  yOffset += 8;
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.4);
  doc.line(15, yOffset, pageWidth - 15, yOffset);
  yOffset += 8;

  // === PROJECT & CUSTOMER DETAILS ===
  const cleanAddress = typeof projectAddress === "string"
    ? projectAddress.replace(/^"(.*)"$/, '$1')
    : "N/A";

  const addressLabel = "Address: ";
  const addressContentWidth = (pageWidth - 30) / 2 - 10;
  const addressLines = doc.splitTextToSize(`${addressLabel}${cleanAddress}`, addressContentWidth);
  const firstAddressLine = addressLines[0] || `${addressLabel}N/A`;
  const remainingAddressLines = addressLines.slice(1);
  const detailBoxHeight = Math.max(25, 12 + (remainingAddressLines.length + 2) * 5);

  doc.setFillColor(...lightGray);
  doc.roundedRect(15, yOffset, pageWidth - 30, detailBoxHeight, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Project Details", 20, yOffset + 6);
  doc.text("Customer Details", pageWidth / 2 + 5, yOffset + 6);

  yOffset += 12;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);
  doc.text(`Project Name: ${projectName || "N/A"}`, 20, yOffset);
  doc.text(`Customer: ${selectedCustomer?.name || "N/A"}`, pageWidth / 2 + 5, yOffset);
  yOffset += 5;
  doc.text(`Date: ${projectDate || new Date().toLocaleDateString()}`, 20, yOffset);
  doc.text(firstAddressLine, pageWidth / 2 + 5, yOffset);
  yOffset += 5;

  remainingAddressLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2 + 5, yOffset);
    yOffset += 5;
  });

  yOffset += 5;

  const tableData: any[] = [];
  let srNo = 1;

  selections.forEach((selection) => {
    const areaName = selection.area || "Unnamed Area";

    // Always push the area name row
    tableData.push([
      {
        content: areaName,
        colSpan: 9,
        styles: {
          fontStyle: "bold",
          fontSize: 9,
          fillColor: accentColor,
          textColor: [255, 255, 255],
          halign: "left",
        },
      },
    ]);

    let addedItem = false;

    (selection.areacollection || []).forEach((collection) => {
      const pg = Array.isArray(collection.productGroup)
        ? collection.productGroup.map((name: string) => name?.trim()).filter((name) => name && name !== "undefined" && name !== "null")
        : [];

      const quantities = Array.isArray(collection.quantities) ? collection.quantities : [];
      const measurementQty = 1;
      const measurement = collection.measurement || {};

      pg.forEach((productName: string, index: number) => {
        if (index >= quantities.length || index >= (collection.items?.length || 0)) return;

        const matchedItem = collection.items?.find(
          (item: any) => item[0]?.trim().toLowerCase() === productName.toLowerCase()
        ) || collection.items?.[index] || [];

        const qty = parseFloat(quantities[index]) || 0;
        const size = (measurement.width && measurement.height)
          ? `${measurement.width} x ${measurement.height} ${measurement.unit || ""}`
          : "N/A";

        const mrp = parseFloat(matchedItem[4] || 0) * measurementQty;
        const subtotal = mrp * qty;
        const taxRate = parseFloat(matchedItem[5] || 0);
        const taxAmount = parseFloat(collection.totalTax?.[index]?.toString() || "0");
        const total = parseFloat(collection.totalAmount?.[index]?.toString() || "0");

        tableData.push([
          srNo++,
          `${productName} * ${formatNumber(measurementQty)}`,
          size,
          formatNumber(mrp),
          formatNumber(qty),
          formatNumber(subtotal),
          `${formatNumber(taxRate)}%`,
          formatNumber(taxAmount),
          formatNumber(total),
        ]);

        addedItem = true;
      });
    });

    // If no product rows added under this area, add placeholder row
    if (!addedItem) {
      tableData.push([
        {
          content: "No items available.",
          colSpan: 9,
          styles: { halign: "center", fontSize: 7 },
        },
      ]);
    }
  });

  // Add Miscellaneous Section
  if (additionalItems.length > 0) {
    tableData.push([
      {
        content: "Miscellaneous",
        colSpan: 9,
        styles: {
          fontStyle: "bold",
          fontSize: 9,
          fillColor: accentColor,
          textColor: [255, 255, 255],
          halign: "left",
        },
      },
    ]);

    additionalItems.forEach((item) => {
      const netRate = item.netRate || 0;
      const qty = item.quantity || 0;
      const taxRate = item.tax || 0;
      const taxAmount = item.taxAmount || 0;
      const total = item.totalAmount || 0;

      tableData.push([
        srNo++,
        item.name || "N/A",
        item.remark || "N/A",
        formatNumber(item.rate || 0),
        formatNumber(qty),
        formatNumber(netRate),
        `${formatNumber(taxRate)}%`,
        formatNumber(taxAmount),
        formatNumber(total),
      ]);
    });
  } else {
    tableData.push([
      {
        content: "No miscellaneous items.",
        colSpan: 9,
        styles: { halign: "center", fontSize: 7 },
      },
    ]);
  }

  autoTable(doc, {
    startY: yOffset,
    margin: { left: 16.5 },
    head: [["Sr. No.", "Item Name", "Description", "Rate", "Qty", "Net Rate", "Tax Rate", "Tax Amount", "Total"]],
    body: tableData,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 7.8,
      cellPadding: 1.5,
      textColor: secondaryColor,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7,
      halign: "center",
      cellPadding: 1.5,
    },
    alternateRowStyles: {
      fillColor: lightGray,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 35 },
      2: { cellWidth: 28 },
      3: { cellWidth: 22, halign: "center" },
      4: { cellWidth: 12, halign: "center" },
      5: { cellWidth: 22, halign: "center" },
      6: { cellWidth: 12, halign: "center" },
      7: { cellWidth: 15, halign: "center" },
      8: { cellWidth: 22, halign: "center" },
    },
    willDrawCell: (data) => {
      if (data.section === "body" && (data.column.index === 1 || data.column.index === 2)) {
        const text = data.cell.text.join(" ");
        if (text.length > 25) {
          data.cell.text = doc.splitTextToSize(text, data.cell.width - 3);
        }
      }
    },
  });

  const tableEndY = (doc as any).lastAutoTable.finalY;
  const summaryBoxHeight = 50;
  const footerHeight = 25;
  const bottomMargin = footerHeight + 10;

  yOffset = tableEndY + summaryBoxHeight + bottomMargin > pageHeight
    ? (doc.addPage(), 15)
    : tableEndY + 10;

  doc.setFillColor(...lightGray);
  doc.roundedRect(pageWidth - 90, yOffset - 5, 75, 50, 2, 2, "F");
  yOffset += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Summary", pageWidth - 85, yOffset - 8);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);

  const numericAmount = Number(amount) || 0;
  const numericTax = Number(tax) || 0;
  const numericDiscount = Number(discount) || 0;
  const summaryItems = [
    { label: "Total Amount", value: `  ${formatNumber(numericAmount)}` },
    { label: "Discount", value: `  ${formatNumber(numericDiscount)}` },
    { label: "Total Tax", value: `  ${formatNumber(numericTax)}` },
    { label: "Grand Total", value: `  ${formatNumber(numericAmount + numericTax - numericDiscount)}` },
  ];

  summaryItems.forEach((item) => {
    doc.setFont("helvetica", "bold");
    doc.text(item.label, pageWidth - 85, yOffset);
    doc.setFont("helvetica", "normal");
    doc.text(item.value, pageWidth - 20, yOffset, { align: "right" });
    yOffset += 8;
  });

  if (termsAndConditions.trim()) {
    if (yOffset + 30 > pageHeight - footerHeight - 10) {
      doc.addPage();
      yOffset = 15;
    }
    yOffset += 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Terms & Conditions", 15, yOffset);
    yOffset += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);

    const terms = doc.splitTextToSize(termsAndConditions, pageWidth - 30);
    terms.forEach((term: string) => {
      if (yOffset + 5 > pageHeight - footerHeight - 10) {
        doc.addPage();
        yOffset = 15;
      }
      doc.text(`• ${term}`, 15, yOffset);
      yOffset += 5;
    });
  }

  const footerY = pageHeight - footerHeight;
  doc.setFillColor(...accentColor);
  doc.rect(0, footerY, pageWidth, 1, "F");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for choosing Sheela Decor!", pageWidth / 2, footerY + 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("Sheela Decor - All Rights Reserved", pageWidth / 2, footerY + 17, { align: "center" });

  doc.save(`Quotation_${projectName || "Project"}_${projectDate || new Date().toLocaleDateString()}.pdf`);
};



const handleMRPChange = (
  mainIndex: number,
  collectionIndex: number,
  value: number,
  measurementQuantity: number,
  taxRate: number,
  qty: number
) => {
  const updatedSelections = [...selections];
  const measurementQty = 1;
  const newMRP = parseFloat(value.toString() || "0");

  const areaCollection = updatedSelections[mainIndex].areacollection[collectionIndex];
  areaCollection.items[0][4] = newMRP;

  // Calculate original subtotal (before discount and tax)
  const subtotal = newMRP * qty;

  // Apply discount
  let effectiveDiscountPercent = 0;
  if (discountType === "percent") {
    effectiveDiscountPercent = discount;
  } else if (discountType === "cash") {
    effectiveDiscountPercent = subtotal > 0 ? (discount / subtotal) * 100 : 0;
  }

  const discountAmount = (subtotal * effectiveDiscountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;

  const taxAmount = (discountedSubtotal * parseFloat(taxRate.toString() || "0")) / 100;
  const totalWithTax = discountedSubtotal + taxAmount;

  areaCollection.totalTax[0] = parseFloat(taxAmount.toFixed(2));
  areaCollection.totalAmount[0] = parseFloat(totalWithTax.toFixed(2));

  setSelections(updatedSelections);

  // ===== Recalculate Totals =====
  const selectionAmountArray = updatedSelections.flatMap(selection =>
    selection.areacollection.flatMap(col => {
      return col.items?.reduce((acc, item, idx) => {
        const itemQty = parseFloat(col.quantities?.[idx]) || 0;
        const itemRate = parseFloat(item[4]) || 0;
        const areaQty = 1
        return acc + areaQty * itemQty * itemRate;
      }, 0) || 0;
    })
  );

  const additionalAmountArray = additionalItems.map(item => item.quantity * item.rate);

  const subTotalOnly = [...selectionAmountArray, ...additionalAmountArray]
    .reduce((acc, val) => acc + val, 0);

  setAmount(parseFloat(subTotalOnly.toFixed(2))); // ✅ This is your subtotal (no tax)

  const { totalTax, totalAmount } = recalculateTotals(updatedSelections, additionalItems);
  setTax(totalTax);
  setGrandTotal(totalAmount);  // ✅ This is total including tax
};


// Utility function to format numbers
const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  const number = Math.round(Number(num));
  return number.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

 

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" />

return (
  <div className="flex mt-5 md:!mt-1 flex-col gap-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full font-inter">
    {/* Header Section */}
    <div className="flex flex-col gap-3">
      <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 tracking-tight">
        Add New Project
      </h1>
      <div className="flex gap-6 text-base md:text-lg">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300 !no-underline">
          Dashboard
        </Link>
        <Link to="/projects" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300 !no-underline">
          All Projects
        </Link>
      </div>
    </div>

    {/* Main Content */}
    <div className="space-y-8">
      {/* Customer Details */}
      <div className="bg-white p-8 !rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <CustomerDetails
          customers={customers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          projectData={projectData}
          setCustomers={setCustomers}
        />
      </div>

      {/* Project Details */}
      <div className="bg-white p-8 !rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <ProjectDetails
          selectedCustomer={selectedCustomer}
          interior={interior}
          setInterior={setInterior}
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
      </div>

      {/* Material Selection */}
      <div className="bg-white p-8 !rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
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
          projectData={projectData}
        />
      </div>

      {/* Measurement Section */}
      <div className="bg-white p-8 !rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
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

      {/* Miscellaneous Section */}
      <div className="mt-8 p-8 bg-white !rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl">
  <div className="flex flex-wrap justify-between items-center mb-6">
    <h2 className="text-2xl md:text-3xl font-poppins font-semibold text-gray-900 tracking-tight">
      Miscellaneous
    </h2>
    <button
      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm md:text-base font-poppins font-medium !rounded-lg hover:bg-indigo-700 transition-colors duration-300"
      onClick={handleAddMiscItem}
    >
      <FaPlus className="w-4 h-4" />
      Add Item
    </button>
  </div>
  <div className="overflow-x-auto !rounded-lg border border-gray-100">
    <table className="w-full bg-white hidden sm:table">
      <thead>
        <tr className="bg-indigo-50 text-gray-800 text-sm font-poppins font-semibold">
          <th className="py-4 px-6 text-center">SR</th>
          <th className="py-4 px-6">Item Name</th>
          <th className="py-4 px-6">Quantity</th>
          <th className="py-4 px-6">Rate</th>
          <th className="py-4 px-6">Net Rate</th>
          <th className="py-4 px-6">Tax (%)</th>
          <th className="py-4 px-6">Tax Amount</th>
          <th className="py-4 px-6">Total Amount</th>
          <th className="py-4 px-6">Remark</th>
          <th className="py-4 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {additionalItems.map((item, i) => (
          <tr key={i} className="border-b border-gray-100 hover:bg-indigo-50/50 transition-colors duration-200">
            <td className="py-4 px-6 text-center text-sm">{i + 1}</td>
            <td className="py-4 px-6">
              <input
                onChange={(e) => handleItemNameChange(i, e.target.value)}
                className="w-[140px] border border-gray-200 !rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                value={item.name || ""}
                type="text"
              />
            </td>
            <td className="py-4 px-6">
              <input
                onChange={(e) => handleItemQuantityChange(i, e.target.value)}
                className="w-full border border-gray-200 !rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                value={item.quantity || ""}
                type="number"
                min="0"
              />
            </td>
            <td className="py-4 px-6">
              <input
                onChange={(e) => handleItemRateChange(i, e.target.value)}
                className="w-[80px] border border-gray-200 !rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                value={item.rate || ""}
                type="number"
                min="0"
              />
            </td>
            <td className="py-4 px-6 text-sm text-center font-inter">
              {formatNumber(item.netRate)}
            </td>
            <td className="py-4 px-6">
              <input
                onChange={(e) => handleItemTaxChange(i, e.target.value)}
                className="w-[80px] border border-gray-200 !rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                value={item.tax || ""}
                type="number"
                min="0"
              />
            </td>
            <td className="py-4 px-6 text-sm text-center font-inter">
              {formatNumber(item.taxAmount)}
            </td>
            <td className="py-4 px-6 text-sm text-center font-inter">
              {formatNumber(item.totalAmount)}
            </td>
            <td className="py-4 px-6">
              <input
                onChange={(e) => handleItemRemarkChange(i, e.target.value)}
                className="w-[140px] border border-gray-200 !rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                value={item.remark || ""}
                type="text"
              />
            </td>
            <td className="py-4 px-6 text-center">
              <button
                onClick={() => handleDeleteMiscItem(i)}
                className="text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {/* Mobile View for Miscellaneous */}
    <div className="sm:hidden flex flex-col gap-6 mt-6">
      {additionalItems.map((item, i) => (
        <div
          key={i}
          className="bg-white p-6 !rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="font-poppins font-semibold text-sm">SR: {i + 1}</span>
            <button
              onClick={() => handleDeleteMiscItem(i)}
              className="text-red-500 hover:text-red-600 transition-colors duration-200"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Item Name
              </label>
              <input
                onChange={(e) => handleItemNameChange(i, e.target.value)}
                className="w-full border border-gray-200 !rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                value={item.name || ""}
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Quantity
              </label>
              <input
                onChange={(e) => handleItemQuantityChange(i, e.target.value)}
                className="w-full border border-gray-200 !rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                value={item.quantity || ""}
                type="number"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Rate
              </label>
              <input
                onChange={(e) => handleItemRateChange(i, e.target.value)}
                className="w-full border border-gray-200 !rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                value={item.rate || ""}
                type="number"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Net Rate
              </label>
              <span className="text-sm font-inter">
                {formatNumber(item.netRate)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Tax (%)
              </label>
              <input
                onChange={(e) => handleItemTaxChange(i, e.target.value)}
                className="w-full border border-gray-200 !rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                value={item.tax || ""}
                type="number"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                      Tax Amount
                    </label>
              <span className="text-sm font-inter">
                {formatNumber(item.taxAmount)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Total Amount
              </label>
              <span className="text-sm font-inter">
                {formatNumber(item.totalAmount)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins">
                Remark
              </label>
              <input
                onChange={(e) => handleItemRemarkChange(i, e.target.value)}
                className="w-full border border Rate-gray-200 !rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
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

      {/* Quotation Section */}
     <div className="bg-white p-8 !rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
  <h2 className="text-2xl md:text-3xl font-poppins font-semibold text-gray-900 mb-6 tracking-tight pl-0">
    Quotation
  </h2>
  <div className="overflow-x-auto !rounded-lg border border-gray-100">
    <table className="w-full bg-white min-w-[800px]">
      <thead>
        <tr className="bg-indigo-50 text-gray-800 text-sm font-poppins font-semibold">
          <th className="py-4 px-6 text-center">SR</th>
          <th className="py-4 px-6">Area</th>
          <th className="py-4 px-6">Product Name</th>
          <th className="py-4 px-6">Size</th>
          <th className="py-4 px-6">MRP</th>
          <th className="py-4 px-6">Quantity</th>
          <th className="py-4 px-6">Subtotal</th>
          <th className="py-4 px-6">Tax Rate(%)</th>
          <th className="py-4 px-6">Tax Amount</th>
          <th className="py-4 px-6">Total</th>
        </tr>
      </thead>
      <tbody>
        {selections.flatMap((selection, mainIndex) =>
          selection.areacollection?.map(
            (collection, collectionIndex) => {
              const item = collection.items?.[0];
              const qty = collection.quantities?.[0] || 0;
              if (!item) return null;

              const calculatedMRP = item[4];
              const subtotal = parseFloat(item[4]) * parseFloat(collection.measurement.quantity || "0") * parseFloat(qty || "0");
              const taxAmount = collection.totalTax?.[0] || 0;
              const totalAmount = collection.totalAmount?.[0] || 0;

              return (
                <tr
                  key={`${mainIndex}-${collectionIndex}`}
                  className="border-b border-gray-100 hover:bg-indigo-50/50 transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-center text-sm font-inter">
                    {collectionIndex + 1}
                  </td>
                  <td className="py-4 px-6 text-sm font-inter">
                    {selection.area}
                  </td>
                  <td className="py-4 px-6 text-sm font-inter">
                    {collection.productGroup?.[0] || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-sm font-inter">
                    {collection.measurement.width &&
                    collection.measurement.height
                      ? `${collection.measurement.width} x ${
                          collection.measurement.height
                        } ${collection.measurement.unit || ""}`
                      : "N/A"}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <input
  type="number"
  className="w-[140px] border border-gray-200 !rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
  value={calculatedMRP === 0 ? "" : calculatedMRP}
  onChange={(e) => {
    let inputValue = e.target.value;

    // Remove leading zeros if more than one digit and not a decimal
    if (inputValue.length > 1 && inputValue[0] === "0" && inputValue[1] !== ".") {
      inputValue = inputValue.replace(/^0+/, "");
    }

    const parsedValue = parseFloat(inputValue || "0");

    handleMRPChange(
      mainIndex,
      collectionIndex,
      parsedValue,
      collection.measurement.quantity,
      item[5],
      qty
    );
  }}
/>
                  </td>
                  <td className="py-4 px-2 text-sm">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-full border border-gray-200 !rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                      value={qty}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Optional: Prevent leading zero issues
                        if (value.length > 1 && value[0] === "0" && value[1] !== ".") {
                          value = value.replace(/^0+/, "");
                        }

                        const parsedQty = parseFloat(value) || 0;

                        handleQuantityChange(
                          `${mainIndex}-${collectionIndex}`,
                          parsedQty,
                          mainIndex,
                          collectionIndex,
                          parseFloat(collection.measurement?.quantity || "0"),
                          parseFloat(item[4]),
                          parseFloat(item[5]),
                          0
                        );
                      }}
                    />
                  </td>
                  <td className="py-4 px-6 text-sm font-inter">
                    {formatNumber(subtotal)}
                  </td>
                  <td className="py-4 px-2 text-sm">
                    <input
                      type="number"
                      className="w-full border border-gray-200 !rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                      value={item[5]}
                      onChange={(e) =>
                        handleTaxChange(
                          mainIndex,
                          collectionIndex,
                          parseFloat(e.target.value),
                          item[4],
                          collection.measurement.quantity,
                          qty
                        )
                      }
                    />
                  </td>
                  <td className="py-4 px-6 text-sm font-inter">
                    {formatNumber(taxAmount)}
                  </td>
                  <td className="py-4 px-6 text-sm font-inter">
                    {formatNumber(totalAmount)}
                  </td>
                </tr>
              );
            }
          )
        )}
      </tbody>
    </table>
  </div>
</div>

      {/* Summary and Bank Details */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Bank Details and Terms */}
        <div className="bg-white p-8 !rounded-2xl shadow-lg border border-gray-100 w-full md:w-1/2 transition-all duration-300 hover:shadow-xl">
          <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-6 tracking-tight">
            Bank Details & Terms
          </h3>
          <div className="space-y-6">
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value.split(","))}
              className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
            >
              <option value="">Select Bank Details</option>
              {Array.isArray(bankData) && bankData.length > 0 ? (
                bankData.map((data, index) => (
                  <option key={index} value={data} className="overflow-y-scroll">
                    Account Name: { data?.[0] || "NA" } - Bank: { data?.[1] || "NA" } - Account Number: {data?.[4] || "N/A"} 
                  </option>
                ))
              ) : (
                <option disabled>No bank accounts available</option>
              )}

            </select>
            <textarea
              placeholder="Bank Details Description"
              value={`Bank: ${ bank[1] == "NA" ? "" : bank[1] }\nAccount Name: ${bank[0] == "NA" ? "" : bank[0]}\nAccount Number: ${bank[4] == "NA" ? "" : bank[4]}\nIFSC code: ${bank[5] == "NA" ? "" : bank[5]}\n Branch: ${bank[2] == "NA" ? "" : bank[2]} \n Pincode: ${bank[3] == "NA" ? "" : bank[3]}`}
              className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
              rows={5}
            ></textarea>
            <select
              value={terms}
              onChange={(e) => setTerms(e.target.value.split(","))}
              className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
            >
              <option value="">Select Terms & Conditions</option>
{Array.isArray(termData) && termData.length > 0 ? (
  termData.map((data, index) => (
    <option key={index} value={data}>
      {data?.[0] || "N/A"}
    </option>
  ))
) : (
  <option disabled>No terms available</option>
)}

            </select>
            <textarea
              placeholder="Terms & Conditions Description"
              className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
              rows={4}
              value={`Terms & Conditions: ${terms == "NA" ? "" : terms[0]}`}
            ></textarea>
          </div>
        </div>

  {/* Summary */}
  <div className="bg-white p-8 !rounded-2xl shadow-lg border border-gray-100 w-full md:w-1/2 transition-all duration-300 hover:shadow-xl">
    <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-6 tracking-tight">
      Summary
    </h3>
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 font-poppins font-medium">Sub Total</span>
        <span className="font-medium font-inter">{formatNumber(amount)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 font-poppins font-medium">Total Tax Amount</span>
        <span className="font-medium font-inter">{formatNumber(tax)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 font-poppins font-medium">Total Amount</span>
        <span className="font-medium font-inter">{formatNumber(grandTotal)}</span>
      </div>
      <hr className="border-gray-200" />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700 font-poppins font-medium">Discount</span>
        <div className="flex items-center gap-3">
          <select
            onChange={(e) => {
              handleDiscountChange(discount, e.target.value);
            }}
            className="border border-gray-200 !rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
          >
            <option value="cash">₹</option>
            <option value="percent">%</option>
          </select>
          <input
            className="w-20 md:w-28 border border-gray-200 !rounded-lg px-4 py-2 text-sm text-right focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
            value={discount}
            onChange={(e) => {
              handleDiscountChange(e.target.value, discountType);
            }}
            type="number"
            min="0"
          />
        </div>
      </div>
      <hr className="border-gray-200" />
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 font-poppins font-semibold">Grand Total</span>
        <span className="font-poppins font-bold text-indigo-600 text-lg">
          {formatNumber(grandTotal)}
        </span>
      </div>
      <div className="flex gap-3 flex-col">
        <button
          onClick={sendProjectData}
          className="w-full bg-indigo-600 text-white py-3 !rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm font-poppins font-semibold"
        >
          Add Project & Generate Quote
        </button>
        <button
          onClick={generatePDF}
          className="w-full bg-emerald-600 text-white py-3 !rounded-lg hover:bg-emerald-700 transition-colors duration-300 text-sm font-poppins font-semibold"
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
