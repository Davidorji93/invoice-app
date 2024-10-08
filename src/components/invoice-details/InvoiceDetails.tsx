import React, { useEffect, useState } from 'react';
import Reminders from '../reminders/Reminders';
import axios from 'axios';
import HashLoader from 'react-spinners/HashLoader'; // Import HashLoader

interface Invoice {
  id: string;
  dueDate: string;
  amount: string;
  status: string;
}

interface InvoiceDetailsProps {
  isOpen: boolean;
  invoice: Invoice;
  onClose: () => void;
}

interface Activity {
  avatar: string;
  name: string;
  time: string;
  description: string;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ isOpen, invoice, onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch activities from db.json via axios
        const activityResponse = await axios.get<Activity[]>(
          "http://localhost:5000/activities"
        );
        setActivities(activityResponse.data);
      } catch (error) {
        setError("Failed to load data");
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!isOpen) return null;

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDropdownOptionClick = (option: string) => {
    console.log(option);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Loader */}
          <HashLoader color="#003EFF" size={80} /> 
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 h-auto max-w-6xl p-4 md:p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex flex-col">
                <h2 className="text-lg md:text-2xl font-semibold">Invoice - {invoice.id}</h2>
                <p className="text-sm md:text-base font-normal leading-snug text-left mb-3 md:mb-5">
                  View the details and activity of this invoice
                </p>
                {/* Move the button here */}
                <button className="bg-[#F2FBFF] text-[#003EFF] px-4 py-2 md:px-6 md:py-3 rounded-[40px] mt-3 md:mt-5">
                  PARTIAL PAYMENT
                </button>
              </div>
              <div className="flex space-x-2 md:space-x-4">
                <button className="text-[#003EFF] bg-[#fff] border border-[#E3E6EF] px-4 py-2 md:px-6 md:py-3 rounded-[40px] hover:bg-[#003EFF] hover:text-white">
                  DOWNLOAD AS PDF
                </button>
                <button className="bg-[#003EFF] text-white px-4 py-2 md:px-6 md:py-3 rounded-[40px]">
                  SEND INVOICE
                </button>

                {/* Dropdown button */}
                <div className="relative inline-block text-left">
                  <button
                    onClick={toggleDropdown}
                    className="text-[#003EFF] bg-[#fff] border border-[#E3E6EF] px-4 py-2 md:px-6 md:py-3 rounded-[40px] hover:bg-[#003EFF] hover:text-white"
                  >
                    MORE
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 z-10 mt-2 shadow-lg bg-white w-40 md:w-[262px] h-auto rounded-[24px] ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <a
                          href="#"
                          onClick={() => handleDropdownOptionClick('Duplicate Invoice')}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#003EFF] hover:text-white"
                        >
                          DUPLICATE INVOICE
                        </a>
                        <a
                          href="#"
                          onClick={() => handleDropdownOptionClick('Get Shareable Link')}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#003EFF] hover:text-white"
                        >
                          GET SHAREABLE LINK
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                  &times;
                </button>
              </div>
            </div>

            {/* Reminders */}
            <Reminders />

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="col-span-1 md:col-span-2">
                <div className="bg-[#FCDDEC] p-4 md:p-6 rounded-[40px] w-[686] h-[290px]">
                  <p className="text-sm md:text-base"><strong>Due Date:</strong> {invoice.dueDate}</p>
                  <p className="text-sm md:text-base"><strong>Amount:</strong> ${invoice.amount}</p>
                  <p className="text-sm md:text-base"><strong>Status:</strong> {invoice.status}</p>
                </div>

                <div className="bg-white p-4 md:p-6 mt-4 rounded-[24px] w-full h-auto md:h-[200px] border">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-2 py-2 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                            Item
                          </th>
                          <th className="px-2 py-2 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                            Qty
                          </th>
                          <th className="px-2 py-2 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                            Price
                          </th>
                          <th className="px-2 py-2 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example row */}
                        <tr>
                          <td className="px-2 py-2 md:px-4 md:py-2">Email Marketing</td>
                          <td className="px-2 py-2 md:px-4 md:py-2">10</td>
                          <td className="px-2 py-2 md:px-4 md:py-2">$1,500</td>
                          <td className="px-2 py-2 md:px-4 md:py-2">$15,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mt-4">
                    <p className="text-sm md:text-lg font-semibold">Total: $6,529,770.00</p>
                  </div>
                </div>

              </div>

              {/* Recent Activities */}
              <div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Recent Activities
                    </h2>
                    <button className="text-[#003EFF] bg-[#fff] border border-[#E3E6EF] border-solid px-6 py-3 rounded-[40px] hover:bg-[#003EFF] hover:text-white">
                      VIEW ALL
                    </button>
                  </div>

                  <ul className="space-y-4">
                    {activities.map((activity, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <img
                          src={activity.avatar}
                          alt={`${activity.name}'s avatar`}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium">{activity.name}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                          <p className="text-sm">{activity.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceDetails;
