import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Patient {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface PatientContextType {
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  isViewingPatient: boolean;
  clearSelectedPatient: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

interface PatientProviderProps {
  children: ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const isViewingPatient = selectedPatient !== null;

  const clearSelectedPatient = () => {
    setSelectedPatient(null);
  };

  const value: PatientContextType = {
    selectedPatient,
    setSelectedPatient,
    isViewingPatient,
    clearSelectedPatient,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}; 