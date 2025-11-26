"use client";
import { useUI } from "../context/UIContext";

export default function UISelector() {
  const { ui, setUI } = useUI();
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
      <button
        onClick={() => setUI("default")}
        style={{
          marginRight: 8,
          background: ui === "default" ? "#ff944d" : "#fff",
          color: ui === "default" ? "#fff" : "#ff944d",
          border: "1px solid #ff944d",
          borderRadius: 8,
          padding: "6px 14px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        UI Padrão
      </button>
      <button
        onClick={() => setUI("alt")}
        style={{
          background: ui === "alt" ? "#ff944d" : "#fff",
          color: ui === "alt" ? "#fff" : "#ff944d",
          border: "1px solid #ff944d",
          borderRadius: 8,
          padding: "6px 14px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        UI Alternativa
      </button>
    </div>
  );
}
