import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom'
import { setProjects } from '../Redux/dataSlice';
import { RootState } from '../Redux/store';

const InteriorPage = ({ interiorData, setInteriorOpen }) => {

    const dispatch = useDispatch();

    const projects = useSelector(( state : RootState ) => state.data.projects);

    const [interiorProjects, setInteriorProjects] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);

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
      projectAddress: row[17],
      date: row[18],
    }));

    return projects;
  };

 useEffect(() => {
  const fetchProjects = async () => {
    try {
      const cached = localStorage.getItem("projectData");
      const now = Date.now();
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes

      let finalData = [];

      if (cached) {
        const parsed = JSON.parse(cached);
        const isCacheValid = parsed?.data?.length > 0 && (now - parsed.time) < cacheExpiry;

        if (isCacheValid) {
          finalData = parsed.data;
          dispatch(setProjects(finalData));
        }
      }

      // If no valid cache or cache was skipped
      if (finalData.length === 0) {
        const freshData = await fetchProjectData();
        if (Array.isArray(freshData)) {
          finalData = freshData;
          dispatch(setProjects(finalData));
          localStorage.setItem("projectData", JSON.stringify({ data: freshData, time: now }));
        } else {
          console.warn("Fetched project data is not an array:", freshData);
        }
      }

      // Filter projects after getting the final data
      if (finalData.length > 0 && interiorData?.[0]) {
        const filtered = finalData.filter(
          (project) => project?.interiorArray?.[0] === interiorData[0]
        );
        setTotalProjects(filtered.length);
        setInteriorProjects(filtered);
      }

    } catch (error) {
      console.error("Failed to fetch projects:", error);

      // Optional fallback to stale cache if fetch fails
      const fallbackCache = localStorage.getItem("projectData");
      if (fallbackCache) {
        const parsed = JSON.parse(fallbackCache);
        if (parsed?.data?.length > 0) {
          dispatch(setProjects(parsed.data));
          if (interiorData?.[0]) {
            const filtered = parsed.data.filter(
              (project) => project?.interiorArray?.[0] === interiorData[0]
            );
            setInteriorProjects(filtered);
          }
        }
      }
    }
  };

  fetchProjects();
}, [dispatch, interiorData, setInteriorProjects]);


  return (
    <div className='flex flex-col gap-5 justify-center w-full p-3'>
        <div className='w-full flex flex-row justify-between items-center'>
            <div className='flex flex-col'>
                <p className='text-[1.8vw]'>{interiorData[0]}</p>
                <div className='flex flex-row gap-2'>
                    <p onClick={() => setInteriorOpen(false)}>Interiors</p> • <p>{interiorData[0]}</p>
                </div>
            </div>
            <button style={{ borderRadius : "6px" }} onClick={() => setInteriorOpen(false)} className='px-2 py-1 bg-sky-600 text-white hover:bg-sky-700'>Cancel</button>
        </div>
        <div className='flex flex-col gap-2 border rounded-xl w-[40vw] p-3'>
            <p className='text-[1.3vw]'>Interior Details</p>
            <div className='flex flex-row justify-between text-[1.2vw]'>
                <p className='text-gray-500'>Name</p>
                <p>{interiorData[0]}</p>
            </div>
            <div className='flex flex-row justify-between text-[1.2vw]'>
                <p className='text-gray-500'>Email</p>
                <p>{interiorData[1]}</p>
            </div>
            <div className='flex flex-row justify-between text-[1.2vw]'>
                <p className='text-gray-500'>Phone no.</p>
                <p>{interiorData[2]}</p>
            </div>
            <div className='flex flex-row justify-between text-[1.2vw]'>
                <p className='text-gray-500'>Address</p>
                <p>{interiorData[3]}</p>
            </div>
            <div className='flex flex-row justify-between text-[1.2vw]'>
                <p className='text-gray-500'>Total Projects</p>
                <p>{totalProjects}</p>
            </div>
        </div>
        <div className='w-full flex flex-col p-2 border rounded-xl'>
        <table className="table-auto w-full">
        <thead>
            <tr className="bg-gray-100">
            <th className=" border-gray-300 px-4 py-2">Sr.No</th>
            <th className=" border-gray-300 px-4 py-2">Project Name</th>
            <th className=" border-gray-300 px-4 py-2">Project Amount</th>
            <th className=" border-gray-300 px-4 py-2">Project Date</th>
            </tr>
        </thead>
        <tbody>
            {interiorProjects.length > 0 ? (
            interiorProjects.map((data, index) => (
                <tr key={index} className="hover:bg-sky-50">
                <td className=" border-gray-300 px-4 py-2">{index + 1}</td>
                <td className=" border-gray-300 px-4 py-2">{data.projectName}</td>
                <td className=" border-gray-300 px-4 py-2">{data.totalAmount}</td>
                <td className="border-gray-300 px-4 py-2">{data.projectDate}</td>
                </tr>
            ))
            ) : (
            <tr>
                <td colSpan="4" className="text-center px-4 py-2">No projects found</td>
            </tr>
            )}
        </tbody>
        </table>

        </div>
    </div>
  )
}

export default InteriorPage
