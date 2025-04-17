import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import OverviewPage from './OverviewPage';
import { setSalesAssociateData, setInteriorData, setCustomerData, setProducts, setCatalogs, setProjects, setItemData, setProjectFlag } from "../Redux/dataSlice";
import CustomerDetails from "./CustomerDetails";
import ProjectDetails from "./ProjectDetails";
import EditCustomerDetails from "./Edit/EditCustomerDetails";
import EditProjectDetails from "./Edit/EditProjectDetails";
import MaterialSelectionComponent from "./MaterialSelectionComponent";
import MeasurementSection from "./MeasurementSections";

const EditProjects = ({ projectData, index, goBack, tasks }) => {

    const [currentStatus, setCurrentStatus] = useState("Unsent");
    const [navState, setNavState] = useState("Overview");

    const dispatch = useDispatch();
    const customerData = useSelector((state : RootState) => state.data.customers);
    const interiorData = useSelector((state : RootState) => state.data.interiors);
    const salesAssociateData = useSelector((state : RootState) => state.data.salesAssociates);
    const products = useSelector((state : RootState) => state.data.products);
    const items = useSelector((state : RootState) => state.data.items);

    const catalogueData = useSelector((state : RootState) => state.data.catalogs);
    let availableCompanies = ["D Decor", "Asian Paints", "ZAMAN"];
    const designNo = [ "514", "98", "123" ];

    
    const [ customers, setcustomers ] = useState<[]>([]);
    const [ selectedCustomer, setSelectedCustomer ] = useState(null);
    
    const [singleitems, setsingleitems] = useState([]);
    
    const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
    
    const [ interior, setinterior ] = useState([]);
    const [ salesdata, setsalesdata ] = useState([]);
    const [availableProductGroups, setAvailableProductGroups] = useState([]);

    const [additionalItems, setAdditionaItems] = useState([]);

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
        setSelections(projectData.allData);
      }, [projectData])

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
  console.log(updatedSelections[mainindex].areacollection[i].productGroup);
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
            tasks={tasks}
            />
            <div className="flex flex-row justify-between mt-3">
                <button onClick={() => setNavState("Overview")} style={{ borderRadius : "8px" }} className="rounded-lg border px-2 h-8 bg-white">Back</button>
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
        </div>
        
      </div>
    );
  };
  

export default EditProjects