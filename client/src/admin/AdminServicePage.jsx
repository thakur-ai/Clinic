import React, { useState, useEffect } from "react";
import ServiceFormModal from "./components/ServiceFormModal";

// --- Improved Component for Single Service Card (Mobile View) ---
const ServiceCard = ({ service, openEditServiceForm, handleDeleteService }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-300 hover:shadow-md">
    {/* Top Section: Name and Price */}
    <div className="flex justify-between items-start mb-3">
      <div className="pr-4">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {service.name}
        </h3>
        {/* Description limited to 2 lines */}
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {service.description || "No description provided."}
        </p>
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-xl font-extrabold text-indigo-600 tracking-tight">
          ₹{service.basePrice}
        </span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
          Base Price
        </span>
      </div>
    </div>

    {/* Middle Section: Range Badge */}
    {(service.minPrice || service.maxPrice) && (
      <div className="mb-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
          Range: ₹{service.minPrice || "0"} - ₹{service.maxPrice || "∞"}
        </span>
      </div>
    )}

    {/* Bottom Section: Action Buttons (Grid Layout for easy tapping) */}
    <div className="grid grid-cols-2 gap-3 mt-2 border-t border-gray-50 pt-3">
      <button
        onClick={() => openEditServiceForm(service)}
        className="flex items-center justify-center w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-indigo-600 rounded-xl text-sm font-semibold transition-colors active:scale-95 transform duration-150"
      >
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          ></path>
        </svg>
        Edit
      </button>
      <button
        onClick={() => handleDeleteService(service._id)}
        className="flex items-center justify-center w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors active:scale-95 transform duration-150"
      >
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          ></path>
        </svg>
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
  const [currentService, setCurrentService] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [serviceBasePrice, setServiceBasePrice] = useState("");
  const [serviceMinPrice, setServiceMinPrice] = useState("");
  const [serviceMaxPrice, setServiceMaxPrice] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";

  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      Authorization: adminToken ? `Bearer ${adminToken}` : "",
    };
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const authHeaders = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/services`, {
        headers: authHeaders,
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status} for services`);

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
    setServiceName("");
    setServiceBasePrice("");
    setServiceMinPrice("");
    setServiceMaxPrice("");
    setServiceDescription("");
    setShowServiceForm(true);
  };

  const openEditServiceForm = (service) => {
    setCurrentService(service);
    setServiceName(service.name);
    setServiceBasePrice(service.basePrice);
    setServiceMinPrice(service.minPrice || "");
    setServiceMaxPrice(service.maxPrice || "");
    setServiceDescription(service.description || "");
    setShowServiceForm(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const serviceData = {
      name: serviceName,
      basePrice: serviceBasePrice,
      minPrice: serviceMinPrice || undefined,
      maxPrice: serviceMaxPrice || undefined,
      description: serviceDescription || undefined,
    };
    try {
      let response;
      const headers = getAuthHeaders();
      serviceData.basePrice = Number(serviceData.basePrice);
      if (serviceData.minPrice)
        serviceData.minPrice = Number(serviceData.minPrice);
      if (serviceData.maxPrice)
        serviceData.maxPrice = Number(serviceData.maxPrice);

      if (currentService) {
        response = await fetch(
          `${API_BASE_URL}/admin/services/${currentService._id}`,
          {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(serviceData),
          }
        );
      } else {
        response = await fetch(`${API_BASE_URL}/admin/services`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(serviceData),
        });
      }

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      setShowServiceForm(false);
      setCurrentService(null);
      fetchServices();
    } catch (err) {
      setError(`Failed to save service: ${err.message}`);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this service? This action cannot be undone."
      )
    )
      return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/services/${serviceId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      fetchServices();
    } catch (err) {
      setError(`Failed to delete service: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-medium text-gray-600">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto p-6 bg-white border-l-4 border-red-500 rounded-lg shadow-md mt-10">
          <h1 className="text-xl sm:text-2xl font-bold text-red-700 mb-2">
            Error Loading Data
          </h1>
          <p className="text-red-600 text-sm sm:text-base">
            Please try again. Details: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div className="text-left">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Services
            </h1>
            <p className="mt-1 text-sm sm:text-lg text-gray-500">
              Manage your clinic's offerings and pricing.
            </p>
          </div>

          {/* Main Action Button - Full width on mobile, auto on desktop */}
          <button
            onClick={openAddServiceForm}
            className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 sm:py-2.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-30 active:scale-95"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Add New Service
          </button>
        </header>

        {/* Content Section */}
        <section>
          {/* Subheader / Count */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-700">All Services</h2>
            <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-bold">
              {services.length}
            </span>
          </div>

          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-3">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-900 font-medium">No services found</p>
              <p className="text-gray-500 text-sm mt-1 mb-4">
                Get started by creating a new service.
              </p>
              <button
                onClick={openAddServiceForm}
                className="text-indigo-600 font-semibold text-sm hover:underline"
              >
                Create Service
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Service Name
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Base Price
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Range
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="py-4 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr
                        key={service._id}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {service.name}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-indigo-600 font-bold">
                          ₹{service.basePrice}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                          {service.minPrice && service.maxPrice ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              ₹{service.minPrice} - ₹{service.maxPrice}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs italic">
                              Fixed
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">
                          {service.description || "-"}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditServiceForm(service)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="sm:hidden grid grid-cols-1 gap-4">
                {services.map((service) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    openEditServiceForm={openEditServiceForm}
                    handleDeleteService={handleDeleteService}
                  />
                ))}
              </div>
            </>
          )}
        </section>

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
    </div>
  );
}

export default AdminServicePage;
