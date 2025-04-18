import React from "react";
import Providers from "./providers";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/global/Container";
import { Outlet, useNavigation } from "react-router-dom";
import { cn } from "@/lib/utils";

const HomeLayout = () => {
  const state = useNavigation();
  return (
    <>
      <Navbar></Navbar>

      <section className="align-items py-20 px-0">
        {state === "loading" ? (
          <Loading></Loading>
        ) : (
          <div className={` antialiased`}>
            <Providers>
              <Outlet></Outlet>
            </Providers>
          </div>
        )}
      </section>
    </>
  );
};

export default HomeLayout;
