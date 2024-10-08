import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaTimes, FaBars } from "react-icons/fa";
import { useAuth } from "../../context/auth-context";
import { toast } from "react-toastify";
import Invoice from "../../assets/money.png";
import Setting from "../../assets/setting@3x.png";
import User from "../../assets/profile-2user.png";
import category from "../../assets/category-2.png";
import InvoiceDetails from "../invoice-details/InvoiceDetails";
import general from "../../assets/home-2.png";
import overview from "../../assets/category-2.png";
import message from "../../assets/message-question.png";
import inv from "../../assets/receipt-item.png";

interface Invoice {
  id: string;
  dueDate: string;
  amount: string;
  status: string;
  dateGroup?: string; // Optional date grouping for the invoices
}

const InvoiceOverview = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("Overview");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Add this
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch invoices from db.json via axios
        const invoiceResponse = await axios.get<Invoice[]>(
          "http://localhost:5000/invoices"
        );
        setInvoices(invoiceResponse.data);

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

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        toast.success("Successfully logged out!");
        navigate("/login");
      })
      .catch((error: unknown) => {
        console.error("Logout error: ", error);
      });
  };
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState); // Functional state update to toggle sidebar
    console.log("isSidebarOpen:", isSidebarOpen); // Debugging line
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "";
    const initials = name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Open modal
  const openModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  interface Activity {
    avatar: string;
    name: string;
    time: string;
    description: string;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hamburger Icon for small screens */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-[#F5F6FA] shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
        <button onClick={toggleSidebar} className="text-2xl">
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar: hidden by default on small screens, visible on larger screens */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 lg:w-1/4 bg-white text-gray-800 min-h-screen p-4 shadow-lg transform transition-transform duration-300 ease-in-out z-50`}
      >
        <ul className="space-y-6">
          <li
            className={`cursor-pointer flex items-center space-x-2 ${
              activeSection === "Getting Started"
                ? "text-blue-500"
                : "text-gray-800"
            }`}
            onClick={() => handleSectionClick("Getting Started")}
          >
            <img src={general} className="w-[24px] h-[24px]" />
            <span className="font-[400] text-[14px] leading-[18px] text-[#697598]">
              Getting Started
            </span>
          </li>
          <li
            className={`cursor-pointer flex items-center space-x-2 ${
              activeSection === "Overview" ? "text-blue-500" : "text-gray-800"
            }`}
            onClick={() => handleSectionClick("Overview")}
          >
            <img src={overview} className="w-[24px] h-[24px]" />
            <span className="font-[400] text-[14px] leading-[18px] text-[#697598]">
              Overview
            </span>
          </li>
          <li
            className={`cursor-pointer flex items-center space-x-2 ${
              activeSection === "Accounts" ? "text-blue-500" : "text-gray-800"
            }`}
            onClick={() => handleSectionClick("Accounts")}
          >
            <img src={general} className="w-[24px] h-[24px]" />
            <span className="font-[400] text-[14px] leading-[18px] text-[#697598]">
              Accounts
            </span>
          </li>
          <li
            className={`cursor-pointer flex items-center space-x-2 ${
              activeSection === "Invoice" ? "text-blue-500" : "text-gray-800"
            }`}
            onClick={() => handleSectionClick("Invoice")}
          >
            <img src={inv} className="w-[24px] h-[24px]" />
            <span className="font-[400] text-[14px] leading-[18px] text-[#697598]">
              Invoice
            </span>
          </li>
          <li
            className={`cursor-pointer flex items-center space-x-2 ${
              activeSection === "Beneficiary Management"
                ? "text-blue-500"
                : "text-gray-800"
            }`}
            onClick={() => handleSectionClick("Beneficiary Management")}
          >
            <img src={User} className="w-[24px] h-[24px]" />
            <span className="font-[400] text-[14px] leading-[18px] text-[#697598]">
              Beneficiary Management
            </span>
          </li>
          <li
            className={`cursor-pointer flex items-center space-x-2 ${
              activeSection === "Help" ? "text-blue-500" : "text-gray-800"
            }`}
            onClick={() => handleSectionClick("Help")}
          >
            <img src={message} className="w-[24px] h-[24px]" />
            <span className="font-[400] text-[14px] leading-[18px] text-[#697598]">
              Help Center
            </span>
          </li>
          <li
            className={`cursor-pointer flex items-center space-x-2 ${
              activeSection === "Settings" ? "text-blue-500" : "text-gray-800"
            }`}
            onClick={() => handleSectionClick("Settings")}
          >
            <img src={Setting} className="w-[24px] h-[24px]" />
            <span className="font-[400] text-[14px] leading-[18px] text-[#697598]">
              Settings
            </span>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Header */}
        <header className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-[#003EFF] text-white w-10 h-10 rounded-full flex items-center justify-center"
            >
              {getInitials(user?.displayName || "User")}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                <ul>
                  <li className="p-2 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </li>
                  <li className="p-2 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </li>
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Invoice Header Section with Buttons */}
        <section className="flex flex-col md:flex-row justify-between items-center p-4  mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Invoices
          </h2>
          <div className="flex space-x-4">
            <button className="text-[#697598] bg-[#fff] border border-[#E3E6EF] border-solid px-6 py-3 rounded-[40px] hover:bg-[#003EFF] hover:text-white">
              SEE WHAT'S NEXT
            </button>
            <button className="bg-[#003EFF] text-white px-6 py-3 rounded-[40px]">
              CREATE INVOICE
            </button>
          </div>
        </section>
        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          <div className="w-[339px] h-[200px] p-8 gap-4 rounded-[24px] opacity-100 bg-white shadow-md flex flex-col justify-between">
            <div>
              <img src={category} alt="" />
              <div className="flex justify-between items-center">
                <h3 className="text-gray-600 font-[400]">TOTAL PAID</h3>
                <span className="h-[41px] w-[66px] rounded-[24px] bg-[#B6FDD3] flex justify-center items-center">
                  1289
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-gray-900 mt-5">
                $4,120,102.75
              </p>
            </div>
          </div>

          <div className="w-[339px] h-[200px] p-8 gap-4 rounded-[24px] opacity-100 bg-white shadow-md flex flex-col justify-between">
            <div>
              <img src={category} alt="" />
              <div className="flex justify-between items-center">
                <h3 className="text-gray-600 font-[400]">TOTAL OVERDUE</h3>
                <span className="h-[41px] w-[66px] rounded-[24px] bg-[#FFB7BD] flex justify-center items-center">
                  6
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-gray-900 mt-5">
                $23,000.13
              </p>
            </div>
          </div>

          <div className="w-[339px] h-[200px] p-8 gap-4 rounded-[24px] opacity-100 bg-white shadow-md flex flex-col justify-between">
            <div>
              <img src={category} alt="" />
              <div className="flex justify-between items-center">
                <h3 className="text-gray-600 font-[400]">T TOTAL DRAFT</h3>
                <span className="h-[41px] w-[66px] rounded-[24px] bg-[#D9D9E0] flex justify-center items-center">
                  6
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-gray-900 mt-5">
                $12,200.00
              </p>
            </div>
          </div>

          <div className="w-[339px] h-[200px] p-8 gap-4 rounded-[24px] opacity-100 bg-white shadow-md flex flex-col justify-between">
            <div>
              <img src={category} alt="" />
              <div className="flex justify-between items-center">
                <h3 className="text-gray-600 font-[400]">TOTAL UNPAID</h3>
                <span className="h-[41px] w-[66px] rounded-[24px] bg-[#F8E39B] flex justify-center items-center">
                  6
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-gray-900 mt-5">
                $12,200.00
              </p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {/* Create Invoice with Blue Background */}
          <div className="w-[339x] h-[200px] p-8 gap-4 rounded-[24px] opacity-100 bg-[#003EFF] text-white shadow-md cursor-pointer">
            <img src={Invoice} alt="" />
            <h3 className="font-[500] text-[22px]">Create New Invoice</h3>
            <p className="text-[14px] font-[400] leading-[22px] mt-2">
              Create new invoices easily
            </p>
          </div>

          {/* Change Invoice Settings with White Background */}
          <div className="p-8 gap-4 rounded-[24px] opacity-100 bg-white shadow-md cursor-pointer">
            <h3 className="text-[#090b12] text-[22px] font-[500]">
              <img src={Setting} alt="" className="w-[80px] h-[80px]" />
              Change Invoice Settings
            </h3>
            <p className="text-[14px] font-[400] leading-[22px] mt-2">
              Customise your invoices
            </p>
          </div>

          {/* Manage Customer List with White Background */}
          <div className="w-[339x] h-[200px] p-8 gap-4 rounded-[24px] opacity-100 bg-white shadow-md cursor-pointer">
            <h3 className="text-[#373B47] text-[22px] font-[500]">
              <img src={User} alt="" className="w-[80px] h-[80px]" />
              Manage Customer List
            </h3>
            <p className="text-[14px] font-[400] leading-[22px] mt-2">
              Add and remove customers
            </p>
          </div>
        </section>

        {/* Main Section: Recent Invoices & Recent Activities */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Recent Invoices */}
          <div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Recent Invoices
                </h2>
                <button className="text-[#003EFF] bg-[#fff] border border-[#E3E6EF] border-solid px-6 py-3 rounded-[40px] hover:bg-[#003EFF] hover:text-white">
                  VIEW ALL INVOICES
                </button>
              </div>
              <ul className="divide-y divide-gray-200">
                {invoices.map((invoice, index) => (
                  <div key={invoice.id}>
                    {index === 0 ||
                    invoices[index - 1].dateGroup !== invoice.dateGroup ? (
                      <div className="bg-gray-100 py-2 px-4 rounded-md mb-2">
                        <h3 className="text-gray-700 font-semibold">
                          {invoice.dateGroup}
                        </h3>
                      </div>
                    ) : null}
                    <li
                      className="py-4 flex justify-between items-center cursor-pointer"
                      onClick={() => openModal(invoice)}
                    >
                      <span className="font-medium text-gray-800">
                        Invoice #{invoice.id}
                      </span>
                      <span className="text-gray-500">{invoice.dueDate}</span>
                      <span className="text-green-600 font-bold">
                        ${invoice.amount}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : invoice.status === "Overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </li>
                  </div>
                ))}
              </ul>
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
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Invoice Details Modal */}

            {isModalOpen && selectedInvoice && (
              <InvoiceDetails
                isOpen={isModalOpen}
                invoice={selectedInvoice}
                onClose={closeModal}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InvoiceOverview;
