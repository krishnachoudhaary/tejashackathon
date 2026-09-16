import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const toggleCompare = (vendor) => {
    setCompareList((prev) => {
      const exists = prev.some((v) => v.id === vendor.id);
      if (exists) {
        return prev.filter((v) => v.id !== vendor.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 vendors simultaneously.');
          return prev;
        }
        return [...prev, vendor];
      }
    });
  };

  const removeFromCompare = (vendorId) => {
    setCompareList((prev) => prev.filter((v) => v.id !== vendorId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (vendorId) => {
    return compareList.some((v) => v.id === vendorId);
  };

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
