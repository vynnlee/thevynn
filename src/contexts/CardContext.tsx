// src/contexts/CardContext.tsx
import React, { createContext, useState, ReactNode, useCallback } from "react";

interface CardContextType {
  topZIndex: number;
  bringToFront: () => number;
}

export const CardContext = createContext<CardContextType>({
  topZIndex: 1,
  bringToFront: () => 1,
});

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topZIndex, setTopZIndex] = useState(1);

  const bringToFront = useCallback(() => {
    setTopZIndex((prev) => prev + 1);
    return topZIndex + 1;
  }, [topZIndex]);

  return (
    <CardContext.Provider value={{ topZIndex, bringToFront }}>
      {children}
    </CardContext.Provider>
  );
};
