import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SubChurchContextProps {
  selectedSubChurchId: string | null;
  setSelectedSubChurchId: (subChurchId: string | null) => void;
}

const SubChurchContext = createContext<SubChurchContextProps | undefined>(undefined);

export const SubChurchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSubChurchId, setSelectedSubChurchIdState] = useState<string | null>(
    localStorage.getItem('selectedSubChurchId') || null
  );

  const setSelectedSubChurchId = (subChurchId: string | null) => {
    setSelectedSubChurchIdState(subChurchId);
  };

  useEffect(() => {
    localStorage.setItem('selectedSubChurchId', selectedSubChurchId || ''); // Save to local storage
  }, [selectedSubChurchId]);

  return (
    <SubChurchContext.Provider value={{ selectedSubChurchId, setSelectedSubChurchId }}>
      {children}
    </SubChurchContext.Provider>
  );
};

export const useSubChurchContext = () => {
  const context = useContext(SubChurchContext);
  if (!context) {
    throw new Error('useSubChurchContext must be used within a SubChurchProvider');
  }
  return context;
};
