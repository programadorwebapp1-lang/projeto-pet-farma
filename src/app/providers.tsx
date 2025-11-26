import { UIProvider } from "../context/UIContext";
import { CarrinhoProvider } from "../context/CarrinhoContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <CarrinhoProvider>{children}</CarrinhoProvider>
    </UIProvider>
  );
}
