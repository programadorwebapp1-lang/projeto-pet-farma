
import React, { useEffect } from "react";
import HeaderAlt from "./HeaderAlt";
import BannerAlt from "./BannerAlt";
import EspecialidadesAlt from "./EspecialidadesAlt";
import ContatoAlt from "./ContatoAlt";
import FooterAlt from "./FooterAlt";

export default function LayoutAlt({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const id = "ui-alt-global-css";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "/uiAlt.global.css";
      document.head.appendChild(link);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);
  return (
    <>
      <div className="pata-bg"></div>
      <HeaderAlt />
      <BannerAlt />
      <main>
        <EspecialidadesAlt />
        <ContatoAlt />
        {children}
      </main>
      <FooterAlt />
    </>
  );
}
