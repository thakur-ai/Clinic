import React, { useEffect, useState } from 'react';
import { Mail, Phone, User, MessageSquare, CalendarDays, ScrollText, ListFilter, RotateCcw, ChevronDown, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import ContactModal from './components/ContactModal';

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const openContactModal = (message) => {
    setCurrentMessage(message);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setCurrentMessage('');
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/contacts`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': adminToken ? `Bearer ${adminToken}` : '',
        },
      });
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

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'All') return true;
    return contact.inquiryType === filter;
  });

  // Helper function for badge styles to reuse in Mobile and Desktop
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'Booking': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Support': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Feedback': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-6 lg:p-10 font-sans"> {/* Enhanced background, reduced padding for mobile */}
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-300/70 overflow-hidden border border-white/80"> {/* Stronger shadow and rounded corners */}
          
          {/* Header Section */}
          <div className="p-5 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm sm:shadow-none"> {/* Added sticky header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight"> {/* Bolder font */}
                Contact <span className="text-blue-600">Messages</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Manage incoming inquiries from your patients and website visitors.</p> {/* More descriptive text */}
            </div>

            <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3"> {/* Responsive filter/refresh group */}
              <div className="relative flex-1 sm:flex-none w-full sm:w-auto"> {/* Made filter full width on mobile */}
                <ListFilter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full sm:w-48 pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 text-sm font-medium focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-4 appearance-none cursor-pointer transition-all hover:bg-slate-100"
                >
                  <option value="All">All Inquiries</option>
                  <option value="Booking">Room Booking</option>
                  <option value="Support">Service Support</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              
            <button
              onClick={fetchContacts}
              className="w-full h-auto p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center sm:w-10 sm:h-10"
              title="Refresh Contacts"
              disabled={loading}
            >
              <RotateCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-slate-50/30 min-h-[400px] p-2 sm:p-6 lg:p-8"> {/* Added responsive padding, reduced padding for mobile */}
            
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 bg-blue-50 rounded-lg shadow-inner border border-blue-100"> {/* Blue themed loading */}
                <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div> {/* Larger spinner */}
                <p className="text-blue-700 text-lg font-semibold animate-pulse">Fetching messages...</p> {/* Bolder text */}
              </div>
            )}

            {error && (
              <div className="p-8 text-center bg-red-50 rounded-lg border-t-2 border-red-200 shadow-inner"> {/* More prominent error styling */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4 shadow-md"> {/* Larger icon container */}
                  <span className="text-red-600 text-3xl font-bold">!</span> {/* Larger exclamation */}
                </div>
                <h3 className="text-xl font-bold text-red-800">Failed to Load Messages</h3> {/* More descriptive error title */}
                <p className="text-red-600 mt-2 mb-6 text-base">{error}</p>
                <button onClick={fetchContacts} className="px-5 py-2.5 bg-white text-red-600 font-semibold rounded-lg shadow-sm hover:bg-red-50 transition-colors border border-red-200">Try Again</button>
              </div>
            )}

            {!loading && !error && filteredContacts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-slate-50 rounded-lg shadow-inner border border-slate-100"> {/* Enhanced empty state */}
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-md border border-slate-200">
                  <MessageSquare className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Messages Found</h3> {/* Bolder text */}
                <p className="text-slate-600 max-w-sm mx-auto text-base"> {/* Wider max-width for text */}
                  There are no {filter !== 'All' ? filter.toLowerCase() : ''} inquiries to display right now. Check back later!
                </p>
              </div>
            )}

            {!loading && !error && filteredContacts.length > 0 && (
              <>
                {/* --- DESKTOP VIEW (Table) --- */}
                <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-100"> {/* Added wrapper styling */}
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Name', 'Email', 'Phone', 'Inquiry Type', 'Message', 'Date'].map((header, i) => (
                          <th key={i} scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {filteredContacts.map((contact) => (
                        <tr key={contact._id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-slate-500 font-bold text-sm shadow-inner"> {/* Slightly larger avatar, added shadow */}
                                {contact.name.charAt(0)}
                              </div>
                              <span className="text-base font-semibold text-slate-900">{contact.name}</span> {/* Larger name font */}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600 hover:underline flex items-center gap-1.5"><Mail className="w-4 h-4 text-blue-500" />{contact.email}</a> {/* Added email icon */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            <a href={`tel:${contact.phone}`} className="hover:text-green-600 hover:underline flex items-center gap-1.5"><Phone className="w-4 h-4 text-green-500" />{contact.phone}</a> {/* Added phone icon */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full border ${getBadgeStyle(contact.inquiryType)}`}> {/* Larger badge text/padding */}
                              {contact.inquiryType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                            <div className="truncate group-hover:whitespace-normal group-hover:absolute group-hover:bg-white group-hover:shadow-lg group-hover:z-10 group-hover:p-4 group-hover:rounded-lg group-hover:border group-hover:border-slate-100 transition-all">
                              {contact.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {format(new Date(contact.date), 'MMM dd, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              {/* --- MOBILE VIEW (Cards) --- */}
              <div className="md:hidden flex flex-col gap-0.5 p-0.5"> {/* Further reduced gap and padding for cards */}
                {filteredContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="bg-white rounded-md p-1 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform duration-150 cursor-pointer"
                    onClick={() => openContactModal(contact.message)}
                  > {/* Further reduced padding, shadow, and border radius */}
                    {/* Card Header: Name, Date, Badge */}
                    <div className="flex justify-between items-center mb-0 pb-0 border-b border-slate-100"> {/* Further reduced mb and pb */}
                      <div className="flex items-center gap-0.5"> {/* Reduced gap */}
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm text-xs"> {/* Reduced avatar size */}
                          {contact.name.charAt(0)}
                        </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-[0.7rem] leading-tight">{contact.name}</h3> {/* Further reduced name font size */}
                            <div className="flex items-center gap-0.5 mt-0">
                              <span className={`px-0.5 py-0 text-[0.6rem] font-semibold uppercase tracking-tight rounded-full border ${getBadgeStyle(contact.inquiryType)}`}>
                                {contact.inquiryType}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[0.65rem] font-medium text-slate-500 bg-slate-50 px-0.5 py-0 rounded-md shadow-sm"> {/* Reduced date badge padding */}
                          {format(new Date(contact.date), 'MMM dd')}
                        </span>
                      </div>

                      {/* Card Body: Message */}
                      {/* The message will be shown in the modal on mobile screens */}
                      <div className="hidden md:block bg-slate-50 rounded-md p-1.5 mb-1.5 border border-slate-100 text-center"> {/* Reduced padding and margin */}
                        <MessageSquare className="w-3 h-3 text-slate-400 mx-auto mb-1" /> {/* Reduced message icon size and margin */}
                        <p className="text-xs text-slate-700 leading-relaxed italic"> {/* Reduced message font size */}
                          "{contact.message}"
                        </p>
                      </div>

                      {/* Card Footer: Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between pt-0.5 border-t border-slate-100 gap-0.5"> {/* Further reduced pt and gap */}
                        <a 
                          href={`mailto:${contact.email}`} 
                          className="flex-1 w-full flex items-center justify-center gap-0.5 text-[10px] text-blue-600 hover:text-blue-700 transition-colors py-0.5 px-1 rounded-md bg-blue-50 hover:bg-blue-100 border border-blue-200 font-semibold shadow-sm" >
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[60px]">Email</span>
                        </a>
                        <div className="hidden sm:block h-3 w-px bg-slate-200 mx-0.5"></div>
                        <a 
                          href={`tel:${contact.phone}`} 
                          className="flex-1 w-full flex items-center justify-center gap-0.5 text-[10px] text-green-600 hover:text-green-700 transition-colors py-0.5 px-1 rounded-md bg-green-50 hover:bg-green-100 border border-green-200 font-semibold shadow-sm" >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
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
