<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" />

import React, { useState, useEffect } from "react";
import CustomerDetails from "./CustomerDetails";
import ProjectDetails from "./ProjectDetails";
import { fetchWithLoading } from "../Redux/fetchWithLoading";

function AddSitePage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [projectData, setProjectData] = useState({});
  const [interior, setInterior] = useState("");
  const [interiorArray, setInteriorArray] = useState([]);
  const [salesAssociateArray, setSalesAssociateArray] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectReference, setProjectReference] = useState("");
  const [user, setUser] = useState(null);
  const [projectDate, setProjectDate] = useState("");
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [paymentData, setPaymentData] = useState({
    totalValue: "",
    paid: "",
    due: 0,
  });

  // Fetch dropdown data on first load
  useEffect(() => {
    async function fetchInitialData() {
      try {
        // Fetch Customers
        const customerResponse = await fetchWithLoading(
          "https://sheeladecor.netlify.app/.netlify/functions/server/getcustomerdata",
          { credentials: "include" }
        );
        const customerJson = await customerResponse.json();
        if (Array.isArray(customerJson.body)) {
          setCustomers(customerJson.body);
        }

        // Fetch Interiors
        const interiorResponse = await fetchWithLoading(
          "https://sheeladecor.netlify.app/.netlify/functions/server/getinteriordata",
          { credentials: "include" }
        );
        const interiorJson = await interiorResponse.json();
        if (Array.isArray(interiorJson.body)) {
          setInterior(interiorJson.body);
        }

        // Fetch Sales Associates
        const salesResponse = await fetchWithLoading(
          "https://sheeladecor.netlify.app/.netlify/functions/server/getsalesassociatedata",
          { credentials: "include" }
        );
        const salesJson = await salesResponse.json();
        if (Array.isArray(salesJson.body)) {
          setSalesData(salesJson.body);
        }
      } catch (error) {
        console.error("❌ Error fetching initial dropdown data:", error);
      }
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    const total = parseFloat(paymentData.totalValue) || 0;
    const paid = parseFloat(paymentData.paid) || 0;
    const due = total - paid;

    setPaymentData((prev) => ({
      ...prev,
      due: due > 0 ? due : 0,
    }));
  }, [paymentData.totalValue, paymentData.paid]);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProjectAndPayment = async () => {
    try {
      const amount = parseFloat(paymentData.totalValue || "0");
      const paidAmount = parseFloat(paymentData.paid || "0");

      const projectPayload = {
        projectName,
        customerLink: JSON.stringify(selectedCustomer),
        projectReference,
        status: "Active",
        totalAmount: amount,
        totalTax: 0,
        paid: paidAmount,
        discount: 0,
        createdBy: user,
        allData: JSON.stringify({}),
        projectDate,
        additionalRequests,
        interiorArray: JSON.stringify(interiorArray),
        salesAssociateArray: JSON.stringify(salesAssociateArray),
        additionalItems: JSON.stringify([]),
        goodsArray: JSON.stringify([]),
        tailorsArray: JSON.stringify([]),
        projectAddress: JSON.stringify(projectAddress),
        date: new Date().toISOString(),
        grandTotal: amount,
        discountType: "",
        bankDetails: JSON.stringify({}),
        termsConditions: JSON.stringify([]),
      };

      const projectResponse = await fetchWithLoading(
        "https://sheeladecor.netlify.app/.netlify/functions/server/sendprojectdata",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(projectPayload),
        }
      );

      if (projectResponse.ok) {
        alert("✅ Project saved successfully");

        const customerName = selectedCustomer?.Name || "NA";
        const project = projectName || "NA";
        const received = paidAmount || 0;
        const receivedDate = projectDate || new Date().toISOString().split("T")[0];
        const paymentMode = "Site Booking";
        const remarks = "Auto Created from Add Site Page";

        const paymentPayload = {
          customerName,
          Name: project,
          Received: received,
          ReceivedDate: receivedDate,
          PaymentMode: paymentMode,
          Remarks: remarks,
        };

        console.log("➡️ Sending Payment Payload:", paymentPayload);

        const paymentResponse = await fetchWithLoading(
          "https://sheeladecor.netlify.app/.netlify/functions/server/addPayment",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(paymentPayload),
          }
        );

        if (paymentResponse.ok) {
          alert("✅ Payment Created Successfully");
        } else {
          const errorText = await paymentResponse.text();
          alert("❌ Payment creation failed: " + errorText);
        }
      } else {
        alert("❌ Project creation failed");
      }
    } catch (error) {
      console.error("Error during project and payment creation:", error);
      alert("❌ Error while saving project or payment.");
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full font-inter">
      {/* Header Section */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 tracking-tight">
          Add New Site
        </h1>
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

        {/* Payment Section */}
        <div className="bg-white p-8 !rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <h3 className="text-2xl md:text-3xl font-poppins font-semibold text-gray-900 mb-6 tracking-tight">
            Payment Information
          </h3>
          <div className="overflow-x-auto !rounded-lg border border-gray-100">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-indigo-50 text-gray-800 text-sm font-poppins font-semibold">
                  <th className="py-4 px-6 text-left">Total Value</th>
                  <th className="py-4 px-6 text-left">Received</th>
                  <th className="py-4 px-6 text-left">Due</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-indigo-50/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <input
                      type="number"
                      name="totalValue"
                      value={paymentData.totalValue}
                      onChange={handlePaymentChange}
                      className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter bg-gray-50"
                      placeholder="Enter total amount"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <input
                      type="number"
                      name="paid"
                      value={paymentData.paid}
                      onChange={handlePaymentChange}
                      className="w-full border border-gray-200 !rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter bg-gray-50"
                      placeholder="Enter received amount"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className={`text-sm font-inter ${paymentData.due > 0 ? "text-red-500" : "text-green-500"}`}>
                      ₹{paymentData.due.toFixed(2)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 flex justify-end">
            <div className="bg-gray-50 p-6 !rounded-lg w-full md:w-80 border border-gray-100">
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-gray-700 font-poppins font-medium">Total:</span>
                <span className="font-inter">₹{parseFloat(paymentData.totalValue || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-gray-700 font-poppins font-medium">Paid:</span>
                <span className="font-inter">₹{parseFloat(paymentData.paid || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-700 font-poppins">Balance Due:</span>
                <span className={`font-poppins ${paymentData.due > 0 ? "text-red-500" : "text-green-500"}`}>
                  ₹{paymentData.due.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveProjectAndPayment}
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-poppins font-semibold !rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Save Project & Create Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSitePage;