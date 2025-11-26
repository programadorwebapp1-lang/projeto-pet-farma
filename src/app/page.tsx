"use client";
import { useUI } from "../context/UIContext";
import LayoutDefault from "../components/uiDefault/LayoutDefault";
import LayoutAlt from "../components/uiAlt/LayoutAlt";
import UISelector from "../components/UISelector";

export default function Home() {
  const { ui } = useUI();
  return (
    <>
      <UISelector />
      {ui === "default" ? (
        <LayoutDefault>
          {/* Conteúdo da home padrão aqui */}
        </LayoutDefault>
      ) : (
        <LayoutAlt>
          {/* Conteúdo da home alternativa aqui */}
        </LayoutAlt>
      )}
    </>
  );
}
