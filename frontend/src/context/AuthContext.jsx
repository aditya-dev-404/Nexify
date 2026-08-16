import { useState } from 'react';
import { AuthContext } from './userAuth.js'; 

export const AuthProvider = ({ children }) => {
  const baseUrl = "https://nexify-backend-ar99.onrender.com"
  const value = {
    baseUrl,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
