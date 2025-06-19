import React from "react";

interface InquiryCardProps {
  project: string;
  comments: string;
  inquiryDate: string;
  followUpDate: string;
  status: string;
  onStatusChange: (status: string) => void;
  onCardClick: () => void;
}

const statusColors: Record<string, string> = {
  "New Inquiry": "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  "Convert to Project": "bg-green-100 text-green-800",
  "Not Interested": "bg-red-100 text-red-800",
};

const InquiryCard: React.FC<InquiryCardProps> = ({
  project,
  comments,
  inquiryDate,
  followUpDate,
  status,
  onStatusChange,
  onCardClick,
}) => {
  // Format dates for better readability
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden cursor-pointer"
      onClick={onCardClick}
    >
      <div className="p-5 space-y-4">
        {/* Header with status badge */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {project}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Comments with fade effect for long text */}
        <div className="relative">
          <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
            {comments}
          </p>
          {comments.length > 150 && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        {/* Date information */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inquiry Date
            </p>
            <p className="text-gray-700">{formatDate(inquiryDate)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Follow-up
            </p>
            <p
              className={`text-gray-700 ${
                new Date(followUpDate) < new Date()
                  ? "text-red-500 font-medium"
                  : ""
              }`}
            >
              {formatDate(followUpDate)}
            </p>
          </div>
        </div>

        {/* Status dropdown */}
        <div className="pt-2" onClick={(e) => e.stopPropagation()}>
          <label
            htmlFor={`status-select-${project}`}
            className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
          >
            Update Status
          </label>
          <select
            id={`status-select-${project}`}
            value={status}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(e.target.value);
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-all"
          >
            <option value="New Inquiry">New Inquiry</option>
            <option value="In Progress">In Progress</option>
            <option value="Convert to Project">Convert to Project</option>
            <option value="Not Interested">Not Interested</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InquiryCard;
