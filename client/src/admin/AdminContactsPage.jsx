import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  ListFilter,
  RotateCcw,
  ChevronDown,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import ContactModal from "./components/ContactModal";

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const openContactModal = (message) => {
    setCurrentMessage(message);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setCurrentMessage("");
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/contacts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: adminToken ? `Bearer ${adminToken}` : "",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (filter === "All") return true;
    return contact.inquiryType === filter;
  });

  // Helper function for badge styles
  const getBadgeStyle = (type) => {
    switch (type) {
      case "Booking":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Support":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Feedback":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 md:bg-gradient-to-br md:from-slate-50 md:to-slate-100 p-0 sm:p-6 lg:p-10 font-sans">
        <div className="max-w-7xl mx-auto bg-white md:rounded-3xl shadow-none md:shadow-2xl md:shadow-slate-300/70 overflow-hidden border-none md:border md:border-white/80 min-h-screen md:min-h-0">
          {/* Header Section */}
          <div className="p-5 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white sticky top-0 z-20 shadow-sm md:shadow-none">
            <div className="w-full md:w-auto flex justify-between items-center md:block">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  Inquiries
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  {filteredContacts.length} total messages
                </p>
              </div>
              {/* Mobile Refresh Icon only */}
              <button
                onClick={fetchContacts}
                className="md:hidden p-2 rounded-full bg-slate-100 text-slate-600 active:scale-90 transition-transform"
              >
                <RotateCcw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <div className="flex flex-row w-full md:w-auto items-center gap-3">
              <div className="relative flex-1 w-full md:w-auto">
                <ListFilter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full md:w-48 pl-10 pr-8 py-3 md:py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  <option value="All">All Messages</option>
                  <option value="Booking">Booking</option>
                  <option value="Support">Support</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Desktop Refresh Button */}
              <button
                onClick={fetchContacts}
                className="hidden md:flex w-10 h-10 p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 active:scale-95 items-center justify-center"
                title="Refresh Contacts"
                disabled={loading}
              >
                <RotateCcw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-slate-50 md:bg-slate-50/30 min-h-[calc(100vh-140px)] md:min-h-[400px] p-4 sm:p-6 lg:p-8">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 text-sm font-medium animate-pulse">
                  Updating feed...
                </p>
              </div>
            )}

            {error && (
              <div className="p-6 text-center bg-red-50 rounded-xl border border-red-100 mx-4 mt-4">
                <p className="text-red-600 font-medium mb-2">
                  Connection Error
                </p>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <button
                  onClick={fetchContacts}
                  className="px-6 py-2 bg-white text-red-600 text-sm font-semibold rounded-lg shadow-sm border border-red-200 active:bg-red-50"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && filteredContacts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No Messages
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  No {filter !== "All" ? filter.toLowerCase() : ""} inquiries
                  found.
                </p>
              </div>
            )}

            {!loading && !error && filteredContacts.length > 0 && (
              <>
                {/* --- DESKTOP VIEW (Table) --- */}
                <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-100">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        {[
                          "Name",
                          "Email",
                          "Phone",
                          "Inquiry Type",
                          "Message",
                          "Date",
                        ].map((header, i) => (
                          <th
                            key={i}
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {filteredContacts.map((contact) => (
                        <tr
                          key={contact._id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-slate-500 font-bold text-sm">
                                {contact.name.charAt(0)}
                              </div>
                              <span className="text-base font-semibold text-slate-900">
                                {contact.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            <a
                              href={`mailto:${contact.email}`}
                              className="hover:text-blue-600 hover:underline flex items-center gap-1.5"
                            >
                              <Mail className="w-4 h-4 text-blue-500" />
                              {contact.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            <a
                              href={`tel:${contact.phone}`}
                              className="hover:text-green-600 hover:underline flex items-center gap-1.5"
                            >
                              <Phone className="w-4 h-4 text-green-500" />
                              {contact.phone}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${getBadgeStyle(
                                contact.inquiryType
                              )}`}
                            >
                              {contact.inquiryType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                            <div className="truncate group-hover:whitespace-normal group-hover:absolute group-hover:bg-white group-hover:shadow-xl group-hover:z-10 group-hover:p-4 group-hover:rounded-lg group-hover:border group-hover:border-slate-100 transition-all cursor-pointer">
                              {contact.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {format(new Date(contact.date), "MMM dd, yyyy")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* --- MOBILE VIEW (Enhanced Cards) --- */}
                <div className="md:hidden flex flex-col space-y-4 pb-20">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
                    >
                      {/* Inquiry Type Stripe */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          contact.inquiryType === "Booking"
                            ? "bg-blue-500"
                            : contact.inquiryType === "Support"
                            ? "bg-indigo-500"
                            : contact.inquiryType === "Feedback"
                            ? "bg-purple-500"
                            : "bg-slate-300"
                        }`}
                      ></div>

                      {/* Header: Avatar, Name, Date */}
                      <div className="flex items-start justify-between mb-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg shadow-sm border border-slate-200">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight">
                              {contact.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(contact.date), "MMM dd")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md border ${getBadgeStyle(
                            contact.inquiryType
                          )}`}
                        >
                          {contact.inquiryType}
                        </span>
                      </div>

                      {/* Body: Message Snippet */}
                      <div
                        onClick={() => openContactModal(contact.message)}
                        className="mb-5 pl-2 group cursor-pointer"
                      >
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-50 group-active:border-blue-200 group-active:bg-blue-50 transition-colors">
                          "{contact.message}"
                        </p>
                        <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold mt-2 opacity-0 group-active:opacity-100 transition-opacity">
                          View full message <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Footer: Large Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 pl-2">
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100 active:scale-95 transition-transform"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-sm border border-emerald-100 active:scale-95 transition-transform"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={showContactModal}
        onClose={closeContactModal}
        message={currentMessage}
      />
    </>
  );
};

export default AdminContactsPage;
