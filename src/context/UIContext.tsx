"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type UIType = "default" | "alt";

interface UIContextProps {
  ui: UIType;
  setUI: (ui: UIType) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [ui, setUI] = useState<UIType>("default");
  return (
    <UIContext.Provider value={{ ui, setUI }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
}
