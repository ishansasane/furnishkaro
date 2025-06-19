import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState  } from 'react';
import { RootState } from '../Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects, setPaymentData } from '../Redux/dataSlice';

const DuePage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const projects = useSelector(( state : RootState ) => state.data.projects);
    const paymentData = useSelector(( state : RootState ) => state.data.paymentData);

    const [projectData, setprojects] = useState([]);

    const [projectPayments, setProjectPayments] = useState([]);

    const [added, setAdded] = useState(false);

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

  const fetchPaymentData = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments");
    const data = await response.json();
    return data.message;
  };

useEffect(() => {
  const now = Date.now();
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes

  const loadProjectAndPaymentData = async () => {
    try {
      // === Handle Project Data ===
      let finalProjects = [];

      if (projects && projects.length > 0) {
        finalProjects = projects;
        setprojects(projects);
      } else {
        const cachedProjects = localStorage.getItem("projectData");

        if (cachedProjects) {
          const parsed = JSON.parse(cachedProjects);
          const isCacheValid = parsed?.data?.length > 0 && (now - parsed.time) < cacheExpiry;

          if (isCacheValid) {
            finalProjects = parsed.data;
            dispatch(setProjects(parsed.data));
            setprojects(parsed.data);
          }
        }

        if (finalProjects.length === 0) {
          const freshProjects = await fetchProjectData();
          if (Array.isArray(freshProjects)) {
            finalProjects = freshProjects;
            dispatch(setProjects(freshProjects));
            setprojects(freshProjects);
            localStorage.setItem("projectData", JSON.stringify({ data: freshProjects, time: now }));
          } else {
            console.warn("Fetched project data is not an array:", freshProjects);
          }
        }
      }

      // === Handle Payment Data ===
      let finalPayments = [];

      if (paymentData && paymentData.length > 0) {
        finalPayments = paymentData;
      } else {
        finalPayments = await fetchPaymentData();
        dispatch(setPaymentData(finalPayments));
      }

      // === Calculate Project-wise Payments and Combined Array ===
      if (finalPayments.length > 0 && finalProjects.length > 0) {
        const combinedArray = finalProjects.map((project) => {
          const totalAmount = parseFloat(project.totalAmount + project.totalTax);
          const discount = parseFloat(project.discount);
          const grandTotal = totalAmount - discount;

          const paymentsForProject = finalPayments.filter(payment => payment[1] === project.projectName);
          const totalPaid = paymentsForProject.reduce((sum, payment) => {
            const amount = parseFloat(payment[2]);
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);

          const balance = grandTotal - totalPaid;

          return [
            project.customerLink,
            project.projectName,
            grandTotal,
            totalPaid,
            balance
          ];
        });

        setProjectPayments(combinedArray); // reuse state or create a new one like setCombinedData
      }

      setAdded(true);
    } catch (error) {
      console.error("Failed to load project/payment data:", error);
    }
  };

    loadProjectAndPaymentData();

}, [dispatch, added, paymentData, projects]);



  return (
    <div className='flex flex-col justify-between items-center w-90vw'>
        <div className='flex flex-col w-[80vw] p-3 border rounded-xl'>
            <div className='flex flex-row w-full justify-between'>
                <p className='text-[1.6vw] font-semibold'>Due Payments</p>
                <button onClick={() => navigate("/")} style={{ borderRadius : "6px" }} className='border px-2 h-10 text-white bg-sky-600 hover:bg-sky-700'>Dashboard</button>
            </div>
            <div className='flex flex-col w-full'>
              <table className='w-full mt-10'>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Project</th>
                    <th>Project Value</th>
                    <th>Paid Amount</th>
                    <th>Due Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    projectPayments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment[0][0] || ""}</td>
                        <td>{payment[1]}</td>
                        <td>₹{payment[2].toLocaleString("en-IN")}</td>
                        <td>₹{payment[3].toLocaleString("en-IN")}</td>
                        <td className='py-2'>₹{payment[4].toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

            </div>
        </div>
    </div>
  )
}

export default DuePage
