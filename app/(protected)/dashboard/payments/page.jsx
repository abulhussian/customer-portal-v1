"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, Filter, RotateCcw, Calendar, X, Search, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { BASE_URL } from '@/src/components/BaseUrl';
import { motion } from "framer-motion"
import { useFilterModal } from '@/src/components/DashboardLayout';
export default function Payments() {
   const { isFilterModalOpen, setIsFilterModalOpen } = useFilterModal();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [displayedPayments, setDisplayedPayments] = useState([]);
  const [filters, setFilters] = useState({
    status: 'All',
    dateRange: 'All',
    searchQuery: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [processingRefund, setProcessingRefund] = useState({});
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  // const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'All',
    dateRange: 'All'
  });
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('userProfile');
      const user = userString ? JSON.parse(userString) : null;
      if (user) {
        const loggedInUser = {
          id: user?.uid,
          name: user?.displayName,
          email: user?.email,
          role: user?.role
        };
        setCurrentUser(loggedInUser);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setIsLoading(false);
    }
  }, []);

  // Permission function
  const can = (permission) => {
    const permissions = {
      'action:payment.refund': true
    };
    return permissions[permission] || false;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Load payments from API
  useEffect(() => {
    if (currentUser) {
      loadPayments();
    }
  }, [currentUser]);

  // Apply filters when payments or filters change
  useEffect(() => {
    applyFilters();
  }, [payments, filters]);

  // Update displayed payments when filtered payments or pagination changes
  useEffect(() => {
    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
    setDisplayedPayments(currentItems);
  }, [filteredPayments, currentPage, itemsPerPage]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch payments from API
      const response = await fetch(`${BASE_URL}/api/getPayments/${currentUser?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.status} ${response.statusText}`);
      }

      const paymentData = await response.json();

      // Transform the API data to match our UI structure
      const transformedPayments = paymentData.map(payment => ({
        id: payment.id,
        transactionId: payment.transaction_id,
        customerId: payment.createdby_id,
        customerName: payment.payment_payload?.notes?.customer_name || 'Unknown Customer',
        amount: parseFloat(payment.paid_amount) || 0,
        method: payment.transaction_type === 'card' ? 'Credit Card' : payment.transaction_type,
        status: mapPaymentStatus(payment.payment_status),
        description: `Invoice #${payment.invoice_id}`,
        createdAt: payment.created_at,
        updatedAt: payment.modified_at,
        rawData: payment // Keep original data for reference
      }));

      setPayments(transformedPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
      setError('Failed to load payments. Please try again.');

      // Fallback to demo data if API fails
      const demoPayments = [
        {
          id: '1',
          transactionId: 'txn_123456',
          customerId: 'cust_123',
          customerName: 'John Doe',
          amount: 99.99,
          method: 'Credit Card',
          status: 'paid',
          description: 'Invoice #INV-001',
          createdAt: '2023-10-15T10:30:00Z',
          updatedAt: '2023-10-15T10:30:00Z'
        },
        {
          id: '2',
          transactionId: 'txn_789012',
          customerId: 'cust_456',
          customerName: 'Jane Smith',
          amount: 149.99,
          method: 'PayPal',
          status: 'pending',
          description: 'Invoice #INV-002',
          createdAt: '2023-10-14T14:45:00Z',
          updatedAt: '2023-10-14T14:45:00Z'
        }
      ];

      setPayments(demoPayments);
    } finally {
      setIsLoading(false);
    }
  };

  // Map Razorpay status to our status system
  const mapPaymentStatus = (status) => {
    switch (status) {
      case 'created': return 'pending';
      case 'authorized': return 'pending';
      case 'captured': return 'paid';
      case 'failed': return 'failed';
      default: return status;
    }
  };

  const applyFilters = () => {
    let filtered = [...payments];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.customerName.toLowerCase().includes(query) ||
        p.transactionId.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.amount.toString().includes(query) ||
        p.status.toLowerCase().includes(query) || // Add status to search
        p.method.toLowerCase().includes(query) // Add payment method to search
      );
    }

    // Apply status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== 'All') {
      const now = new Date();
      const days = parseInt(filters.dateRange);
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(p => new Date(p.createdAt) >= cutoff);
    }

    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleFilterApply = () => {
    setAppliedFilters({ ...filters });
    setIsFilterModalOpen(false);
    applyFilters();
  };

  const handleFilterReset = () => {
    const resetFilters = {
      status: 'All',
      dateRange: 'All',
      searchQuery: ''
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  const removeFilter = (filterType) => {
    if (filterType === 'status') {
      const newFilters = { ...filters, status: 'All' };
      setFilters(newFilters);
      setAppliedFilters(newFilters);
    } else if (filterType === 'dateRange') {
      const newFilters = { ...filters, dateRange: 'All' };
      setFilters(newFilters);
      setAppliedFilters(newFilters);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white';
      case 'pending':
        return 'bg-gradient-to-r from-amber-400 to-amber-500 text-white';
      case 'refunded':
        return 'bg-gradient-to-r from-rose-400 to-rose-600 text-white';
      case 'failed':
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      default:
        return 'bg-gradient-to-r from-slate-300 to-slate-400 text-gray-900';
    }
  };

  const calculateTotals = () => {
    const total = filteredPayments.reduce((sum, p) => sum + (p.status === 'Refunded' ? 0 : p.amount), 0);
    const refunded = filteredPayments.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + p.amount, 0);
    return { total, refunded, count: filteredPayments.length };
  };

  // Calculate pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPayments.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Count active filters (excluding 'All' and empty search)
  const activeFiltersCount = [
    appliedFilters.status !== 'All',
    appliedFilters.dateRange !== 'All',
    appliedFilters.searchQuery !== ''
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2 sm:p-4">
      <div className="flex items-center justify-between">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm">
            <span>{error}</span>
            <button
              onClick={loadPayments}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
  {/* Paid Transactions Card (Top Right Curve) */}
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    onClick={() => {
      if (filters.status === "paid") {
        setFilters({ ...filters, status: "All" });
        setAppliedFilters({ ...appliedFilters, status: "All" });
      } else {
        setFilters({ ...filters, status: "paid" });
        setAppliedFilters({ ...appliedFilters, status: "paid" });
      }
    }}
    className="relative rounded-tl-2xl rounded-sm p-2 shadow-md hover:shadow-lg transition-shadow 
               bg-gradient-to-r from-emerald-500 to-emerald-600 text-white cursor-pointer"
  >
    {/* Tick Indicator */}
    {filters.status === "paid" && (
      <div className="absolute top-0 right-2 transform translate-x-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full p-1">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        
      </div>
    )}
    <div className="flex  items-start  gap-2">
            <div className="w-1/6 border-b-2 pb-2 border-emerald-700 ">
      <div className="p-1 flex justify-center items-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700/20">
        <CreditCard className="h-4 w-4 text-white" />
      </div>
      </div>
      <h3 className="text-sm font-bold  ">Paid Transactions</h3>
    </div>
    <div>
      <div className="text-xl font-bold mt-2 pl-2 ">
        {filteredPayments.filter(p => p.status === "paid").length}
      </div>
    </div>
  </motion.div>

  {/* Total Transactions Card */}
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    onClick={() => {
      setFilters({ ...filters, status: "All" });
      setAppliedFilters({ ...appliedFilters, status: "All" });
    }}
    className="relative p-2 rounded-sm shadow-md hover:shadow-lg transition-shadow 
               bg-gradient-to-r from-teal-500 to-teal-600 text-white cursor-pointer"
  >
    {/* Tick Indicator */}
    {filters.status === "All" && (
      <div className="absolute top-0 right-2 transform translate-x-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-full p-1">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
      </div>
    )}
    <div className="flex  items-start  gap-2">
      <div className="w-1/6 border-b-2 pb-2 border-emerald-700 ">
      <div className="p-1 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-teal-700/20">
        <Calendar className="h-4 w-4 text-white" />
      </div>
      </div>
      <h3 className="text-sm font-bold">Total Transactions</h3>
    </div>
    <div>
      <div className="text-xl font-bold mt-2 ">{filteredPayments.length}</div>
    </div>
  </motion.div>

  {/* Pending Transactions Card (Bottom Left Curve) */}
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    onClick={() => {
      if (filters.status === "pending") {
        setFilters({ ...filters, status: "All" });
        setAppliedFilters({ ...appliedFilters, status: "All" });
      } else {
        setFilters({ ...filters, status: "pending" });
        setAppliedFilters({ ...appliedFilters, status: "pending" });
      }
    }}
    className="relative rounded-br-2xl rounded-sm p-2 pt-2 shadow-md hover:shadow-lg transition-shadow 
               bg-gradient-to-r from-amber-400 to-amber-500 text-white cursor-pointer"
  >
    {/* Tick Indicator */}
    {filters.status === "pending" && (
      <div className="absolute top-0 right-2 transform translate-x-1/2 -translate-y-1/2">
          <div className="bg-amber-500 rounded-full p-1">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
      </div>
    )}
    <div className="flex  items-start  gap-2">
      <div className="w-1/6 border-b-2 pb-2 border-amber-500 ">
      <div className="p-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600/20 flex justify-center items-center">
        <CreditCard className="h-4 w-4 text-white" />
      </div>
      </div>
      <h3 className="text-sm font-bold">Pending Transactions</h3>
    </div>
    <div>
      <div className="text-xl font-bold pl-2 ">
        {filteredPayments.filter(p => p.status === "pending").length}
      </div>
    </div>
  </motion.div>
</div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search payments..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
          </div>

          <button
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-1" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Applied Filters */}
        <div className='flex flex-col sm:flex-row gap-2 mt-4'>
          {(filters.searchQuery || filters.status !== 'All' || filters.dateRange !== 'All') && (
            <div className="flex flex-col border-r-0 sm:border-r-2 pr-0 sm:pr-2 items-start">
              <h1 className="text-gray-700 font-bold text-sm sm:text-base">Applied Filters</h1>
              <button
                onClick={() => {
                  setFilters({
                    searchQuery: '',
                    status: 'All',
                    dateRange: 'All'
                  });
                  setAppliedFilters({
                    status: 'All',
                    dateRange: 'All'
                  });
                }}
                className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Applied Filters Display */}
          <div className="flex flex-wrap gap-2">
            {filters.searchQuery && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                Search: {filters.searchQuery}
                <button
                  onClick={() => {
                    setFilters({ ...filters, searchQuery: '' });
                    setAppliedFilters({ ...appliedFilters });
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.status !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                Status: {appliedFilters.status}
                <button
                  onClick={() => removeFilter('status')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.dateRange !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                Date: {appliedFilters.dateRange === '7' ? 'Last 7 Days' :
                  appliedFilters.dateRange === '30' ? 'Last 30 Days' :
                    appliedFilters.dateRange === '90' ? 'Last 90 Days' : appliedFilters.dateRange}
                <button
                  onClick={() => removeFilter('dateRange')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Payments</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="All">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="All">All Time</option>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleFilterReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                onClick={handleFilterApply}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>

            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Table Section with Scroll */}
        <div className="overflow-y-auto">
          <div className="max-h-[300px] sm:max-h-[400px]" style={{ overflow: 'scroll' }}>
            <table className="w-full">
              <thead className="bg-gray-200 sticky top-0 z-10 py-3">
                <tr>
                  <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SN.NO
                  </th>
                  <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
       <tbody className="bg-white divide-y divide-gray-200">
      {displayedPayments.map((payment, index) => (
        <tr
          key={payment.id}
          onClick={() => setSelectedRowId(payment.id)}
          className={`cursor-pointer transition-all text-center 
            ${
              selectedRowId === payment.id
                ? "bg-indigo-50 shadow-lg  hover:bg-indigo-100 hover:shadow-xl"
                : "hover:bg-gray-50 hover:shadow-md"
            }`}
        >
          <td className="px-4 py-3">
            <div className="text-xs sm:text-sm font-mono text-gray-900">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="text-xs sm:text-sm font-mono text-gray-900">{payment.transactionId}</div>
            <div className="text-xs text-gray-500">ID: {payment.id}</div>
          </td>
          <td className="px-4 py-3">
            <div className="text-xs sm:text-sm text-gray-900">{payment.customerName}</div>
            <div className="text-xs text-gray-500">ID: {payment.customerId}</div>
          </td>
          <td className="px-4 py-3">
            <div className="text-xs sm:text-sm font-medium text-gray-900">
              {formatCurrency(payment.amount)}
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="text-xs sm:text-sm text-gray-900">{payment.method}</div>
          </td>
          <td className="px-4 py-3">
            <span
              className={`inline-flex justify-center items-center min-w-[80px] sm:min-w-[100px] px-4 py-2 text-xs font-semibold rounded-lg ${getStatusColor(
                payment.status
              )}`}
            >
              {payment.status}
            </span>
          </td>
          <td className="px-4 py-3 text-xs sm:text-sm text-gray-500">
            {formatDate(payment.createdAt)}
          </td>
          <td className="px-4 py-3">
            <div className="text-xs sm:text-sm text-gray-900">{payment.description}</div>
          </td>
        </tr>
      ))}
    </tbody>
            </table>
          </div>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No payments match the current filters.
            </p>
          </div>
        )}

        {/* Pagination */}
       {filteredPayments.length > 0 && (
  <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t sticky bottom-0 border-gray-200">
    {/* Showing results */}
    <div className="text-xs sm:text-sm text-gray-700">
      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
      <span className="font-medium">
        {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
      </span>{" "}
      of <span className="font-medium">{filteredPayments.length}</span> results
    </div>

    {/* Pagination */}
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {/* Previous Button */}
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-1 text-xs sm:text-sm border border-gray-300 bg-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-3 py-1 text-xs sm:text-sm border rounded-md 
            ${currentPage === number
              ? "border-[#3F058F] bg-[#3F058F] text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          {number}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === pageNumbers.length}
        className="flex items-center gap-1 px-3 py-1 text-xs sm:text-sm border border-gray-300 bg-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}