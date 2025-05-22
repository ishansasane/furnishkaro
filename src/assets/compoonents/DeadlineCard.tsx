interface DeadlineCardProps {
    project: string;
    date: string;
  }
  
  const DeadlineCard: React.FC<DeadlineCardProps> = ({ project, date }) => {
    return (
      <div className="bg-blue-50 shadow-md rounded-lg p-4 border-l-4 border-blue-500 transition-transform transform hover:scale-105">
        <div className="w-full flex flex-row justify-between flex-wrap items-center">
          <p className=" text-gray-600">Project Name :</p>
          <p className=" font-semibold text-gray-800">{project}</p>
        </div>
        <div className="w-full flex flex-row justify-between flex-wrap items-center">
          <p className=" text-gray-600">Project Date :</p>
          <p className="">{date}</p>
        </div>
      </div>
    );
  };
  
  export default DeadlineCard;
  