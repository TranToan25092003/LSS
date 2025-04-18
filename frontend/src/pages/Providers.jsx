import React from "react";
import { Toaster } from "sonner";
import ThemeProvider from "./ThemeProvider";

const Providers = ({ children }) => {
  return (
    <>
      <Toaster richColors></Toaster>
      <ThemeProvider
        attribute={"class"}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </>
  );
};

export default Providers;
