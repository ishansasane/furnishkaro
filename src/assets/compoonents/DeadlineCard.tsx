import React from "react";
import { useDispatch } from "react-redux";
import { setProjects } from "../Redux/dataSlice";

interface DeadlineCardProps {
  projectName: string;
  project: any; // Ideally, define a proper type instead of any
  date: string;
  setSendProject: (project: any) => void;
  setIndex: (index: number) => void;
  index: number;
  setTax: (tax: number) => void;
  setAmount: (amount: number) => void;
  setProjectDiscount: (discount: number) => void;
  setFlag: (flag: boolean) => void;
  clickFunction : any;
}

// Optional ErrorBoundary component for single card error safety
class CardErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Error inside DeadlineCard:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-2 text-sm text-red-500">Error rendering this card.</div>;
    }
    return this.props.children;
  }
}

const DeadlineCard: React.FC<DeadlineCardProps> = ({
  projectName,
  project,
  date,
  setSendProject,
  setIndex,
  index,
  setTax,
  setAmount,
  setProjectDiscount,
  setFlag,
  clickFunction
}) => {
  // Safely format date
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // Background gradient
  const nameHash = projectName
    ?.split("")
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const bgGradient = `linear-gradient(135deg, 
    hsl(${nameHash % 360}, 80%, 85%) 0%, 
    hsl(${(nameHash + 30) % 360}, 80%, 85%) 100%)`;

  const goodsArray = project?.goodsArray ?? [];

  const dispatch = useDispatch();

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
      grandTotal: row[19],
      discountType: row[20],
      bankDetails: deepClone(parseSafely(row[21], [])),
      termsConditions: deepClone(parseSafely(row[22], [])),
    }));

    return projects;
  };

  const markAsCompleted = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updateprojectdata", {
      method : "POST",
      headers : {
        "content-type" : "application/json",
      },
      body : JSON.stringify({ projectName, status : "Completed" })
    });
    if(response.ok){
      const updatedData = await fetchProjectData();
      dispatch(setProjects(updatedData));
      localStorage.setItem(
        "projectData",
        JSON.stringify({ data: updatedData, time: Date.now() })
      );
      alert("Project marked as completed");
    }else{
      alert("Error");
    }
  }

  return (
    <CardErrorBoundary>
      <div className={`bg-white h-[20vh] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border overflow-y-scroll scrollbar-hide border-gray-100 ${project.status == "Completed" ? "hidden" : "" }`}>
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: bgGradient }}></div>

        <div className="p-2">
          {/* Header */}
          <div onClick={() => clickFunction()} className="flex justify-between items-center">
            <div>
              <p className="text-[1.3vw] font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
                {projectName}
              </p>
              <div className="flex flex-row gap-2">
                <svg
                  className="w-4 h-4 mt-1 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-[1vw] text-gray-500">{formattedDate}</p>
              </div>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-500"></span>
              Active
            </span>
          </div>

          {/* Items Section */}
          <div onClick={() => clickFunction()} className="flex flex-row justify-between">
              <div className="flex flex-col">
                <div className="flex gap-2 flex-row">
                <p className="text-[1vw] font-medium text-gray-500 uppercase">
                  Items :
                </p>
                <span className="text-[1vw] text-gray-400 bg-gray-100 rounded-full">
                  {goodsArray.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {goodsArray.slice(0, 3).map((arr: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200"
                  >
                    {arr?.item?.[0] || "Item"}
                  </span>
                ))}

                {goodsArray.length > 3 && (
                  <span className=" inline-flex items-center px-2 rounded-full text-[0.7vw] font-medium bg-gray-50 text-gray-500">
                    +{goodsArray.length - 3}
                  </span>
                )}
              </div>
              </div>
          <div className=" border-t border-gray-100 space-x-2">

            <button onClick={markAsCompleted} style={{ borderRadius : "6px" }} className="px-2 py-1 text-[0.9vw] text-white rounded-md bg-blue-500 hover:bg-blue-600">
              Mark as Completed
            </button>
          </div>
          </div>

          {/* Action Buttons */}

        </div>
      </div>
    </CardErrorBoundary>
  );
};

export default DeadlineCard;
