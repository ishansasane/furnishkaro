import React, { useState } from "react";
import {
  FiTrash2,
  FiEdit2,
  FiChevronDown,
  FiAlertTriangle,
} from "react-icons/fi";

interface InquiryCardProps {
  project: string;
  comments: string;
  inquiryDate: string;
  followUpDate: string;
  status: string;
  onStatusChange: (status: string) => void;
  onCardClick: () => void;
  onDelete: () => void;
}

const statusColors: Record<string, string> = {
  "New Inquiry": "bg-blue-100 text-blue-800 border border-blue-200",
  "In Progress": "bg-yellow-100 text-yellow-800 border border-yellow-200",
  "Convert to Project": "bg-green-100 text-green-800 border border-green-200",
  "Not Interested": "bg-red-100 text-red-800 border border-red-200",
};

const InquiryCard: React.FC<InquiryCardProps> = ({
  project,
  comments,
  inquiryDate,
  followUpDate,
  status,
  onStatusChange,
  onCardClick,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === "Not Interested") {
      setShowDeleteConfirm(true);
    } else {
      onStatusChange(newStatus);
    }
  };

  const handleDeleteConfirm = (shouldDelete: boolean) => {
    setShowDeleteConfirm(false);
    if (shouldDelete) {
      onDelete();
    } else {
      // Revert to previous status if user cancels
      const select = document.getElementById(
        `status-select-${project}`
      ) as HTMLSelectElement;
      if (select) select.value = status;
    }
  };

  return (
    <div
      className="relative w-full bg-white rounded-xl shadow-xs hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group"
      onClick={onCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "320px", // Fixed width
        height: "280px", // Fixed height
      }}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-white to-indigo-50 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`}
      ></div>

      {/* Card content */}
      <div className="p-5 h-full flex flex-col">
        {/* Header with project name and status */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {project}
            </h3>
            {isHovered && (
              <button
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick();
                }}
              >
                <FiEdit2 size={16} />
              </button>
            )}
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[status] || "bg-gray-100 text-gray-800"
            } transition-colors duration-200`}
          >
            {status}
          </span>
        </div>

        {/* Comments with fade effect */}
        <div className="relative flex-grow mb-3 overflow-hidden">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 h-full">
            {comments}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Date information */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inquiry Date
            </p>
            <p className="text-gray-700 font-medium text-sm">
              {formatDate(inquiryDate)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Follow-up
            </p>
            <div className="flex items-center">
              <p
                className={`text-gray-700 font-medium text-sm ${
                  new Date(followUpDate) < new Date() ? "text-red-500" : ""
                }`}
              >
                {formatDate(followUpDate)}
              </p>
              {new Date(followUpDate) < new Date() && (
                <FiAlertTriangle className="ml-1 text-red-500" size={14} />
              )}
            </div>
          </div>
        </div>

        {/* Status dropdown */}
        <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <select
              id={`status-select-${project}`}
              value={status}
              onChange={handleStatusChange}
              className="appearance-none block w-full pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="New Inquiry">New Inquiry</option>
              <option value="In Progress">In Progress</option>
              <option value="Convert to Project">Convert to Project</option>
              <option value="Not Interested">Not Interested</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <FiChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <FiAlertTriangle size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Inquiry?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You've marked this inquiry as "Not Interested". Would you
                    like to delete it permanently?
                  </p>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    onClick={() => handleDeleteConfirm(true)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    onClick={() => handleDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryCard;
