import React, { useEffect, useState } from 'react'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { setPaymentData, setProjects } from '../Redux/dataSlice'
import { useNavigate } from 'react-router-dom'

const Payments = () => {

    const fetchPaymentData = async () => {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments"); 
        const data = await response.json();
        return data.message;
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [editPayments, setEditPayments] = useState(undefined);

    const paymentsData = useSelector((state : RootState) => state.data.paymentData);
    const projects = useSelector(( state : RootState ) => state.data.projects)
    const [payment, setPayment] = useState(0);
    const [paymentDate, setPaymentDate] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [paymentRemarks, setPaymentRemarks] = useState("");

    const [addPayment , setAddPayment] = useState(false);

    const [customer, setCustomer] = useState("");
    const [project, setProject] = useState("");

    const [deleted, setDeleted] = useState(true);

    const [filteredPayments, setFilteredPayments] = useState([]);

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

useEffect(() => {
  let isMounted = true;
  const now = Date.now();
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes

  const fetchData = async () => {
    try {
      // === Fetch Project Data First ===
      let finalProjects = [];

      if (projects && projects.length > 0) {
        finalProjects = projects;
      } else {
        const cachedProjects = localStorage.getItem("projectData");
        if (cachedProjects) {
          const parsed = JSON.parse(cachedProjects);
          const isValid = parsed?.data?.length > 0 && (now - parsed.time) < cacheExpiry;
          if (isValid) {
            finalProjects = parsed.data;
            dispatch(setProjects(parsed.data));
          }
        }

        if (finalProjects.length === 0) {
          const freshProjects = await fetchProjectData();
          if (Array.isArray(freshProjects)) {
            finalProjects = freshProjects;
            dispatch(setProjects(freshProjects));
            localStorage.setItem("projectData", JSON.stringify({ data: freshProjects, time: now }));
          }
        }
      }

      // === Fetch Payment Data Next ===
      let finalPayments = [];

      const cachedPayments = localStorage.getItem("paymentData");
      if (cachedPayments) {
        const parsed = JSON.parse(cachedPayments);
        const isValid = parsed?.data?.length > 0 && (now - parsed.time) < cacheExpiry;
        if (isValid) {
          finalPayments = parsed.data;
          dispatch(setPaymentData(parsed.data));
        }
      }

      if (finalPayments.length === 0) {
        const freshPayments = await fetchPaymentData();
        if (Array.isArray(freshPayments)) {
          finalPayments = freshPayments;
          dispatch(setPaymentData(freshPayments));
          localStorage.setItem("paymentData", JSON.stringify({ data: freshPayments, time: now }));
        }
      }

      // === Filter Payments That Belong to Any Project ===
      if (finalProjects.length > 0 && finalPayments.length > 0 && isMounted) {
        const projectNames = finalProjects.map(p => p.projectName);
        const filtered = finalPayments.filter(payment => projectNames.includes(payment[1]));
        setFilteredPayments(filtered);
      }

    } catch (error) {
      console.error("❌ Error fetching project or payment data:", error);
    }
  };

  fetchData();

  return () => {
    isMounted = false;
  };
}, [dispatch, deleted]);


const deletePayment = async (name, projectname, p, pd, pm, re) => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletePayment", {
    credentials : "include",
    method : "POST",
    headers : {
        
      "content-type" : "application/json",
    },
    body : JSON.stringify({ customerName : name, Name : projectname, Received : p, ReceivedDate : pd, PaymentMode : pm, Remarks : re })
  });

  if(response.status == 200){
    alert("Deleted");
    if(deleted){
        setDeleted(false);
    }else{
        setDeleted(true);
    }
  }else{
    alert("Error");
  }
}

const addPaymentFunction = async () => {
  const isEdit = typeof editPayments !== "undefined";

  const url = isEdit
    ? "https://sheeladecor.netlify.app/.netlify/functions/server/updateProjects"
    : "https://sheeladecor.netlify.app/.netlify/functions/server/addPayment";

  const payload = isEdit
    ? {
        customerName: customer,
        Name: project,
        Received: payment,
        ReceivedDate: paymentDate,
        PaymentMode: paymentMode,
        Remarks: paymentRemarks, // send this if backend needs it
      }
    : {
        customerName: customer,
        Name: project,
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
      if(deleted){
        setDeleted(false);
      }else{
        setDeleted(true);
      }
    } else {
      alert("Error");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Network or server error");
  }
  setEditPayments(undefined);
};

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

  return (
    <div className='w-full p-6 flex flex-col justify-between items-center'>
        <div className="w-full justify-between flex flex-row">
            <p className='text-[1.6vw] font-semibold'>Payments</p>
            <button onClick={() => navigate("/")} style={{ borderRadius : "6px"}} className='border rounded-lg text-white bg-sky-600 hover:bg-sky-700 px-2 h-10'>Dashboard</button>
        </div>
<div className='w-full justify-between flex flex-col rounded-xl border p-3 mt-10 max-h-screen overflow-scroll'>
    <table className='w-full'>
        <tbody>
            <tr className='text-[1.2vw] font-semibold'>
                <th className=''>Sr. No.</th>
                <th>Amount</th>
                <th>Project</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        </tbody>
        <tbody>
            {filteredPayments.length != 0 && filteredPayments.map((payment, index) => (
                <tr className='hover:bg-sky-50' key={index}>
                    <td>{index + 1}</td>
                    <td>{payment[2]}</td>
                    <td>{payment[1]}</td>
                    <td>{payment[4]}</td>
                    <td>{payment[3] || '-'}</td> {/* Optional Date */}
                    <td className='py-3 flex flex-row gap-3'>
                        {/* Example action: Delete button */}
                        <button onClick={() => deletePayment(payment[0], payment[1], payment[2], payment[3], payment[4], payment[5])} className="text-red-500 hover:underline"><FaTrash /></button>
                        <button onClick={() => { setProject(payment[1]); setCustomer(payment[0]); setAddPayment(true); }} className="text-sky-700 hover:underline"><FaEdit /></button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
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
    </div>
  )
}

export default Payments
