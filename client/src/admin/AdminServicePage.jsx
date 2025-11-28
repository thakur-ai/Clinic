import React, { useState, useEffect } from 'react';
import ServiceFormModal from './components/ServiceFormModal';

// Component for a single service card (Mobile View)
const ServiceCard = ({ service, openEditServiceForm, handleDeleteService }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition duration-200 ease-in-out">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
      <span className="text-xl font-extrabold text-indigo-600">
        ₹{service.basePrice}
      </span>
    </div>
    
    <div className="text-sm text-gray-600 mb-3 space-y-1">
      <p>
        <span className="font-semibold">Range:</span> 
        {service.minPrice && service.maxPrice
          ? ` ₹${service.minPrice} - ₹${service.maxPrice}`
          : ' N/A'}
      </p>
      <p className="line-clamp-2">
        <span className="font-semibold">Desc:</span> {service.description || 'No description provided.'}
      </p>
    </div>

    {/* Actions on Mobile */}
    <div className="flex justify-end space-x-2 border-t pt-3">
      <button
        onClick={() => openEditServiceForm(service)}
        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded text-xs transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        Edit
      </button>
      <button
        onClick={() => handleDeleteService(service._id)}
        className="flex items-center bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-xs transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16\"></path></svg>
        Delete
      </button>
    </div>
  </div>
);

function AdminServicePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Service Management Form
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [currentService, setCurrentService] = useState(null); // For editing
  const [serviceName, setServiceName] = useState('');
  const [serviceBasePrice, setServiceBasePrice] = useState('');
  const [serviceMinPrice, setServiceMinPrice] = useState('');
  const [serviceMaxPrice, setServiceMaxPrice] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');

  const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`; // Base URL for API

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': adminToken ? `Bearer ${adminToken}` : '',
    };
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const authHeaders = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/services`, { headers: authHeaders });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for services`);

      const servicesData = await response.json();
      setServices(servicesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Service Management Handlers
  const openAddServiceForm = () => {
    setCurrentService(null);
    setServiceName('');
    setServiceBasePrice('');
    setServiceMinPrice('');
    setServiceMaxPrice('');
    setServiceDescription('');
    setShowServiceForm(true);
  };

  const openEditServiceForm = (service) => {
    setCurrentService(service);
    setServiceName(service.name);
    setServiceBasePrice(service.basePrice);
    setServiceMinPrice(service.minPrice || '');
    setServiceMaxPrice(service.maxPrice || '');
    setServiceDescription(service.description || '');
    setShowServiceForm(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const serviceData = {
      name: serviceName,
      basePrice: serviceBasePrice,
      minPrice: serviceMinPrice || undefined, // Send undefined if empty to avoid empty string database issues
      maxPrice: serviceMaxPrice || undefined, // Send undefined if empty
      description: serviceDescription || undefined, // Send undefined if empty
    };
    try {
      let response;
      const headers = getAuthHeaders();
      // Ensure prices are numbers
      serviceData.basePrice = Number(serviceData.basePrice);
      if (serviceData.minPrice) serviceData.minPrice = Number(serviceData.minPrice);
      if (serviceData.maxPrice) serviceData.maxPrice = Number(serviceData.maxPrice);

      if (currentService) {
        // Update existing service
        response = await fetch(`${API_BASE_URL}/admin/services/${currentService._id}`, {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify(serviceData),
        });
      } else {
        // Add new service
        response = await fetch(`${API_BASE_URL}/admin/services`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(serviceData),
        });
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Clear and close form, then refresh data
      setShowServiceForm(false);
      setCurrentService(null); 
      fetchServices(); 
    } catch (err) {
      setError(`Failed to save service: ${err.message}`);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchServices(); // Refresh list
    } catch (err) {
      setError(`Failed to delete service: ${err.message}`);
    }
  };

  // --- Render Functions ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-lg font-medium text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-red-100 border-l-4 border-red-500 rounded shadow-md my-10">
        <h1 className="text-3xl font-bold text-red-700 mb-2">Error Loading Data</h1>
        <p className="text-red-600">Please try again. Details: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
      
      {/* Page Header */}
      <header className="text-center pb-8 border-b border-gray-100 mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Service Management 
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-500">
          Add, edit, and remove appointment services.
        </p>
      </header>

      {/* Action Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={openAddServiceForm}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6\"></path></svg>
          Add New Service
        </button>
      </div>
      
      {/* Service List */}
      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">All Services ({services.length})</h2>
        
        {services.length === 0 ? (
          <div className="text-center p-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500 text-lg">No services have been created yet. Click 'Add New Service' to start.</p>
          </div>
        ) : (
          <div className="hidden sm:block"> {/* Desktop Table View */}
            <div className="overflow-x-auto rounded-lg shadow-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service Name</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Base Price</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price Range</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                    <th className="py-3 px-6 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service._id} className="hover:bg-indigo-50/50 transition duration-100">
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700 font-bold">₹{service.basePrice}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                        {service.minPrice && service.maxPrice
                          ? `₹${service.minPrice} - ₹${service.maxPrice}`
                          : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">{service.description || 'N/A'}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditServiceForm(service)}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold"
                          aria-label={`Edit ${service.name}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="text-red-600 hover:text-red-900 font-semibold ml-2"
                          aria-label={`Delete ${service.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Mobile Card List View */}
        <div className="sm:hidden space-y-4">
          {services.map((service) => (
            <ServiceCard 
              key={service._id} 
              service={service} 
              openEditServiceForm={openEditServiceForm} 
              handleDeleteService={handleDeleteService} 
            />
          ))}
        </div>
      </section>

      {/* Modal is external to the main layout for clean separation */}
      <ServiceFormModal
        showServiceForm={showServiceForm}
        currentService={currentService}
        serviceName={serviceName}
        setServiceName={setServiceName}
        serviceBasePrice={serviceBasePrice}
        setServiceBasePrice={setServiceBasePrice}
        serviceMinPrice={serviceMinPrice}
        setServiceMinPrice={setServiceMinPrice}
        serviceMaxPrice={serviceMaxPrice}
        setServiceMaxPrice={setServiceMaxPrice}
        serviceDescription={serviceDescription}
        setServiceDescription={setServiceDescription}
        handleServiceSubmit={handleServiceSubmit}
        setShowServiceForm={setShowServiceForm}
      />
    </div>
  );
}

export default AdminServicePage;
