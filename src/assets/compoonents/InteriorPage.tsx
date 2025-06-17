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

                if (finalData.length > 0 && interiorData?.[0]) {
                    const filtered = finalData.filter(
                        (project) => project?.interiorArray?.[0] === interiorData[0]
                    );
                    setTotalProjects(filtered.length);
                    setInteriorProjects(filtered);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
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
        <div className="flex flex-col gap-4 w-full p-4 sm:p-6 md:p-8">
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-col">
                    <p className="text-lg sm:text-xl md:text-2xl font-semibold">{interiorData[0]}</p>
                    <div className="flex flex-row gap-2 text-sm sm:text-base">
                        <p 
                            onClick={() => setInteriorOpen(false)} 
                            className="cursor-pointer hover:text-sky-600"
                        >
                            Interiors
                        </p> 
                        <span>•</span> 
                        <p>{interiorData[0]}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setInteriorOpen(false)} 
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors w-full sm:w-auto"
                >
                    Cancel
                </button>
            </div>

            <div className="flex flex-col gap-3 border rounded-xl p-4 w-full sm:w-11/12 md:w-3/4 lg:w-1/2">
                <p className="text-base sm:text-lg md:text-xl font-medium">Interior Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                    <p className="text-gray-500">Name</p>
                    <p>{interiorData[0]}</p>
                    <p className="text-gray-500">Email</p>
                    <p>{interiorData[1]}</p>
                    <p className="text-gray-500">Phone no.</p>
                    <p>{interiorData[2]}</p>
                    <p className="text-gray-500">Address</p>
                    <p>{interiorData[3]}</p>
                    <p className="text-gray-500">Total Projects</p>
                    <p>{totalProjects}</p>
                </div>
            </div>

            <div className="w-full flex flex-col p-4 border rounded-xl overflow-x-auto">
                <table className="table-auto w-full min-w-[600px] sm:min-w-0">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-gray-300 px-4 py-2 text-left text-sm sm:text-base">Sr.No</th>
                            <th className="border-gray-300 px-4 py-2 text-left text-sm sm:text-base">Project Name</th>
                            <th className="border-gray-300 px-4 py-2 text-left text-sm sm:text-base">Project Amount</th>
                            <th className="border-gray-300 px-4 py-2 text-left text-sm sm:text-base">Project Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interiorProjects.length > 0 ? (
                            interiorProjects.map((data, index) => (
                                <tr key={index} className="hover:bg-sky-50">
                                    <td className="border-gray-300 px-4 py-2 text-sm sm:text-base">{index + 1}</td>
                                    <td className="border-gray-300 px-4 py-2 text-sm sm:text-base">{data.projectName}</td>
                                    <td className="border-gray-300 px-4 py-2 text-sm sm:text-base">{data.totalAmount}</td>
                                    <td className="border-gray-300 px-4 py-2 text-sm sm:text-base">{data.projectDate}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center px-4 py-2 text-sm sm:text-base">No projects found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default InteriorPage