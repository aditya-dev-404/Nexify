import { useState } from 'react';
import { AuthContext } from './userAuth.js'; 
import { API_URL } from '../config/env.js';

export const AuthProvider = ({ children }) => {
  const value = {
    baseUrl: API_URL,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
