import React from "react";
import Footer from "../components/Footer";

const Layout = ({ key, children }) => {
  return (
    <div key={key}>
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
