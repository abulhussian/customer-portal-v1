import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initializeData, getData, saveData } from '../seedData.js';

const DataContext = createContext();

const initialState = {
  returns: [],
  taxReturns: [],
  documents: [],
  invoices: [],
  payments: [],
  activities: [],
  comments: [],
  users: [],
  isLoading: true
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload, isLoading: false };
    case 'UPDATE_RETURNS':
      return { ...state, returns: action.payload };
    case 'UPDATE_TAX_RETURNS':
      return { ...state, taxReturns: action.payload };
    case 'UPDATE_INVOICES':
      return { ...state, invoices: action.payload };
    case 'UPDATE_PAYMENTS':
      return { ...state, payments: action.payload };
    case 'UPDATE_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'UPDATE_COMMENTS':
      return { ...state, comments: action.payload };
    case 'UPDATE_USERS':
      return { ...state, users: action.payload };
    case 'ADD_ACTIVITY':
      return { 
        ...state, 
        activities: [action.payload, ...state.activities.slice(0, 49)] // Keep only 50 most recent
      };
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = initializeData();
    dispatch({ type: 'LOAD_DATA', payload: data });
  };

  const saveAndUpdate = (updates) => {
    const currentData = getData();
    const newData = { ...currentData, ...updates };
    saveData(newData);
    dispatch({ type: 'LOAD_DATA', payload: newData });
  };

  const updatereturns = (returns) => {
    dispatch({ type: 'UPDATE_RETURNS', payload: returns });
    saveAndUpdate({ returns });
  };

  const updateTaxReturns = (taxReturns) => {
    dispatch({ type: 'UPDATE_TAX_RETURNS', payload: taxReturns });
    saveAndUpdate({ taxReturns });
  };

  const updateInvoices = (invoices) => {
    dispatch({ type: 'UPDATE_INVOICES', payload: invoices });
    saveAndUpdate({ invoices });
  };

  const updatePayments = (payments) => {
    dispatch({ type: 'UPDATE_PAYMENTS', payload: payments });
    saveAndUpdate({ payments });
  };

  const updateUsers = (users) => {
    dispatch({ type: 'UPDATE_USERS', payload: users });
    saveAndUpdate({ users });
  };

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    const currentData = getData();
    const updatedActivities = [newActivity, ...currentData.activities];
    
    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
    saveAndUpdate({ activities: updatedActivities });
  };

  const addComment = (customerId, content, userId, userName) => {
    const newComment = {
      id: Date.now().toString(),
      customerId,
      userId,
      userName,
      content,
      createdAt: new Date().toISOString()
    };

    const currentData = getData();
    const updatedComments = [...currentData.comments, newComment];
    
    dispatch({ type: 'UPDATE_COMMENTS', payload: updatedComments });
    saveAndUpdate({ comments: updatedComments });
    
    return newComment;
  };

  const value = {
    ...state,
    updatereturns,
    updateTaxReturns,
    updateInvoices,
    updatePayments,
    updateUsers,
    addActivity,
    addComment,
    refreshData: loadData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}