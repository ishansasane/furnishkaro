import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { setCustomerData, setPaymentData, setProjects } from "../Redux/dataSlice";
import { Link } from 'react-router-dom';

async function fetchCustomers() {
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
}

  const fetchPaymentData = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments");
    const data = await response.json();
    return data.message;
  };

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
      date: row[18],
      grandTotal : row[19],
      discountType : row[20]
    }));

    return projects;
  };

const CustomerDashboard = ({ customerDashboardData, setCustomerDashboardData, setCustomerDashboard }) => {

    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [alternateNumber, setAlternateNumber] = useState("");
    const [address, setAddress] = useState("");

    const [totalProjectValue, setTotalProjectPayment] = useState(0);

    const [projectData, setProjectData] = useState([])

    const [duePayment, setDuePayment] = useState(0);
    const [receivedPayment, setReceivedPayment] = useState(0);
    const [activeOrders, setActiveOrders] = useState(0);
    const [receivedProjectsPayment , setReceivedProjectsPayment] = useState(0);
    const [perProjectPayment, setPerProjectPayments] = useState([]);

    const dispatch = useDispatch();

    const paymentData = useSelector((state : RootState) => state.data.paymentData);
    const projects = useSelector((state : RootState) => state.data.projects);

    const [companyName, setCompanyName] = useState("");
    const [GST, setGST] = useState("");

    const [payments, setPaymentsArray] = useState([]);

    useEffect(() => {
        setEmail(customerDashboardData[2]);
        setCustomerName(customerDashboardData[0]);
        setPhoneNumber(customerDashboardData[1]);
        setAlternateNumber(customerDashboardData[4]);
        setAddress(customerDashboardData[3]);
    }, [])

useEffect(() => {
  const fetchAndCalculate = async () => {
    const now = Date.now();

    // ---------- Fetch Project Data ----------
    let projectList = [];
    const cachedProjects = localStorage.getItem("projectData");

    if (cachedProjects) {
      const parsed = JSON.parse(cachedProjects);
      const timeDiff = now - parsed.time;

      if (timeDiff < 5 * 60 * 1000 && parsed.data.length > 0) {
        projectList = parsed.data;
        dispatch(setProjects(parsed.data));
      } else {
        try {
          const data = await fetchProjectData();
          projectList = data;
          dispatch(setProjects(data));
          localStorage.setItem("projectData", JSON.stringify({ data, time: now }));
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        }
      }
    } else {
      try {
        const data = await fetchProjectData();
        projectList = data;
        dispatch(setProjects(data));
        localStorage.setItem("projectData", JSON.stringify({ data, time: now }));
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }

    // ---------- Filter & Calculate Project Stats ----------
    let filteredProjects = [];
    if (customerDashboardData[0]) {
      filteredProjects = projectList.filter(
        (p) => p.customerLink[0] === customerDashboardData[0]
      );
      setProjectData(filteredProjects);
      setActiveOrders(filteredProjects.length);

      let totalAmount = 0;
      let totalTax = 0;
      filteredProjects.forEach((p) => {
        totalTax += parseFloat(p.totalTax) || 0;
        totalAmount += parseFloat(p.totalAmount) || 0;
      });

      setDuePayment(totalAmount); // totalTax is optional based on your logic
    }

    // ---------- Fetch Payment Data ----------
    let paymentList = [];
    const cachedPayments = localStorage.getItem("paymentData");

    if (cachedPayments) {
      const parsed = JSON.parse(cachedPayments);
      const timeDiff = now - parsed.time;

      if (timeDiff < 5 * 60 * 1000 && parsed.data.length > 0) {
        paymentList = parsed.data;
        dispatch(setPaymentData(parsed.data));
      } else {
        try {
          const data = await fetchPaymentData();
          paymentList = data;
          dispatch(setPaymentData(data));
          localStorage.setItem("paymentData", JSON.stringify({ data, time: now }));
        } catch (error) {
          console.error("Failed to fetch payments:", error);
        }
      }
    } else {
      try {
        const data = await fetchPaymentData();
        paymentList = data;
        dispatch(setPaymentData(data));
        localStorage.setItem("paymentData", JSON.stringify({ data, time: now }));
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    }

    // ---------- Calculate Total & Per-Project Received Payments ----------
    if (customerDashboardData[0] && filteredProjects.length) {
      let totalReceived = 0;
      const projectPayments = filteredProjects.map((project) => {
        const projectTotal = paymentList
          .filter(
            (payment) =>
              payment[1] === project.projectName &&
              payment[0] === customerDashboardData[0]
          )
          .reduce((sum, payment) => {
            const amount = parseFloat(payment[2]);
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);

        totalReceived += projectTotal;
        return projectTotal;
      });

      setReceivedPayment(totalReceived);
      setReceivedProjectsPayment(totalReceived);
      setPerProjectPayments(projectPayments); // If you're using this in your component
    }
  };

  fetchAndCalculate();
}, [dispatch, customerDashboardData]);




      async function sendcustomerData() {
        let date = undefined;
        const now = new Date();
        date = now.toISOString().slice(0, 16);
    
        const api = "https://sheeladecor.netlify.app/.netlify/functions/server/updatecustomerdata"
    
        const response = await fetch(api, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            name : customerName,
            phonenumber : phoneNumber,
            email : email,
            address : address,
            alternatenumber: alternateNumber,
            addedDate: date,
            companyName,
            GST
          })
        });
    
        if (response.status === 200) {
          const data = await fetchCustomers();
    
          // 1. Update Redux store
          dispatch(setCustomerData(data));
        
          // 3. Update localStorage cache
          localStorage.setItem("customerData", JSON.stringify({ data, time: Date.now() }));
        
          // 5. Show success
          alert( "Customer Updated Successfully");
        } else {
          alert("Error in updating customer");
        }
      }

  return (
    <div className='flex flex-col gap-3 w-full p-6'>

        <div className='flex flex-row w-full justify-between items-center'>
            <div className='flex flex-col gap-1'>
                <p className='text-[1.6vw] font-semibold'>{customerName}</p>
                <div className='text-[0.8vw] flex flex-row gap-2'><Link to="/" className='!no-underline text-black'>Dashboard</Link>  •  <Link to="/customers" onClick={() => setCustomerDashboard(false)} className='!no-underline text-black'>Customers</Link>  •  {customerName}</div>
            </div>
            <button style={{ "borderRadius" : "6px" }} className='text-white px-2 py-1 bg-sky-600 hover:bg-sky-700' onClick={() => setCustomerDashboard(false)}>Cancel</button>
        </div>
        <div className='flex flex-row w-full justify-between gap-3'>
            <div className='flex flex-col border rounded-xl p-3 w-1/3'>
                <p className='text-[1.2vw] text-sky-700'>Active Orders</p>
                <p className='text-[1.1vw]'>{activeOrders}</p>
            </div>
            <div className='flex flex-col border rounded-xl p-3 w-1/3'>
                <p className='text-[1.2vw] text-purple-600'>Total Value of Projects</p>
                <p className='text-[1.1vw]'>₹{Math.round(duePayment).toLocaleString("en-IN")}</p>
            </div>
            <div className='flex flex-col border rounded-xl p-3 w-1/3'>
                <p className='text-[1.2vw] text-green-600'>Payment Received</p>
                <p className='text-[1.1vw]'>₹{Math.round(receivedProjectsPayment).toLocaleString("en-IN")}</p>
            </div>
            <div className='flex flex-col border rounded-xl p-3 w-1/3'>
                <p className='text-[1.2vw] text-red-500'>Payment Due</p>
                <p className='text-[1.1vw]'>₹{Math.round(duePayment - receivedProjectsPayment).toLocaleString("en-IN")}</p>
            </div>
        </div>
        <div className='flex flex-col w-full border rounded-xl p-3'>
            <table>
            <thead>
                <tr className='text-gray-600'>
                <th>Project Name</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Received</th>
                <th>Due</th>
                <th>Date</th>
                <th>Quote</th>
                </tr>
            </thead>
            <tbody>
                {projectData && projectData.map((project, index) => (
                <tr key={index} className=''>
                    <td>{project.projectName}</td>
                    <td>{project.status}</td>
                    <td>₹{Math.round(project.totalAmount).toLocaleString("en-IN")}</td>
                    <td>₹{perProjectPayment != null && Math.round(perProjectPayment[index]).toLocaleString("en-IN")}</td>
                    <td>₹{Math.round(duePayment - perProjectPayment[index]).toLocaleString("en-IN")}</td>
                    <td className='py-2'>{project.projectDate}</td>
                    <td className='py-2'>{project.quote}</td>
                </tr>
                ))}
            </tbody>
            </table>

        </div>
        <div className='flex flex-col w-2/3 border rounded-xl p-3 gap-3'>
            <p className='text-[1.3vw] font-semibold'>Customer Details</p>
            <div className='flex flex-row w-full justify-between gap-2'>
                <div className='flex flex-col w-1/2'>
                    <div className='flex flex-row gap-1 -mb-3'>
                        <p className='text-[0.9vw] text-gray-600'>Customer</p><p className='text-red-600'>*</p>
                    </div>
                    <input type="text" className='border rounded-lg px-2 py-2 w-full' value={customerName}/>
                </div>
                <div className='flex flex-col w-1/2'>
                    <div className='flex flex-row gap-1 -mb-2'>
                        <p className='text-[0.9vw] text-gray-600'>Email</p>
                    </div>
                    <input type="text" onChange={(e) => setEmail(e.target.value)} className='border rounded-lg px-2 py-2 w-full' value={email}/>
                </div>
            </div>
            <div className='flex flex-row w-full justify-between gap-2'>
                <div className='flex flex-col w-1/2'>
                    <div className='flex flex-row gap-1 -mb-3 mt-1'>
                        <p className='text-[0.9vw] text-gray-600'>Phone Number</p>
                    </div>
                    <input type="text" onChange={(e) => setPhoneNumber(e.target.value)} className='border rounded-lg px-2 py-2 w-full' value={phoneNumber}/>
                </div>
                <div className='flex flex-col w-1/2'>
                    <div className='flex flex-row gap-1 -mb-2'>
                        <p className='text-[0.9vw] text-gray-600'>Alternate Phone Number</p>
                    </div>
                    <input type="text" onChange={(e) => setAlternateNumber(e.target.value)} className='border rounded-lg px-2 py-2 w-full' value={alternateNumber}/>
                </div>
            </div>
            <div className='flex flex-col w-full'>
                <p className='text-[0.9vw] text-gray-600'>Address</p>
                <input type="text" onChange={(e) => setAddress(e.target.value)} className='border rounded-lg px-2 py-2' value={address}/>
            </div>
            <div className='flex flex-row w-full justify-between gap-2'>
              <div className='flex flex-col w-full'>
                  <p className='text-[0.9vw] text-gray-600'>Company Name</p>
                  <input type="text" placeholder='Company Name' onChange={(e) => setCompanyName(e.target.value)} className='border rounded-lg px-2 py-2' value={companyName}/>
              </div>
              <div className='flex flex-col w-full'>
                  <p className='text-[0.9vw] text-gray-600'>GST IN</p>
                  <input type="text" placeholder='GST Number' onChange={(e) => setGST(e.target.value)} className='border rounded-lg px-2 py-2' value={GST}/>
              </div>
            </div>
            <div className='w-full flex flex-row justify-end'>
                <button onClick={sendcustomerData} style={{ borderRadius : "6px" }} className='text-white bg-sky-600 hover:bg-sky-700 px-2 py-1 w-[6vw]'>Update</button>
            </div>
        </div>
    </div>
  )
}

export default CustomerDashboard;