import React from "react";

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

  return (
    <CardErrorBoundary>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: bgGradient }}></div>

        <div className="p-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-base font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
                {projectName}
              </h3>
              <div className="flex items-center mt-0.5 space-x-1">
                <svg
                  className="w-3 h-3 text-gray-400"
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
                <p className="text-xs text-gray-500">{formattedDate}</p>
              </div>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-500"></span>
              Active
            </span>
          </div>

          {/* Items Section */}
          <div className="mt-2">
            <div className="flex items-center mb-1">
              <h4 className="text-xs font-medium text-gray-500 uppercase">
                Items
              </h4>
              <span className="ml-1 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
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
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500">
                  +{goodsArray.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end space-x-2">
            <button
              className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-200 flex items-center"
              onClick={() => {
                setSendProject(project);
                setIndex(index);
                setTax(project?.tax ?? 0);
                setAmount(project?.amount ?? 0);
                setProjectDiscount(project?.projectDiscount ?? 0);
                setFlag(true);
              }}
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Details
            </button>

            <button className="px-3 py-1 text-xs font-medium text-white rounded-md bg-blue-500 hover:bg-blue-600 flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
    </CardErrorBoundary>
  );
};

export default DeadlineCard;
