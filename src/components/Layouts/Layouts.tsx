import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutsProps {
  children: ReactNode;
}

function Layouts({ children }: LayoutsProps) {
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
}

export default Layouts;
