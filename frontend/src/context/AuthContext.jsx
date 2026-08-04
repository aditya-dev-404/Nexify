import { useState } from 'react';
import { AuthContext } from './userAuth.js'; 

export const AuthProvider = ({ children }) => {
  const baseUrl = "http://localhost:8080"
  const value = {
    baseUrl,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
