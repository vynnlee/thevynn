import React, { createContext, useContext, useState, ReactNode } from 'react'

type CursorOption = 'arrow' | 'grab' | 'move' | 'pointer' | 'zoomIn' | 'zoomOut' | 'link'

interface CursorContextProps {
      cursorOption: CursorOption
      setCursorOption: (option: CursorOption) => void
}

const CursorContext = createContext<CursorContextProps | undefined>(undefined)

export const CursorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
      const [cursorOption, setCursorOption] = useState<CursorOption>('arrow')

      return (
            <CursorContext.Provider value={{ cursorOption, setCursorOption }}>
                  {children}
            </CursorContext.Provider>
      )
}

export const useCursor = () => {
      const context = useContext(CursorContext)
      if (!context) {
            throw new Error('useCursor must be used within a CursorProvider')
      }
      return context
}