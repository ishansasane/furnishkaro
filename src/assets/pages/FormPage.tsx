import { useState } from "react";
import CustomerDetails from "../compoonents/CustomerDetails";
import ProjectDetails from "../compoonents/ProjectDetails";
import MaterialSelection from "../compoonents/MaterialSelection";
import MeasurementSection from "../compoonents/MeasurementSection";
import QuotationSection from "../compoonents/QuotationSection";


const FormPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customers, setCustomers] = useState<{ name: string; mobile: string; address: string }[]>([]);
  const [materials] = useState<{ area: string; productGroups: string[] }[]>([]);
  const [measurements] = useState<{ area: string; size: string }[]>([]);
  const [quotation, setQuotation] = useState<any[]>([]);

  // Validation checks
  const isCustomerSelected = !!selectedCustomer;
  const isProjectDetailsFilled = true; // Replace with actual validation from ProjectDetails if needed
  const isMaterialSelected = materials.length > 0;
  const isMeasurementAdded = measurements.length > 0;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Project Form</h1>

      {/* Customer Details */}
      <CustomerDetails
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        customers={customers}
        setCustomers={setCustomers}
      />

      {/* Show Project Details only if Customer is selected */}
      {isCustomerSelected && <ProjectDetails />}

      {/* Show Material Selection only if Project Details are filled */}
      {isCustomerSelected && isProjectDetailsFilled && (
        <MaterialSelection/>
      )}

      {/* Show Measurement Section only if Materials are selected */}
      {isCustomerSelected && isProjectDetailsFilled && isMaterialSelected && (
        <MeasurementSection/>
      )}

      {/* Show Quotation Section only if Measurements are added */}
      {isCustomerSelected && isProjectDetailsFilled && isMaterialSelected && isMeasurementAdded && (
        <QuotationSection quotation={quotation} setQuotation={setQuotation} materials={materials} measurements={measurements} />
      )}
    </div>
  );
};

export default FormPage;
