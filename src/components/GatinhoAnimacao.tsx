import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface GatinhoAnimacaoProps {
  mostrar: boolean;
  origem?: { x: number; y: number };
  destino?: { x: number; y: number };
  onFim?: () => void;
}

export default function GatinhoAnimacao({ mostrar, origem, destino, onFim }: GatinhoAnimacaoProps) {
  const gatinhoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mostrar && gatinhoRef.current && origem && destino) {
      const gatinho = gatinhoRef.current;
      gatinho.style.left = origem.x + "px";
      gatinho.style.top = origem.y + "px";
      gatinho.style.transform = "none";
      gatinho.style.transition = "none";
      setTimeout(() => {
        gatinho.style.transition = "transform 1s cubic-bezier(0.7,0.1,0.7,1)";
        gatinho.style.transform = `translate(${destino.x - origem.x}px, ${destino.y - origem.y}px)`;
      }, 10);
      const timer = setTimeout(() => {
        gatinho.style.transform = "none";
        onFim && onFim();
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [mostrar, origem, destino, onFim]);

  if (!mostrar || !origem || !destino) return null;
  return (
    <div
      ref={gatinhoRef}
      className="gatinho-animacao"
      style={{ position: "fixed", left: origem.x, top: origem.y, zIndex: 9999, pointerEvents: "none" }}
    >
      <Image src="/imagens/cuidados-filhote-de-gato.jpg" alt="Gatinho" width={60} height={60} />
    </div>
  );
}
