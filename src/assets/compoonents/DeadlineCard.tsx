import { useEffect } from "react";

  
  const DeadlineCard = ({ projectName, project, date, setSendProject, setIndex, index, setTax, setAmount, setProjectDiscount, setFlag }) => {

    return (
      <div  className="bg-blue-50 shadow-md rounded-lg p-4 border-l-4 border-blue-500 transition-transform transform hover:scale-105">
        <div className="w-full flex flex-row justify-between flex-wrap items-center">
          <p className=" text-gray-600">Project Name :</p>
          <p className=" font-semibold text-gray-800">{projectName}</p>
        </div>
        <div className="w-full flex flex-row justify-between flex-wrap items-center">
          <p className=" text-gray-600">Project Date :</p>
          <p className="">{date}</p>
        </div>
        <div className="w-full flex flex-row justify-between gap-2">
          <p className="text-gray-600">Items:</p>
          <div className="flex flex-row w-full flex-wrap gap-2">
            {project.goodsArray.map((arr, index) => (
              <p key={index}>{arr.item?.[0]},</p>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default DeadlineCard;
  