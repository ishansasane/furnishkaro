/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerData } from "../Redux/dataSlice";
import { RootState } from "../Redux/store";
import CustomerDetails from "../compoonents/CustomerDetails";
import ProjectDetails from "../compoonents/ProjectDetails";
import MaterialSelection from "../compoonents/MaterialSelection";
import MeasurementSection from "../compoonents/MeasurementSection";
import QuotationSection from "../compoonents/QuotationSection";

const FormPage = () => {
  const dispatch = useDispatch();
  const customerData = useSelector((state: RootState) => state.data.customers);
  
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customers, setCustomers] = useState<{ name: string; mobile: string; address: string }[]>([]);
  const [materials, setMaterials] = useState<{ area: string; productGroups: string[] }[]>([]);
  const [measurements, setMeasurements] = useState<{ area: string; size: string }[]>([]);
  const [quotation, setQuotation] = useState<any[]>([]);
  const [editing, setEditing] = useState(null);

  // Validation checks
  const isCustomerSelected = !!selectedCustomer;
  const isProjectDetailsFilled = true; // Replace with actual validation logic
  const isMaterialSelected = materials.length > 0;
  const isMeasurementAdded = measurements.length > 0;

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

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCustomers();
      dispatch(setCustomerData(data));
      setCustomers(data);
    };
    
    if (customerData.length === 0) {
      fetchData();
    } else {
      setCustomers(customerData);
    }
  }, [dispatch]);

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Project Form</h1>

      {/* Customer Details */}
      <CustomerDetails
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        customers={customers}
        setCustomers={setCustomers}
        editing={editing}
        setEditing={setEditing}
      />

      {/* Show Project Details only if Customer is selected */}
      {isCustomerSelected && <ProjectDetails />}

      {/* Show Material Selection only if Project Details are filled */}
      {isCustomerSelected && isProjectDetailsFilled && (
        <MaterialSelection setMaterials={setMaterials} />
      )}

      {/* Show Measurement Section only if Materials are selected */}
      {isCustomerSelected && isProjectDetailsFilled && isMaterialSelected && (
        <MeasurementSection setMeasurements={setMeasurements} />
      )}

      {/* Show Quotation Section only if Measurements are added */}
      {isCustomerSelected && isProjectDetailsFilled && isMaterialSelected && isMeasurementAdded && (
        <QuotationSection materials={materials} measurements={measurements} />
      )}
    </div>
  );
};

export default FormPage;